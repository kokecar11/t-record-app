import { z } from "zod";
import { createTRPCRouter,protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const accountRouter = createTRPCRouter({
    getAccountById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
        console.log('input:', input)
        const account = await ctx.db.account.findFirst({
            where: {
                userId: input.id, 
                provider: "twitch"
            },
            // select: {
            //     id: true,
            // },
        });
        return account
    }),
    getAccountByProvider: protectedProcedure.query(async ({ ctx }) => {
        return `hello ${ctx.session.user.name}!`
    })
});
