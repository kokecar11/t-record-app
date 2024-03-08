import { z } from "zod";
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
                status: input.filters?.status ?? undefined,
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
});
