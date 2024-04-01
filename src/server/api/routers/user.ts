import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'

export const usersRouter = createTRPCRouter({
	getAllUsersTeams: protectedProcedure
		.query(async ({ ctx }) => {
            const currentUserTeam = await ctx.db.team.findFirst({
                where: { ownerId: ctx.session.user.id },
                select: { id: true }
            })
        
            const members = await ctx.db.user.findMany(
                {
                    where:{
                        NOT:[
                            { 
                                id: ctx.session.user.id, 
                            },
                            { 
                                invitee: {
                                    some: {
                                        AND: [
                                            { teamId: currentUserTeam?.id }
                                        ]
                                    }
                                }
                            }
                        ],
                    },
                    
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        invitee: {
                            where: {
                                teamId: currentUserTeam?.id
                            },
                            select: { 
                                status: true,
                            }
                        },
                    }
                },
            )
            
			return members
	}),
})
