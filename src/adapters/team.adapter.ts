import { type StatusInvitations } from "@prisma/client"

export type Members = {
	
	name: string | null
	image: string | null
	// role: string
	status: StatusInvitations
}

export const membersTeamAdapter = (members: {
    status: StatusInvitations 
    invitee: {
        name: string | null
        image: string | null
    }
}[] ) => {
    const listMembers: Members[] = []
    members.map((m) => listMembers.push({
        name: m.invitee.name,
        image: m.invitee.image,
        status: m.status,
    }))
    return listMembers
}

