import { type StatusSubscription, type TypeSubscription } from '@prisma/client'
import { cancelSubscription, lemonSqueezySetup, listSubscriptionInvoices } from '@lemonsqueezy/lemonsqueezy.js';
import { z } from 'zod'
import { env } from '~/env'

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from '~/server/api/trpc'
import { billingsHistoryAdapter } from '~/adapters/subscription.adapter';

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

	setSubscriptionPlus: publicProcedure
		.input(
			z.object({
				product_id: z.string().min(1),
				user_email: z.string().min(1),
				variant_id: z.string().min(1),
				variant_name: z.string().min(1),
				renews_at: z.string().min(1),
				ends_at: z.string().optional().nullable(),
				ls_subsId: z.string().min(1),
				status: z.string().min(1),
				store_id: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const user = await ctx.db.user.findFirst({
				where: { email: input.user_email },
				select: {
					id: true,
				},
			})
			const plan = await ctx.db.plan.findFirst({
				where: {
					product_id: input.product_id,
				},
				select: {
					id: true,
				},
			})
			const sub = await ctx.db.subscription.update({
				where: {
					userId: user?.id,
				},
				data: {
					renews_at: input.renews_at,
					ends_at: input.ends_at,
					variant_id: input.variant_id,
					type: input.variant_name as TypeSubscription,
					ls_subsId: input.ls_subsId,
					planId: plan?.id,
					status: input.status as StatusSubscription,
					store_id: input.store_id,
				},
			})
			return sub
		}),

	cancelSubscriptionLemonSqueezyAPI: protectedProcedure.mutation(async ({ ctx }) => {
		lemonSqueezySetup({apiKey: env.LS_API_KEY})
		const subscriptionId = await ctx.db.subscription.findFirst({
			where: {
				userId: ctx.session.user.id,
			},
			select: {
				ls_subsId: true,
			},
		})

		if (!subscriptionId?.ls_subsId) {
			return { message: 'Subscription not found' }
		}

		const { statusCode, data } = await cancelSubscription(subscriptionId.ls_subsId)
		if (statusCode === 200 && data?.data.attributes.cancelled) {
			return {
				message:
					'Subscription cancelled, you will be able to enjoy the service until the end of the current billing period.',
			}
		}
		return {
			message: 'Subscription could not be cancelled',
		}
	}),

	cancelAndExpiredSubscription: publicProcedure
		.input(
			z.object({
				renews_at: z.string().min(1),
				ends_at: z.string().optional().nullable(),
				status: z.string().min(1),
				ls_subsId: z.string().min(1),
				user_email: z.string().min(1),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const user = await ctx.db.user.findFirst({
				where: { email: input.user_email },
				select: {
					id: true,
				},
			})
			
			await ctx.db.subscription.update({
				where: {
					userId: user?.id,
				},
				data: {
					renews_at: input.renews_at,
					ends_at: input.ends_at,
					status: input.status as StatusSubscription,
					type: 'monthly',
				},
			})				
		}),

	billingHistoryLemonSqueezy: protectedProcedure.mutation(async ({ ctx }) => {
		lemonSqueezySetup({apiKey: env.LS_API_KEY})
		const subscriptionId = await ctx.db.subscription.findFirst({
			where: {
				userId: ctx.session.user.id,
			},
			select: {
				ls_subsId: true,
				store_id: true,
			},
		})
		if (!subscriptionId?.ls_subsId || !subscriptionId?.store_id) {
			return []
		}

		const { data } = await listSubscriptionInvoices({ 
			filter: { 
				storeId: subscriptionId.store_id, 
				subscriptionId:subscriptionId.ls_subsId
			}
		});
		if (!data) {
			return []
		}
		
		return billingsHistoryAdapter(data)
	})


})
