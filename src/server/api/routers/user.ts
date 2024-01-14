import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { userNameSchema } from "@/lib/validations/user";

export const userRouter = createTRPCRouter({
  updateName: protectedProcedure
    .input(userNameSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
});
