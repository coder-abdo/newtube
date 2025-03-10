import { StudioView } from "@/modules/studio/ui/view/studio-view";
import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";

function Page() {
  void trpc.studio.getMany.prefetchInfinite({
    limit: 5,
  });
  return (
    <HydrateClient>
      <div>client</div>
      <StudioView />
    </HydrateClient>
  );
}

export default Page;
