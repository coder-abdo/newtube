"use client";

import { trpc } from "@/trpc/client";
import { videooUpdateSchema } from "@/db/schema";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CopyCheckIcon,
  CopyIcon,
  Globe2Icon,
  LockIcon,
  MoreVerticalIcon,
  TrashIcon,
} from "lucide-react";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { VideoPlayer } from "@/modules/videos/ui/components/video-player";
import Link from "next/link";
import { snakeCaseToTitle } from "@/lib/utils";
import { useRouter } from "next/navigation";

type FormSectionProps = {
  videoId: string;
};

export const FormSection = ({ videoId }: FormSectionProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
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
  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      utils.studio.getOne.invalidate({ id: videoId });
      utils.categories.getMany.invalidate();
      toast.success("Video updated successfully");
    },
    onError: () => {
      toast.error("Failed to update video");
    },
  });
  const form = useForm<z.infer<typeof videooUpdateSchema>>({
    resolver: zodResolver(videooUpdateSchema),
    defaultValues: video,
  });
  const onSubmit = (values: z.infer<typeof videooUpdateSchema>) => {
    update.mutate(values);
  };
  const fullUrl = `${
    process.env.VERCEL_URL || "http://localhost:3000"
  }/videos/${videoId}`;
  const [isCopied, setIsCopied] = useState(false);
  const onCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center justify-between mb-6 capitalize">
              <div>
                <h1 className="text-2xl font-bold">video details</h1>
                <p className="text-muted-foreground text-xs">
                  vidoe description
                </p>
              </div>
              <div className="flex items-center gap-x-2">
                <Button type="submit" disabled={update.isPending}>
                  Save
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size={"icon"}>
                      <MoreVerticalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => remove.mutate({ id: videoId })}
                    >
                      <TrashIcon className="mr-2 size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="space-y-8 lg:col-span-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Add title to your video"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* description */}
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
                {/* category */}
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
              <div className="flex flex-col gap-y-8 lg:col-span-2">
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
                        <p className="text-xs text-muted-foreground">
                          Video link
                        </p>
                        <div className="flex items-center gap-x-2">
                          <Link href={`/videos/${video.id}`}>
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
                    {/* video status */}
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col gap-y-1">
                        <p className="text-muted-foreground text-xs">
                          Video status
                        </p>
                        <p className="text-sm">
                          {snakeCaseToTitle(video.muxStatus ?? "preparing")}
                        </p>
                      </div>
                    </div>
                    {/* video track */}
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col gap-y-1">
                        <p className="text-muted-foreground text-xs">
                          Subtitle status
                        </p>
                        <p className="text-sm">
                          {snakeCaseToTitle(video.muxTrackStatus ?? "no_audio")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* visibilty  */}
                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visibility</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            {
                              name: "public",
                              icon: <Globe2Icon className="size-4" />,
                            },
                            {
                              name: "private",
                              icon: <LockIcon className="size-4" />,
                            },
                          ].map((visibility) => (
                            <SelectItem
                              key={visibility.name}
                              value={visibility.name}
                            >
                              <div className="flex items-center gap-x-2">
                                {visibility.icon}
                                {visibility.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </ErrorBoundary>
    </Suspense>
  );
};
