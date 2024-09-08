import { env } from '~/env'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import type { Live, StatusLive } from '~/models'
import { z } from 'zod'

export const liveRouter = createTRPCRouter({
	getStatusStream: protectedProcedure
	.input(z.object({ teamId: z.string() }))
	.query(async ({ ctx, input}) => {
		const urlApiTwitch = new URL('https://api.twitch.tv/helix/streams')
		
		const team = await ctx.db.team.findFirst({
			where: {
				id: input.teamId ?? '',
			},
			select: {
				owner: {
					select:{
						accounts:{
							select:{
								providerAccountId: true,
							}
						}
					}	
				},
			},
		})
	
		
		const account = await ctx.db.account.findFirst({
			where: {
				userId: ctx.session.user.id,
			},
			select: {
				access_token: true,
				providerAccountId: true,
			},
		})
		const providerAccountId = team?.owner.accounts[0]?.providerAccountId ? team?.owner.accounts[0]?.providerAccountId : account?.providerAccountId
		const headers = {
			Accept: 'application/json',
			Authorization: 'Bearer ' + account?.access_token,
			'Client-Id': env.TWITCH_CLIENT_ID,
		}
		if (account)
			urlApiTwitch.searchParams.set('user_id', providerAccountId!)
		const resp = await fetch(urlApiTwitch.toString(), {
			headers,
			cache: 'force-cache',
			method: 'GET',
		})
		const { data } = (await resp.json()) as {
			data: { type: StatusLive; id: string; game_id: string }[]
		}

		if (data === undefined || data.length === 0) {
			const status: StatusLive = 'offline'
			return { status, vod: '', gameId: '' }
		}
		const live: Live = {
			status: data[0]!.type,
			vod: data[0]?.id,
			gameId: data[0]?.game_id,
		}
		return live
	}),
})
