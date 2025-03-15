"use client";

import MuxPlayer from "@mux/mux-player-react";

type VideoPlayerProps = Partial<{
  playbackId: string | null;
  posterUrl: string | null;
  autoplay: boolean;
  onPlay: () => void;
}>;
export const VideoPlayer = ({
  playbackId,
  posterUrl,
  autoplay,
  onPlay,
}: VideoPlayerProps) => {
  if (!playbackId) return null;
  return (
    <MuxPlayer
      playbackId={playbackId}
      poster={posterUrl ?? "/placeholder.svg"}
      playerInitTime={0}
      autoPlay={autoplay}
      className="w-full h-full object-contain"
      accentColor="#1e1e1e"
      onPlay={onPlay}
    />
  );
};
