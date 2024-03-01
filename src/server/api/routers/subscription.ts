import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "~/server/api/trpc";

export const subscriptionsRouter = createTRPCRouter({
  createInitialSub: protectedProcedure
    .input(z.object({ planId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.subscription.create({
        data: {
            planId: input.planId,
            userId: ctx.session.user.id,
            type: 'monthly',
            status: 'active'
        },
      });
    }),
});
