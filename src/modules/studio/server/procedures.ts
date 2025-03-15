import { z } from "zod";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { createTRPCRouter, protectedProcdure } from "@/trpc/init";
import { and, desc, eq, lt, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const studioRouter = createTRPCRouter({
  getOne: protectedProcdure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { id } = input;
      const [video] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.userId, userId), eq(videos.id, id)));
      if (!video) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found",
        });
      }
      return video;
    }),
  getMany: protectedProcdure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const { id: userId } = ctx.user;
      const videosData = await db
        .select()
        .from(videos)
        .where(
          and(
            eq(videos.userId, userId),
            cursor
              ? or(
                  lt(videos.updatedAt, cursor.updatedAt),
                  and(
                    eq(videos.updatedAt, cursor.updatedAt),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(videos.updatedAt), desc(videos.id))
        .limit(limit + 1);
      const isHasMore = videosData.length > limit;
      const items = isHasMore ? videosData.slice(0, -1) : videosData;
      const lastItem = videosData[videosData.length - 1];
      const nextCursor = isHasMore
        ? { id: lastItem.id, updatedAt: lastItem.updatedAt }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
});
