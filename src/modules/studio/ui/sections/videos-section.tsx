"use client";
import { format } from "date-fns";
import { InfiniteScroll } from "@/components/infinite-scroll";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { snakeCaseToTitle } from "@/lib/utils";
import { VideoThumbnail } from "@/modules/videos/ui/components/video-thumbnail";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Globe2Icon, LockIcon } from "lucide-react";
import { VideoSectionFallback } from "./video-section-fallback";

export const VideosSection = () => {
  const [data, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    {
      limit: 5,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <Suspense fallback={<VideoSectionFallback />}>
      <ErrorBoundary fallback={<p>Something went wrong</p>}>
        <div>
          <div className="border-y">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6 w-[510px]">Video</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>status</TableHead>
                  <TableHead>date</TableHead>
                  <TableHead className="text-right">views</TableHead>
                  <TableHead className="text-right">comments</TableHead>
                  <TableHead className="text-right pr-6">likes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.pages
                  .flatMap((page) => page.items)
                  .map((video) => (
                    <Link
                      href={`/studio/videos/${video.id}`}
                      key={video.id}
                      legacyBehavior
                    >
                      <TableRow className="cursor-pointer">
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="relative aspect-video w-36 shrink-0">
                              <VideoThumbnail
                                thumbnailUrl={video.thumbnailUrl}
                                title={video.title}
                                previewUrl={video.previewUrl}
                                duration={video.duration ?? 0}
                              />
                            </div>
                            <div className="flex flex-col overflow-hidden gap-y-1">
                              <span className="line-clamp-1 text-sm">
                                {video.title}
                              </span>
                              <span className="line-clamp-1 text-xs text-muted-foreground">
                                {video.description ?? "No description"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {video.visibility === "private" ? (
                              <LockIcon className="size-4 mr-2" />
                            ) : (
                              <Globe2Icon className="size-4 mr-2" />
                            )}
                            {snakeCaseToTitle(video.visibility)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {snakeCaseToTitle(video.muxStatus || "error")}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm truncate">
                          {format(new Date(video.createdAt), "d MMM yyyy")}
                        </TableCell>
                        <TableCell>views</TableCell>
                        <TableCell>comments</TableCell>
                        <TableCell>likes</TableCell>
                      </TableRow>
                    </Link>
                  ))}
              </TableBody>
            </Table>
          </div>
          <InfiniteScroll
            hasNextPage={query.hasNextPage}
            isFetchingNextPage={query.isFetchingNextPage}
            fetchNextPage={query.fetchNextPage}
          />
        </div>
      </ErrorBoundary>
    </Suspense>
  );
};
