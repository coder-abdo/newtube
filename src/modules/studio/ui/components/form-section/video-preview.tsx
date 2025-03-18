"use client";

import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/modules/videos/ui/components/video-player";
import { snakeCaseToTitle } from "@/lib/utils";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { trpc } from "@/trpc/client";

type VideoPreviewProps = {
  videoId: string;
};

export const VideoPreview = ({ videoId }: VideoPreviewProps) => {
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const fullUrl = `${
    process.env.VERCEL_URL || "http://localhost:3000"
  }/studio/videos/${videoId}`;
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl overflow-hidden h-fit bg-[#f9f9f9]">
      <div className="aspec-video overflow-hidden relative">
        <VideoPlayer
          playbackId={video.muxPlaybackId}
          posterUrl={video.thumbnailUrl}
        />
      </div>
      <div className="p-4 flex flex-col gap-y-6">
        <div className="flex justify-between items-center gap-x-2">
          <div className="flex flex-col gap-y-1">
            <p className="text-xs text-muted-foreground">Video link</p>
            <div className="flex items-center gap-x-2">
              <Link href={`/studio/videos/${videoId}`}>
                <span className="text-sm line-clamp-1 text-blue-500">
                  {fullUrl}
                </span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                type="button"
                onClick={onCopy}
                disabled={isCopied}
              >
                {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-y-1">
            <p className="text-muted-foreground text-xs">Video status</p>
            <p className="text-sm">
              {snakeCaseToTitle(video.muxStatus ?? "preparing")}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-y-1">
            <p className="text-muted-foreground text-xs">Subtitle status</p>
            <p className="text-sm">
              {snakeCaseToTitle(video.muxTrackStatus ?? "no_audio")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
