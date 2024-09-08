import type { StatusInvitations, Permission, Role } from '@prisma/client';

export type Members = {
	user: {
        name: string | null
        image: string | null
        id: string
    }
	role: Role
	status: StatusInvitations
    permissions: Permission[]
}

export type Team = {
    id: string
	name: string | null | undefined
    totalMembers: number
}

export type Invitation = {
    id: string;
    team: {
        id: string;
        name: string;
        ownerId: string;
    };
    inviter: {
        name: string | null;
        image: string | null;
    }
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

