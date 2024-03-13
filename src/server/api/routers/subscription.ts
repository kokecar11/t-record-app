import { type TypeSubscription } from '@prisma/client'
import { z } from 'zod'
import { env } from '~/env'

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from '~/server/api/trpc'

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

	setPaymentSubscriptionByUser: publicProcedure
		.input(
			z.object({
				product_id: z.string().min(1),
				user_email: z.string().min(1),
				variant_id: z.string().min(1),
				variant_name: z.string().min(1),
				renews_at: z.string().min(1),
				ends_at: z.string().min(1),
				ls_subsId: z.string().min(1),
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
				},
			})

			return sub
		}),

	cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
		const urlApiLemonSqueezy = 'https://api.lemonsqueezy.com/v1/subscriptions/'
		const lsSubscriptionId = await ctx.db.subscription.findFirst({
			where: {
				userId: ctx.session.user.id,
			},
			select: {
				ls_subsId: true,
			},
		})
		if(!lsSubscriptionId?.ls_subsId) {
			return { message: 'Subscription not found' }
		}
		const headers = {
			Accept: 'application/vnd.api+json',
			'Content-Type': 'application/vnd.api+json',
			Authorization: 'Bearer ' + env.LS_API_KEY,
		}
		const respCancelSubscription = await fetch(
			`${urlApiLemonSqueezy}${lsSubscriptionId?.ls_subsId}`,
			{
				method: 'DELETE',
				headers,
			},
		)
		const respCancelSubscriptionJson = await respCancelSubscription.json() as {data: {attributes: {cancelled: boolean, renews_at: string, ends_at: string}}}
		const planStarter = await ctx.db.plan.findFirst({
			where: {
				type: 'STARTER',
			},
			select: {
				id: true,
			},
		})
		console.log(respCancelSubscriptionJson)
		if (respCancelSubscriptionJson.data.attributes.cancelled) {
			await ctx.db.subscription.update({
				where: {
					userId: ctx.session.user.id,
				},
				data: {
					planId: planStarter?.id,
					renews_at: respCancelSubscriptionJson.data.attributes.renews_at,
					ends_at: respCancelSubscriptionJson.data.attributes.ends_at,
					variant_id: null,
					type: 'monthly',
					ls_subsId: null,
				},
			})
			return {
				message:
					'Subscription cancelled, you will be able to enjoy the service until the end of the current billing period.',
			}
		}
		return {
			message: 'Subscription could not be cancelled',
		}
	}),
})
