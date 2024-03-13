import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'

export const subscriptionsRouter = createTRPCRouter({
	createInitialSub: protectedProcedure
		.input(z.object({ planId: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			return ctx.db.subscription.create({
				data: {
					planId: input.planId,
					userId: ctx.session.user.id,
					type: 'monthly',
					status: 'active',
				},
			})
		}),
	getSubscriptionByUserId: protectedProcedure.mutation(async ({ ctx }) => {
		return ctx.db.subscription.findFirst({
			where: {
				userId: ctx.session.user.id,
			},
			select: {
				plan: {
					select: {
						type: true,
						price_monthly: true,
						price_yearly: true,
						title: true,
					},
				},
				type: true,
				status: true,
				renews_at: true,
				ends_at: true,
			},
		})
	}),
})
