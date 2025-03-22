"use client";

import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { videooUpdateSchema } from "@/db/schema";
import Image from "next/image";
import { trpc } from "@/trpc/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ImagePlusIcon,
  MoreVerticalIcon,
  RotateCwIcon,
  SparklesIcon,
} from "lucide-react";
import { ThumbnailUploadModal } from "../thumbnail-upload-modal";
import { toast } from "sonner";

type VideoDetailsFormProps = {
  form: UseFormReturn<z.infer<typeof videooUpdateSchema>>;
  categories: Array<{ id: string; name: string }>;
  videoId: string;
};

export const VideoDetailsForm = ({
  form,
  categories,
  videoId,
}: VideoDetailsFormProps) => {
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const utils = trpc.useUtils();
  const restoreThumbnail = trpc.videos.restoreThumbnail.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Thumbnail restored successfully");
    },
    onError: () => {
      toast.error("Failed to restore thumbnail");
    },
  });
  const [open, setOpen] = useState(false);
  return (
    <>
      <ThumbnailUploadModal
        videoId={videoId}
        open={open}
        onOpenChange={setOpen}
      />
      <div className="space-y-8 lg:col-span-3">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Add title to your video" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  rows={10}
                  className="resize-none pr-10"
                  placeholder="Add description to your video"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="thumbnailUrl"
          render={() => (
            <FormItem>
              <FormLabel>Thumbnail</FormLabel>
              <FormControl>
                <div className="p-0.5 border border-dashed  border-neutral-400 relative h-[84px] w-[153px] group">
                  <Image
                    fill
                    src={video.thumbnailUrl ?? "/placeholder.svg"}
                    alt={video.title}
                    className="object-cover"
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        size={"icon"}
                        className="bg-black/50 hover:bg-black/50 absolute top-1 right-1 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 size-7 duration-300 transition-opacity"
                      >
                        <MoreVerticalIcon className="text-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" side="right">
                      <DropdownMenuItem onClick={() => setOpen(true)}>
                        <ImagePlusIcon className="mr-2 size-4" />
                        <span>Change thumbnail</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <SparklesIcon className="mr-2 size-4" />
                        <span>AI generated</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          restoreThumbnail.mutate({
                            id: videoId,
                          })
                        }
                      >
                        <RotateCwIcon className="mr-2 size-4" />
                        <span>restore thumbnail</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ?? undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};
