import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

import { RequiresProPlanError } from "@/lib/exceptions";
import { getUserSubscriptionPlan } from "@/lib/subscription";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const subscriptionPlan = await getUserSubscriptionPlan(user.id);

      // If user is on a free plan.
      // Check if user has reached limit of 3 posts.
      if (!subscriptionPlan?.isPro) {
        const count = await ctx.db.post.count({
          where: {
            authorId: user.id,
          },
        });

        if (count >= 3) {
          throw new RequiresProPlanError();
        }
      }

      return ctx.db.post.create({
        data: {
          title: input.title,
          content: input.content,
          author: { connect: { id: ctx.session.user.id } },
        },
        select: {
          id: true,
        },
      });
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.post.findFirst({
        select: {
          id: true,
          title: true,
          published: true,
          createdAt: true,
        },
        where: {
          authorId: ctx.session.user.id,
          id: input.id,
        },
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    const user = ctx.session.user;
    return ctx.db.post.findMany({
      where: {
        authorId: user.id,
      },
      select: {
        id: true,
        title: true,
        published: true,
        createdAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { author: { id: ctx.session.user.id } },
    });
  }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.post.delete({
        where: {
          author: { id: ctx.session.user.id },
          id: input.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3).max(128).optional(),
        content: z.any().optional(), //TODO Content should be JSON
        id: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.post.update({
        where: {
          author: { id: ctx.session.user.id },
          id: input.id,
        },
        data: {
          title: input.title,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          content: input.content,
        },
      });
    }),
});
