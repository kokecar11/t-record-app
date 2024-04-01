import { createTRPCRouter } from "~/server/api/trpc"
import { plansRouter } from "~/server/api/routers/plans"
import { subscriptionsRouter } from "~/server/api/routers/subscription"
import { markerRouter } from "~/server/api/routers/marker"
import { liveRouter } from "./routers/live"
import { teamsRouter } from "./routers/team"
import { usersRouter } from "./routers/user"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  plans: plansRouter,
  subscriptions: subscriptionsRouter,
  marker: markerRouter,
  live: liveRouter,
  team: teamsRouter,
  user: usersRouter
});

// export type definition of API
export type AppRouter = typeof appRouter
