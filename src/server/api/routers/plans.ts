import { z } from 'zod'
import { plansAdapter } from '~/adapters'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

export const plansRouter = createTRPCRouter({
	getPlanByType: publicProcedure
		.input(z.object({ type: z.enum(['STARTER', 'PLUS']) }))
		.query(async ({ ctx, input }) => {
			const plan = await ctx.db.plan.findFirst({
				where: { type: input.type },
				select: {
					id: true,
				},
			})

			return plan
		}),

	getAllPlans: publicProcedure.query(async ({ ctx }) => {
		const allPlans = await ctx.db.plan.findMany({
			orderBy: {
				price_monthly: 'asc',
			},
		})
		return plansAdapter(allPlans)
	}),

	getPlanByProductId: publicProcedure
		.input(z.object({ productId: z.string().min(1) }))
		.query(async ({ ctx, input }) => {
			
			return await ctx.db.plan.findFirst({
				where: {
					product_id: input.productId,
				},
				select: {
					id: true,
				},
			})
		}),
})
