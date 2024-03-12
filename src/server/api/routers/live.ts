import { env } from "~/env";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
export type StatusLive = 'offline' | 'live';

export interface Live {
    status: StatusLive;
    isLoading?: boolean;
    vod?: string;
    gameId?: string;
}


export const liveRouter = createTRPCRouter({

    getStatusStream: protectedProcedure.query(async ({ctx}) => {
        const urlApiTwitch = new URL('https://api.twitch.tv/helix/streams')
        const account = await ctx.db.account.findFirst({
            where: { 
                userId: ctx.session.user.id
            },
            select: {
                access_token: true,
                providerAccountId: true
            }
        })
        const headers = {
            'Accept': 'application/json',
            'Authorization':"Bearer " + account?.access_token,
            'Client-Id': env.TWITCH_CLIENT_ID
        }
        if (account) urlApiTwitch.searchParams.set('user_id', account?.providerAccountId)
        const resp = await fetch(urlApiTwitch.toString(), {
            headers,
            cache: "force-cache",
            method: 'GET'
        })
        const { data } = (await resp.json()) as {data: {type:StatusLive, id: string, game_id:string}[]}
        
        if (data === undefined || data.length === 0){
            const status: StatusLive = 'offline';
            return { status, vod: '', gameId: '' };
        }
        const live: Live = {
            status: data[0]!.type,
            vod: data[0]?.id,
            gameId: data[0]?.game_id
        }
        return live
    }),
});
