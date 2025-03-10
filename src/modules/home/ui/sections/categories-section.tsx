"use client";
import React, { FC, Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import { ErrorBoundary } from "react-error-boundary";
import { trpc } from "@/trpc/client";
import { FilterCarousel } from "@/components/ui/filter-carousel";
import { CategoriesSectionProps } from "@/types";
import { ErrorBoundaryFallback } from "../components/categories-section-error-fallback";
import { useRouter } from "next/navigation";

export const CategoriesSection: FC<CategoriesSectionProps> = ({
  categoryId,
}) => {
  const router = useRouter();
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const data = categories.map(({ id, name }) => ({
    value: id,
    label: name,
  }));
  const onSelect = (value: string | null) => {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set("categoryId", value);
    } else {
      url.searchParams.delete("categoryId");
    }
    router.push(url.href);
  };
  return (
    <div>
      <Suspense fallback={<Skeleton count={3} />}>
        <ErrorBoundary fallback={ErrorBoundaryFallback}>
          <FilterCarousel data={data} value={categoryId} onSelect={onSelect} />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
};
