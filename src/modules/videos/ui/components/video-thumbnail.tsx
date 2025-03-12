import Image from "next/image";

type VideoThumbnailProps = {
  thumbnailUrl?: string | null;
};
export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  thumbnailUrl,
}) => {
  return (
    <div className="relative">
      {/* thumbnail wrapper */}
      <div className="relative w-full overflow-hidden rounded-xl aspect-video">
        <Image
          src={thumbnailUrl ?? "/placeholder.svg"}
          alt="video thumbnail"
          fill
          className="size-full object-cover"
        />
      </div>
      {/* video duration box */}
      {/* TODO: add video duration box */}
    </div>
  );
};
