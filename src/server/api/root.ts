// import { postRouter } from "~/server/api/routers/post"
import { createTRPCRouter } from "~/server/api/trpc"
import { plansRouter } from "~/server/api/routers/plans"
import { subscriptionsRouter } from "~/server/api/routers/subscription"
import { accountRouter } from "~/server/api/routers/account";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  plans: plansRouter,
  subscriptions: subscriptionsRouter,
  account: accountRouter
});

// export type definition of API
export type AppRouter = typeof appRouter
