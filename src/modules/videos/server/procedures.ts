import { db } from "@/db";
import { videos } from "@/db/schema";
import { mux } from "@/lib/mux";
import { createTRPCRouter, protectedProcdure } from "@/trpc/init";

export const videosRouter = createTRPCRouter({
  create: protectedProcdure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        playback_policy: ["public"],
      },
      cors_origin: "*", // TODO: add domain in production
    });
    const [video] = await db
      .insert(videos)
      .values({
        userId,
        title: "untitled",
      })
      .returning();
    return {
      video,
      url: upload.url,
    };
  }),
});
