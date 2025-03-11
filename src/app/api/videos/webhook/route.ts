import { mux } from "@/lib/mux";
import {
  VideoAssetReadyWebhookEvent,
  VideoAssetCreatedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
} from "@mux/mux-node/resources/webhooks";
import { headers } from "next/headers";
import { WebhookEvent } from "@/types";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { eq } from "drizzle-orm";

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
    muxWebhookSecret,
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
  }

  return new Response("mux web hook recieved success", { status: 200 });
};
