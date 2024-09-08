
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { env } from '~/env'
import { Resend } from 'resend'
import EmailInviteTeam from '~/emails/email-invite-team'



export const teamsRouter = createTRPCRouter({
	members: protectedProcedure
		.input(z.object({
			teamId: z.string().optional(),
		}))
		.query(async ({ ctx, input }) => {
			
			const myTeam = await ctx.db.team.findFirst({
				where:{
					ownerId: ctx.session.user.id,
				},
				select:{
					id: true,
					owner: true,
				},
				
			})
			
			const members = await ctx.db.usersOnTeams.findMany({
				where:{
					teamId: input.teamId ? input.teamId : myTeam?.id,
				},
				select:{
					user:{
						select:{
							name: true,
							image: true,
							id: true,
						}
					},
					status: true,
					role: true,
					permissions: true,
				}
			})

			return  members
	}),

	membersTwitch: protectedProcedure
	.query(async ({ ctx }) => {
		// const urlApiTwitchModerators = new URL('https://api.twitch.tv/helix/moderation/moderators')
		const urlApiTwitchModerators = new URL('https://api.twitch.tv/helix/channels/editors')
		// const urlApiTwitchUsers = new URL('https://api.twitch.tv/helix/users')
		const account = await ctx.db.account.findFirst({
			where: {
				userId: ctx.session.user.id,
			},
			select: {
				access_token: true,
				providerAccountId: true,
			},
		})
		const headers = {
			Accept: 'application/json',
			Authorization: 'Bearer ' + account?.access_token,
			'Client-Id': env.TWITCH_CLIENT_ID,
		}
		
		if (account)
			urlApiTwitchModerators.searchParams.set('broadcaster_id', account.providerAccountId)
		
		
		const resp = await fetch(urlApiTwitchModerators.toString(), {
			headers,
			cache: 'force-cache',
			method: 'GET',
		})
		
		
		const { data } = (await resp.json()) as {
			data: { user_id: string ; user_login: string; user_name: string }[] 
		} || { data: [] }
		
		const usersOnApp = await ctx.db.user.findMany({
			where: {
				id: { 
					not: ctx.session.user.id
				}
			},
			select: {
				id: true,
				name: true,
				image: true,
				accounts: {
					select: {
						provider: true,
						providerAccountId: true,
					}
				}
			},
		})
		
		
		const filteredData = data.filter(
            (user) => !usersOnApp.some(
                (appUser) => appUser.accounts.some(
                    (account) => account.providerAccountId === user.user_id
                )
            )
        );

		const resultUsersTwitch = filteredData.map((user) => ({
			id: user.user_id,
			name: user.user_name ?? undefined,
			image: ``,
		}))
		
		return resultUsersTwitch
	}
	),

	myTeams: protectedProcedure
	.query(async ({ ctx }) => {
		const teamsWithMemberCount = await ctx.db.usersOnTeams.groupBy({
			by: ['teamId'],
			where: {
				status: 'accepted'
			},
			_count: {
				userId: true
			}
		})
		const teamIds = teamsWithMemberCount.map(team => team.teamId)
		const teamNames = await ctx.db.team.findMany({
			where: {
				id: { in: teamIds }
			},
			select: {
				id: true,
				name: true
			}
		})
		
		const result = teamsWithMemberCount.map(team => {
			const teamName = teamNames.find(t => t.id === team.teamId)?.name;
			return {
				id: team.teamId,
				name: teamName ? teamName :'Unknown',
				totalMembers: team._count.userId
			}
		});
		
		return result;
	}),

	dataTeam: protectedProcedure.input(z.object({ id: z.string() }))
	.query(async ({ ctx, input }) => {
		const team = await ctx.db.team.findFirst({
			where: {
				id: input.id,
			},
			select: {
				name: true,
				owner: {
					select: {
						name: true,
						image: true,
					},
				}
			},
		})
		return team
	}),

	userPermissionsAndRole: protectedProcedure.input(z.object({ teamId: z.string() }))
	.query(async ({ ctx, input }) => {
		
			if(input.teamId === ''){
				return null
			}
			
			const userPermissionAndRole = await ctx.db.usersOnTeams.findFirst({
				where: {
					userId: ctx.session.user.id,
					teamId: input.teamId,
				},
				select: {
					permissions: true,
					role: true,
				},
			})

			return userPermissionAndRole
		}
	),

	create: protectedProcedure
	.input(z.object({ name: z.string() }))
	.mutation(async ({ ctx, input }) => {
		const team = await ctx.db.team.create({
			data: {
				name: input.name,
				ownerId: ctx.session.user.id,
			},
		})

		await ctx.db.usersOnTeams.create({
			data: {
				teamId: team.id,
				userId: ctx.session.user.id,
				status: 'accepted',
				role: 'OWNER',
				permissions: [
					'TEAM_MARKER_DELETE',
					'TEAM_MARKER_EDIT',
					'TEAM_MARKER_CREATE',
					'TEAM_MARKER_VIEW',
					'TEAM_EDIT',
					'TEAM_DELETE',
					'TEAM_USER_INVITE',
					'TEAM_USER_REMOVE',
					'TEAM_USER_EDIT'
				],
			},
		})

		return team
	}),

	sendInvitation: protectedProcedure
	.input(z.object({ inviteeId: z.string() }))
	.mutation(async ({ ctx, input }) => {
		const resend = new Resend('re_hV2LwnxX_PUhYEwhBCvJGtXvbVj1XGFAg')

		const team = await ctx.db.team.findFirst({
			where: {
				ownerId: ctx.session.user.id,
			},
			select:{
				id: true,
				name: true,
			}
		})
		if (team === null) {
			throw new Error('You must create a team first')
		}
		const invitee = await ctx.db.user.findFirst({
			where: {
				id: input.inviteeId,
			},
			select:{
				name: true,
				email: true,
			}
		})
		
		if (invitee === null) {
			throw new Error('User not found')
		}

		await resend.emails.send({
			from: 'Koke from T-Record <koke@t-record.app>',
			to: [invitee.email!],
			subject: `${ctx.session.user.name} invites you to join their team on T-Record!`,
			react: EmailInviteTeam({userInviter:ctx.session.user.name, userInvitee:invitee.name!, url: `${env.NEXTAUTH_URL}/teams?tabs=invitations`, teamName:team.name}),
		}) 

		const invitation = await ctx.db.invitation.create({
			data: {
				teamId: team.id,
				inviterId: ctx.session.user.id,
				inviteeId: input.inviteeId,
			},
		})
		return invitation
	}),

	invitations: protectedProcedure
	.query(async ({ ctx }) => {
		const invitations = await ctx.db.invitation.findMany({
			where: {
				inviteeId: ctx.session.user.id,
				status: 'pending',
			},
			select: {
				id: true,
				team: true,
				inviter: {
					select: {
						name: true,
						image: true,
					},
				},
			}
			
		})

		return invitations
	}),

	acceptOrRejectInvitation: protectedProcedure
	.input(z.object({invitationId: z.string(), status: z.enum(['accepted', 'rejected'])}))
	.mutation(async ({ ctx, input }) => {

		const invitation = await ctx.db.invitation.update({
			where: {
				id: input.invitationId,
			},
			data: {
				status: input.status,
			},
		})

		if (input.status === 'accepted') {
			await ctx.db.usersOnTeams.create({
				data: {
					teamId: invitation.teamId,
					userId: invitation.inviteeId,
					status: input.status,
					role: 'MEMBER',
					permissions: ['TEAM_MARKER_VIEW'],
				},
			})
			return invitation
		}
		return invitation
	}),
	
	updateUserPermissionsAndRole: protectedProcedure
	.input(
		z.object({
			teamId: z.string(),
			userId: z.string(),
			role: z.enum(['OWNER','EDITOR', 'MEMBER', 'MODERATOR']),
			permissions: z.array(z.enum(['TEAM_EDIT', 'TEAM_DELETE', 'TEAM_USER_INVITE', 'TEAM_USER_REMOVE', 'TEAM_USER_EDIT', 'TEAM_MARKER_CREATE', 'TEAM_MARKER_DELETE', 'TEAM_MARKER_EDIT', 'TEAM_MARKER_VIEW'])),
		})   
	) 
	.mutation(async ({ ctx, input }) => {
		
		const user = await ctx.db.usersOnTeams.updateMany({
			where: {
				userId: input.userId,
				teamId: input.teamId,
			},	
			data : {
				role: input.role,
				permissions: input.permissions,
			}

		})

		return user
	}
)
})
