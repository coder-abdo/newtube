import React from "react";
import { VideosSection } from "../sections/videos-section";

export const StudioView = () => {
  return (
    <div className="flex flex-col gap-y-6 pt-2.5 ">
      <div className="px-4 capitalize">
        <h1 className="text-2xl font-bold">channel content</h1>
        <p className="text-muted-foreground text-xs">
          manage your channel content and videos
        </p>
      </div>
      <VideosSection />
    </div>
  );
};
