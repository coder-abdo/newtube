"use client";

import { trpc } from "@/trpc/client";
import { videooUpdateSchema } from "@/db/schema";
import { Form } from "@/components/ui/form";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { VideoHeader } from "../components/form-section/video-header";
import { VideoDetailsForm } from "../components/form-section/video-details-form";
import { VideoPreview } from "../components/form-section/video-preview";
import { VideoVisibilityField } from "../components/form-section/video-visibility-field";

type FormSectionProps = {
  videoId: string;
};

export const FormSection = ({ videoId }: FormSectionProps) => {
  const utils = trpc.useUtils();
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <VideoHeader videoId={videoId} isPending={update.isPending} />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <VideoDetailsForm
                videoId={videoId}
                form={form}
                categories={categories}
              />
              <div className="flex flex-col gap-y-8 lg:col-span-2">
                <VideoPreview videoId={videoId} />
                <VideoVisibilityField form={form} />
              </div>
            </div>
          </form>
        </Form>
      </ErrorBoundary>
    </Suspense>
  );
};
