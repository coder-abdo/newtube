import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useEffect } from "react";
import { Button } from "./ui/button";

interface InfiniteScrollProps {
  isManual?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  isManual = false,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: "100px",
  });
  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);
  return (
    <div className="flex flex-col p-4 gap-4 items-center">
      <div className="h-1" ref={targetRef} />
      {hasNextPage ? (
        <Button
          variant={"secondary"}
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </Button>
      ) : (
        <p className="text-muted-foreground text-xs">
          you reached the end of the list
        </p>
      )}
    </div>
  );
};
