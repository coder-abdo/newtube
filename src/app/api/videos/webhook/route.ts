import { mux } from "@/lib/mux";
import {
  VideoAssetReadyWebhookEvent,
  VideoAssetCreatedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
  VideoAssetDeletedWebhookEvent,
} from "@mux/mux-node/resources/webhooks";
import { headers } from "next/headers";
import { WebhookEvent } from "@/types";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

const muxWebhookSecret = process.env.MUX_WEBHOOK_SECRET!;

export const POST = async (request: Request) => {
  if (!muxWebhookSecret) {
    throw new Error("Missing Mux webhook secret");
  }

  const headersPayload = await headers();
  const muxSignature = headersPayload.get("mux-signature");

  if (!muxSignature) {
    return new Response("Missing Mux signature", { status: 400 });
  }
  const payload = await request.json();
  const body = JSON.stringify(payload);
  mux.webhooks.verifySignature(
    body,
    {
      "mux-signature": muxSignature,
    },
    muxWebhookSecret
  );

  switch (payload.type as WebhookEvent["type"]) {
    case "video.asset.created": {
      const data = payload.data as VideoAssetCreatedWebhookEvent["data"];
      if (!data.upload_id) {
        return new Response("Missing upload_id", { status: 400 });
      }
      await db
        .update(videos)
        .set({
          muxStatus: data.status,
          muxAssetId: data.id,
        })
        .where(eq(videos.muxUploadId, data.upload_id));
      break;
    }
    case "video.asset.ready": {
      const data = payload.data as VideoAssetReadyWebhookEvent["data"];
      if (!data.upload_id) {
        return new Response("Missing upload_id", { status: 400 });
      }
      const playbackId = data.playback_ids?.[0].id;
      if (!playbackId) {
        return new Response("Missing playbackId", { status: 400 });
      }

      const tempThumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
      const tempPreviewUrl = `https://image.mux.com/${playbackId}/animated.gif`;
      const utapi = new UTApi();
      const [uploadedThumbnail, uploadedPreview] =
        await utapi.uploadFilesFromUrl([tempThumbnailUrl, tempPreviewUrl]);
      if (!uploadedThumbnail.data || !uploadedPreview.data) {
        return new Response("Failed to upload thumbnail or preview", {
          status: 500,
        });
      }
      const { key: thumbnailKey, url: thumbnailUrl } = uploadedThumbnail.data;
      const { key: previewKey, url: previewUrl } = uploadedPreview.data;
      const duration = data.duration ? Math.round(data.duration * 1000) : 0;
      await db
        .update(videos)
        .set({
          muxStatus: data.status,
          muxPlaybackId: playbackId,
          muxAssetId: data.id,
          thumbnailUrl: thumbnailUrl,
          thumbnailKey: thumbnailKey,
          previewUrl: previewUrl,
          previewKey: previewKey,
          duration,
        })
        .where(eq(videos.muxUploadId, data.upload_id));
      break;
    }
    case "video.asset.errored": {
      const data = payload.data as VideoAssetErroredWebhookEvent["data"];
      if (!data.upload_id) {
        return new Response("Missing upload_id", { status: 400 });
      }
      await db
        .update(videos)
        .set({
          muxStatus: data.status,
        })
        .where(eq(videos.muxUploadId, data.upload_id));
      break;
    }
    case "video.asset.deleted": {
      const data = payload.data as VideoAssetDeletedWebhookEvent["data"];
      if (!data.upload_id) {
        return new Response("Missing upload_id", { status: 400 });
      }
      await db.delete(videos).where(eq(videos.muxUploadId, data.upload_id));
      break;
    }
    case "video.asset.track.ready": {
      const data = payload.data as VideoAssetTrackReadyWebhookEvent["data"] & {
        asset_id: string;
      };
      const assetId = data.asset_id;
      const trackId = data.id;
      const status = data.status;
      if (!assetId) {
        return new Response("Missing asset_id", { status: 400 });
      }
      await db
        .update(videos)
        .set({
          muxTrackId: trackId,
          muxTrackStatus: status,
        })
        .where(eq(videos.muxAssetId, assetId));
      break;
    }
    default: {
      return new Response("Unknown event type", { status: 400 });
    }
  }

  return new Response("mux web hook recieved success", { status: 200 });
};
