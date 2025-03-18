"use client";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { StudioUploader } from "./studio-uploader";
import { useRouter } from "next/navigation";

export const StudioUploadModal = () => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast.success("Video created successfully");
      utils.studio.getMany.invalidate();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  const onSuccess = () => {
    if (!create.data?.video.id) return;
    router.push(`/studio/videos/${create.data.video.id}`);
  };
  return (
    <>
      <ResponsiveDialog
        isOpen={!!create.data?.url}
        title="Upload a video"
        onOpenChange={(isOpen) => {
          create.reset();
        }}
      >
        {create.data?.url ? (
          <StudioUploader endpoint={create.data.url} onSuccess={onSuccess} />
        ) : (
          <Loader2Icon />
        )}
      </ResponsiveDialog>
      <Button
        disabled={create.isPending}
        variant="secondary"
        onClick={() => create.mutate()}
      >
        {create.isPending ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <PlusIcon />
        )}
        create
      </Button>{" "}
    </>
  );
};
