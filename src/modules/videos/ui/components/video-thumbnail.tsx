import { formatDuration } from "@/lib/utils";
import Image from "next/image";

type VideoThumbnailProps = {
  thumbnailUrl?: string | null;
  title: string;
  previewUrl?: string | null;
  duration: number;
};
export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  thumbnailUrl,
  title,
  previewUrl,
  duration,
}) => {
  return (
    <div className="relative group">
      {/* thumbnail wrapper */}
      <div className="relative w-full overflow-hidden rounded-xl aspect-video">
        <Image
          src={thumbnailUrl ?? "/placeholder.svg"}
          alt={title}
          fill
          className="size-full object-cover group-hover:opacity-0"
        />
        <Image
        unoptimized={!!previewUrl}
          src={previewUrl ?? "/placeholder.svg"}
          alt={title}
          fill
          className="size-full object-cover group-hover:opacity-100 opacity-0"
        />
      </div>
      {/* video duration box */}
      <div className="absolute bottom-2 right-0 px-1 py-0.5 bg-gradient-to-t from-black/50 to-transparent">
        <span className="text-white text-xs">{formatDuration(duration)}</span>
      </div>
    </div>
  );
};
