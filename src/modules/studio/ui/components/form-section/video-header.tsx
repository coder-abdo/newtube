"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";

type VideoHeaderProps = {
  videoId: string;
  isPending: boolean;
};

export const VideoHeader = ({ videoId, isPending }: VideoHeaderProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const remove = trpc.videos.remove.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      toast.success("Video deleted successfully");
      router.push("/studio");
    },
    onError: () => {
      toast.error("Failed to delete video");
    },
  });

  return (
    <div className="flex items-center justify-between mb-6 capitalize">
      <div>
        <h1 className="text-2xl font-bold">video details</h1>
        <p className="text-muted-foreground text-xs">video description</p>
      </div>
      <div className="flex items-center gap-x-2">
        <Button type="submit" disabled={isPending}>
          Save
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size={"icon"}>
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => remove.mutate({ id: videoId })}>
              <TrashIcon className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
