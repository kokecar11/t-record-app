'use client'
import { useSession } from 'next-auth/react'
import AlertUpgrade from '~/app/_components/alert-upgrade'
import { DataTable } from '~/app/_components/data-table'
import { Button } from '~/components/ui/button'
import { Loader } from '~/components/ui/loader'

import { columnsMembers } from '~/app/_components/team/columns-members'
import { useEffect, useState } from 'react'
import { api } from '~/trpc/react'
import { CreateTeamForm } from '~/app/_components/team/create-team-form'

export default function MyTeam({ params }: { params: { id: string } }) {
	const { data: session } = useSession()
	const [members, setMembers] = useState<[]>([])
	const [team, setTeam] = useState<{ name: string }>({ name: '' })
	const { data: allmembersData } = api.team.getAllMembers.useQuery()
	const { data: teamData } = api.team.getDataTeam.useQuery()

	useEffect(() => {
		if (allmembersData) {
			console.log(allmembersData)
		}
		if (teamData) {
			setTeam(teamData)
		}
	}, [allmembersData, teamData])

	return (
		<main className="container flex min-h-screen flex-col bg-background text-white">
			<div className="container">
				<h1 className="text-2xl font-bold">Team</h1>
				{session ? null : <Loader />}
				{session?.user.plan === 'STARTER' ? (
					<AlertUpgrade />
				) : (
					<div className="my-2 rounded-lg bg-primary/30 p-2 shadow-lg">
						<div className="mx-4 flex items-center border-b border-white/50 pt-4">
							<div className="flex-1">
								<h2 className="text-xl font-bold">
									{team.name ? team.name : 'No team name'}
								</h2>
								<p className="mb-1 text-sm text-gray-200">
									{/* {team.name ? team.name : 'No team name'} */}
								</p>
							</div>
							<div className="flex-none">
								{team.name ? <Button>Invite user</Button> : <CreateTeamForm />}
							</div>
						</div>

						<div className="p-4">
							{/* <div className="grid sm:flex-1">
								<span className="text-sm text-gray-400">Current Plan</span>
								<span className="text-sm font-semibold capitalize text-white"></span>
							</div>
							<div className="grid text-sm font-semibold capitalize sm:flex-1">
								<span className="text-sm font-normal text-gray-400">
									Payment
								</span>
							</div> */}
							<DataTable columns={columnsMembers} data={members} />
						</div>
					</div>
				)}
			</div>
		</main>
	)
}
