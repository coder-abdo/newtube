"use client";

import { ResponsiveDialog } from "@/components/responsive-dialog";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";

type ThumbnailUploadModalProps = {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ThumbnailUploadModal = ({
  videoId,
  open,
  onOpenChange,
}: ThumbnailUploadModalProps) => {
  const utils = trpc.useUtils();
  const onUploadComplete = () => {
    utils.studio.getMany.invalidate();
    utils.studio.getOne.invalidate({ id: videoId });
    onOpenChange(false);
  };
  return (
    <ResponsiveDialog
      isOpen={open}
      title="Upload a thumbnail"
      onOpenChange={onOpenChange}
    >
      <UploadDropzone
        endpoint={"thumbnailUploader"}
        input={{ videoId }}
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsiveDialog>
  );
};
