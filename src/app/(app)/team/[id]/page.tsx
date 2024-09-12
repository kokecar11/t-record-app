'use client'

import { useEffect, useState } from 'react'
import { api } from '~/trpc/react'
import Live from '~/app/_components/live'
import { CreateMarkerForm } from '~/app/_components/markers/create-marker-form'
import { DataTable } from '~/app/_components/data-table'
import { columnsMembers } from '~/app/_components/team/columns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import Markerlist from '~/app/_components/markers/markers-list'
import { DatePickerFilter } from '~/app/_components/markers/date-picker-filter'
import SelectFilter from '~/app/_components/markers/select-filter'
import { AddMemberForm } from '~/app/_components/team/add-member-form'
import { SendEmailInvitationForm } from '~/app/_components/team/send-email-invitation-form'
import type { Members } from '~/adapters/team.adapter'
import type { Permission, Role } from '@prisma/client'

export default function MyTeam({ params }: { params: { id: string } }) {
	const [members, setMembers] = useState<Members[]>([])

	const [team, setTeam] = useState<{
		name: string
		owner: {
			name: string | null
			image: string | null
		}
	}>({ name: '', owner: { name: 'Team name', image: '' } })

	const [userPermission, setUserPermission] = useState<{
		role: Role
		permissions: Permission[]
	}>({ role: 'MEMBER', permissions: ['TEAM_MARKER_VIEW'] })

	const { data: allMembersData } = api.team.members.useQuery({
		teamId: params.id,
	})
	const { data: teamData } = api.team.dataTeam.useQuery({ id: params.id })
	const { data: userPermissionData } = api.team.userPermissionsAndRole.useQuery(
		{
			teamId: params.id,
		},
	)

	useEffect(() => {
		if (allMembersData) {
			setMembers(allMembersData)
		}
		if (userPermissionData) {
			setUserPermission(userPermissionData)
		}
		if (teamData) {
			setTeam(teamData)
		}
	}, [allMembersData, teamData, userPermissionData])

	const tabs: { value: string; label: string }[] = [
		{ value: 'dashboard', label: 'Dashboard' },
		// { value: 'stream', label: 'Stream' },
		{ value: 'members', label: 'Members' },
		// { value: 'notes', label: 'Notes' },
	]

	return (
		<main className="container flex min-h-screen flex-col text-white">
			<Tabs className="container" defaultValue="dashboard">
				<div className="mx-auto my-4 flex items-center rounded-lg bg-background p-4 shadow-lg">
					<div className="flex-1 place-items-center ">
						<h1 className="text-xl font-bold">{team.owner.name}&apos;s team</h1>
						<div className="flex gap-1">
							<span>Status: </span> <Live teamId={params.id} />
						</div>
					</div>

					<div className="flex-none">
						<TabsList>
							{tabs.map((tab) => (
								<TabsTrigger key={tab.value} value={tab.value}>
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>
					</div>
				</div>

				<div className="w-full rounded-lg bg-background/20 px-5 py-3">
					<TabsContent value="dashboard">
						<div className="min-h-screen">
							<div className="my-1 gap-y-4 rounded-lg bg-background p-4 shadow-lg sm:flex sm:space-x-4">
								<div className="grid gap-y-4 sm:flex sm:flex-1 sm:space-x-4">
									{userPermission.permissions.includes(
										'TEAM_MARKER_CREATE',
									) && <CreateMarkerForm teamId={params.id} />}
								</div>
								<div className="mt-4 flex items-center justify-center space-x-4 sm:m-0">
									<DatePickerFilter idTeam={params.id} />
									<SelectFilter />
								</div>
							</div>
							<Markerlist teamId={params.id} />
						</div>
					</TabsContent>
					<TabsContent value="members" className="min-h-screen">
						<div className="rounded-lg bg-background px-4 py-2 shadow-lg">
							<div className="my-1 gap-y-4 rounded-lg bg-background p-4 shadow-lg sm:flex sm:space-x-4">
								<div className="grid gap-y-4 sm:flex sm:flex-1 sm:space-x-4">
									{/* <SendInvitationForm /> */}
								</div>
								<div className="mt-4 flex items-center justify-center space-x-4 sm:m-0">
									{(userPermission.role === 'OWNER' ||
										userPermission.permissions.includes(
											'TEAM_USER_INVITE',
										)) && (
										<div>
											<AddMemberForm /> <SendEmailInvitationForm />
										</div>
									)}
								</div>
							</div>
							<DataTable columns={columnsMembers} data={members} />
						</div>
					</TabsContent>
				</div>
			</Tabs>
			{/* </div> */}
		</main>
	)
}
