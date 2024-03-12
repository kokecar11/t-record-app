import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const markerRouter = createTRPCRouter({
    create: protectedProcedure
    .input(z.object({ title: z.string().min(1), stream_date: z.date() }))
    .mutation(async ({ ctx, input }) => {
        return ctx.db.marker.create({
            data: {
                title: input.title,
                stream_date: input.stream_date,
                userId: ctx.session.user.id
                
            },
        });
    }),

    getMarkers: protectedProcedure
    .input(z.object(
        { filters: z.object(
            { 
                status: z.enum(['RECORDING', 'UNRECORDED', 'RECORDED']).optional(),
                selectDayStream: z.date()
            }
            )
        }
        ))
    .query(async ({ctx, input}) => {
        const query = await ctx.db.marker.findMany({
            where: { 
                userId: ctx.session.user.id,
                status: input.filters?.status,
                stream_date: input.filters?.selectDayStream
            },
        })
        return query
    }),
    
    getAllMarkersCalendar: protectedProcedure
    .query(async ({ctx}) => {
        return await ctx.db.marker.findMany({
            where: { 
                userId: ctx.session.user.id,
            },
            select: {
                stream_date: true,
            }
        })
    }),

    setMarkerInStream: protectedProcedure
    .input(z.object({ marker: z.object({
        id: z.string(),
        title: z.string(),
    }), isStartMarker: z.boolean() }))
    .mutation(async ({ctx, input}) => {
        const urlApiTwitch = new URL('https://api.twitch.tv/helix/streams/markers')
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
        urlApiTwitch.searchParams.set('description', input.marker.title)
        const respStream = await fetch(`${urlApiTwitch.toString()}`, {
            method:'POST',
            cache: "force-cache",
            headers
        })
        const { data, status } = await respStream.json() as  { data: { position_seconds:number } [], status: number }
        
        if (status === 404){
            return {
                updatedMarkerResult: undefined,
                title:'VOD Not ready.',
                message: 'Stream markers aren’t available during the first few seconds of a stream. Wait a few seconds and try again.'
            }
        }
        const position_seconds = data[0]?.position_seconds
        
        if(input.isStartMarker){
            const updatedMarkerResult = await ctx.db.marker.update({
                where: {
                    userId: ctx.session.user.id, 
                    id: input.marker.id
                },
                data: {
                    status:'RECORDING',
                    starts_at: position_seconds,
                }
            })
            
            return { 
                updatedMarkerResult,
                title: "Recording started",
                description: "The recording has started"
            }
        }else{
            const updatedMarkerResult = await ctx.db.marker.update({
                where: {
                    userId: ctx.session.user.id, 
                    id: input.marker.id
                },
                data: {
                    status:'RECORDED',
                    ends_at: position_seconds,
                }
            })
            return { 
                updatedMarkerResult,
                title: "Recording stopped",
                description: "The recording has stopped"
            }
        }
    }),

    setVODInMarker: protectedProcedure
    .input(z.object({ marker: z.object({
        id: z.string(),
    }), isStartMarker: z.boolean() }))
    .mutation(async ({ctx, input}) => {
        const urlApiTwitch = new URL('https://api.twitch.tv/helix/videos')
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
        urlApiTwitch.searchParams.set('type', 'archive')
        urlApiTwitch.searchParams.set('sort', 'time')
        const respStream = await fetch(`${urlApiTwitch.toString()}`, {
            method:'GET',
            cache: "force-cache",
            headers
        })
        const { data } = await respStream.json() as { data: { id:string }[] }
        
        if (data.length <= 0){
            return {
                title:'VOD Not ready.',
                message: 'Stream markers aren’t available during the first few seconds of a stream. Wait a few seconds and try again.'
            }
        }
        const VODStream = data[0]?.id
        if(input.isStartMarker){
            const updatedMarkerResultVOD = await ctx.db.marker.update({
                where: {
                    userId: ctx.session.user.id, 
                    id: input.marker.id
                },
                data: {
                    videoIdStreamStart: VODStream
                }
            })
            return { 
                updatedMarkerResultVOD,
                title: "",
                message: ""
            }
        }else{
            const updatedMarkerResultVOD = await ctx.db.marker.update({
                where: {
                    userId: ctx.session.user.id, 
                    id: input.marker.id
                },
                data: {
                    videoIdStreamEnd: VODStream
                }
            })
            return { 
                updatedMarkerResultVOD,
                title: "",
                message: ""
            }
        }
        
    }),
});
