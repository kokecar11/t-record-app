'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { api } from '~/trpc/react'
import { useSession } from 'next-auth/react'
import { useQueryClient } from '@tanstack/react-query'

import { Check, Plus, X } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Loader } from '~/components/ui/loader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Avatar, AvatarImage } from '~/components/ui/avatar'
import { DataTable } from '~/app/_components/data-table'
import { columnsTeams } from '~/app/_components/team/columns'
import { CreateTeamForm } from '~/app/_components/team/create-team-form'
import AlertUpgrade from '~/app/_components/alert-upgrade'
import { type Invitation, type Team } from '~/adapters/team.adapter'

export default function Teams() {
	const searchParams = useSearchParams()
	const [tabsValue, setTabsValue] = useState(
		searchParams.get('tabs') ?? 'teams',
	)

	const queryClient = useQueryClient()

	const { data: session } = useSession()
	const [teams, setTeams] = useState<Team[]>([])
	const [invitations, setInvitations] = useState<Invitation[]>([])

	const { data: allTeamsData } = api.team.myTeams.useQuery()
	const { data: allInvitations } = api.team.invitations.useQuery()

	const tabs: { value: string; label: string }[] = [
		{ value: 'teams', label: 'My Teams' },
		{ value: 'invitations', label: 'Invitations' },
	]
	const { mutate } = api.team.acceptOrRejectInvitation.useMutation({
		onSuccess: async () => {
			await queryClient.invalidateQueries()
		},
	})

	useEffect(() => {
		if (searchParams.get('tabs')) {
			setTabsValue(searchParams.get('tabs') ?? 'teams')
		}
		if (allTeamsData) {
			setTeams(allTeamsData)
		}
		if (allInvitations) {
			setInvitations(allInvitations)
		}
	}, [allTeamsData, allInvitations, searchParams])

	return (
		<main className="container flex min-h-screen flex-col rounded-lg bg-background/50 text-white">
			{session ? null : <Loader />}
			<div className="container">
				<div className="mx-auto mb-4 mt-6 flex items-center rounded-lg bg-background p-4 shadow-lg">
					<h1 className="flex-1 text-2xl font-bold">Teams</h1>
					{session?.user.plan === 'STARTER' ? (
						<AlertUpgrade>
							<Button>
								<Plus className="mr-2 h-4 w-4" />
								Create a Team
							</Button>
						</AlertUpgrade>
					) : (
						<CreateTeamForm />
					)}
				</div>
				<Tabs
					defaultValue={tabsValue}
					className="rounded-lg bg-background p-2 shadow-lg">
					<TabsList>
						{tabs.map((tab) => (
							<TabsTrigger key={tab.value} value={tab.value}>
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>
					<div className="my-2 w-full rounded-lg p-4 shadow-lg">
						<TabsContent value="teams">
							<div className="">
								<DataTable columns={columnsTeams} data={teams} />
							</div>
						</TabsContent>
						<TabsContent value="invitations">
							<div className="">
								{invitations.length > 0
									? invitations.map((invitation) => (
											<div key={invitation.id}>
												<Alert>
													<AlertTitle className="flex items-center space-x-2">
														<Avatar>
															<AvatarImage
																src={invitation.inviter?.image ?? ''}
																alt="profile-image"
															/>
														</Avatar>
														<span className="font-bold">
															{invitation.inviter.name}
														</span>
													</AlertTitle>
													<AlertDescription>
														<div className="flex items-center space-x-2">
															<p className="flex-1">
																invited you to join the team{' '}
																<span className="font-semibold">
																	{invitation.team.name}
																</span>
															</p>

															<Button
																onClick={() =>
																	mutate({
																		invitationId: invitation.id,
																		status: 'accepted',
																	})
																}>
																<Check className="mr-1 h-4 w-4" />
																Accept
															</Button>
															<Button
																variant={'outline'}
																onClick={() =>
																	mutate({
																		invitationId: invitation.id,
																		status: 'rejected',
																	})
																}>
																<X className="mr-1 h-4 w-4" />
																Reject
															</Button>
														</div>
													</AlertDescription>
												</Alert>
											</div>
										))
									: 'No invitations'}
							</div>
						</TabsContent>
					</div>
				</Tabs>
				<div className="w-full rounded-lg bg-secondary/30 shadow-lg"></div>
			</div>
		</main>
	)
}
