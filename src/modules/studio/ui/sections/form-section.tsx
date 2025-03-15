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
import { MoreVerticalIcon, TrashIcon } from "lucide-react";
import { Suspense } from "react";
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
                    <DropdownMenuItem>
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
            </div>
          </form>
        </Form>
      </ErrorBoundary>
    </Suspense>
  );
};
