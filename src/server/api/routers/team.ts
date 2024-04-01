import { z } from 'zod'
import { membersTeamAdapter } from '~/adapters/team.adapter'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'

export const teamsRouter = createTRPCRouter({
	getAllMembers: protectedProcedure
		.query(async ({ ctx }) => {
			const members = await ctx.db.invitation.findMany({
				where: {
                    inviterId: ctx.session.user.id,
                },
				select: {
					invitee: {
						select: {
							name: true,
							image: true,
						},
					},
					status: true,
				}
			})

			return  members ? membersTeamAdapter(members) : []
	}),
	getDataTeam: protectedProcedure
	.query(async ({ ctx }) => {
		const members = await ctx.db.team.findFirst({
			where: {
				ownerId: ctx.session.user.id,
			},
			select: {
				name: true,
			},
		})

		return members
	}),
	create: protectedProcedure.input(z.object({ name: z.string() })).mutation(async ({ ctx, input }) => {
		const team = await ctx.db.team.create({
			data: {
				name: input.name,
				ownerId: ctx.session.user.id,
			},
		})

		return team
	}),
	sendInvitation: protectedProcedure.input(z.object({ inviteeId: z.string() })).mutation(async ({ ctx, input }) => {
		const team = await ctx.db.team.findFirst({
			where: {
				ownerId: ctx.session.user.id,
			},
			select:{
				id: true,
			}
		})
		if (team === null) {
			throw new Error('You must create a team first')
		}
		const invitation = await ctx.db.invitation.create({
			data: {
				teamId: team.id,
				inviterId: ctx.session.user.id,
				inviteeId: input.inviteeId,
			},
		})

		return invitation
	})
})
