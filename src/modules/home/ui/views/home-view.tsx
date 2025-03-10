import React, { FC } from "react";
import { CategoriesSection } from "../sections/categories-section";
import { CategoriesSectionProps } from "@/types";

export const HomeView: FC<CategoriesSectionProps> = ({ categoryId }) => {
  return (
    <div className="max-w-[2400px] mx-auto pt-2.5 px-4 mb-10 flex flex-col gap-y-6">
      <CategoriesSection categoryId={categoryId} />
    </div>
  );
};
