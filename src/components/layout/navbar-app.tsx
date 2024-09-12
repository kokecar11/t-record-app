'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useQueryClient } from '@tanstack/react-query'
import { api } from '~/trpc/react'
import Live from '~/app/_components/live'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Skeleton } from '../ui/skeleton'
import {
	LogOut,
	LayoutDashboard,
	Wallet,
	Users,
	Bell,
	X,
	Check,
	PlusCircle,
	BellDot,
} from 'lucide-react'
import { Button } from '../ui/button'

import { CreateTeamForm } from '~/app/_components/team/create-team-form'
import AlertUpgrade from '~/app/_components/alert-upgrade'

export function NavbarApp() {
	const [teams, setTeams] = useState<
		{
			id: string
			name: string
			image: string
			isOwner: boolean
		}[]
	>([])
	const [invitations, setInvitations] = useState<
		{
			id: string
			inviter: {
				name: string | null
				image: string | null
			}
		}[]
	>([])
	const { data: session } = useSession()
	const router = useRouter()

	const { data: allTeamsData } = api.team.myTeams.useQuery()
	const { data: allInvitations } = api.team.invitations.useQuery()
	const queryClient = useQueryClient()

	const userImage = session?.user?.image as string | undefined
	const initalName = session?.user?.name
		?.split(' ')
		.map((n: string) => n[0])
		.join('')
	const handlerNav = () => router.push('/billing/', { scroll: false })
	const { mutate } = api.team.acceptOrRejectInvitation.useMutation({
		onSuccess: async () => {
			await queryClient.invalidateQueries()
		},
	})

	useEffect(() => {
		if (allTeamsData) {
			setTeams(allTeamsData)
		}
		if (allInvitations) {
			setInvitations(allInvitations)
		}
	}, [allTeamsData, allInvitations])
	return (
		<nav className="container sticky top-0 z-10 flex w-full items-center justify-between bg-transparent px-4 py-1.5 backdrop-blur-lg backdrop-filter sm:px-14">
			<Link href="/" className="flex items-center">
				<Image
					src="/images/logo.png"
					alt="Budgets-map logo"
					width={40}
					height={40}
				/>
				<span className="ml-2 text-xl font-semibold text-primary text-white">
					T-Record
				</span>
			</Link>
			<div className="ml-3 flex flex-1 font-semibold"></div>
			<div className="flex flex-none items-center space-x-4">
				{session?.user.plan ? (
					session?.user.plan === 'PLUS' ? null : (
						<Button variant="plus" className="capitalize" onClick={handlerNav}>
							{' '}
							update your plan
						</Button>
					)
				) : (
					<Skeleton className="h-[22px] w-[66px] rounded-full"></Skeleton>
				)}
				<Live teamId="" />
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost">
							<Bell className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-full">
						<DropdownMenuLabel className="flex-col">
							Notifications
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							{invitations.map((invitation) => (
								<DropdownMenuItem key={invitation.id}>
									<BellDot className="mx-4 h-4 w-4" />
									<div>
										<div className="flex place-items-center">
											<Avatar className="mr-2 h-6 w-6">
												<AvatarImage
													src={invitation.inviter.image!}
													alt="profile-image"
												/>
												<AvatarFallback>
													{invitation.inviter.name?.split(' ').map((n) => n[0])}
												</AvatarFallback>
											</Avatar>
											<span>{invitation.inviter.name}</span>
										</div>

										<p className="mr-2">Invited you to join the team</p>
									</div>

									<div className="flex gap-2">
										<Button
											size={'icon'}
											onClick={() =>
												mutate({
													invitationId: invitation.id,
													status: 'accepted',
												})
											}>
											<Check className="h-4 w-4" />
										</Button>
										<Button
											size={'icon'}
											variant={'destructive'}
											onClick={() =>
												mutate({
													invitationId: invitation.id,
													status: 'rejected',
												})
											}>
											<X className="h-4 w-4" />
										</Button>
									</div>
								</DropdownMenuItem>
							))}
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
				<div className="">
					{session?.user?.image ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Avatar className="cursor-pointer">
									<AvatarImage src={userImage} alt="profile-image" />
									<AvatarFallback>{initalName}</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56">
								<DropdownMenuLabel className="flex-col">
									<p className="font-bold">{session.user.name}</p>
									<p className="text-xs font-light capitalize text-gray-400">
										{session.user.plan === 'PLUS' ? (
											<span className="animate-hero-title font-semibold text-pink-600">
												Plan Plus
											</span>
										) : (
											'Plan Starter'
										)}
									</p>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<Link href="/dashboard">
										<DropdownMenuItem className="cursor-pointer">
											<LayoutDashboard className="mr-2 h-4 w-4" />
											<span>Dashboard</span>
										</DropdownMenuItem>
									</Link>
									<Link href="/billing">
										<DropdownMenuItem className="cursor-pointer">
											<Wallet className="mr-2 h-4 w-4" />
											<span>Billing</span>
										</DropdownMenuItem>
									</Link>
									<DropdownMenuSub>
										<DropdownMenuSubTrigger className="cursor-pointer">
											<Users className="mr-2 h-4 w-4" />
											<span>Teams</span>
										</DropdownMenuSubTrigger>
										<DropdownMenuPortal>
											<DropdownMenuSubContent>
												{teams?.map((team) => (
													<Link key={team.id} href={`/team/${team.id}`}>
														<DropdownMenuItem className="cursor-pointer">
															<Avatar className="mr-2 h-4 w-4">
																<AvatarImage
																	src={team.image}
																	alt="profile-image"
																/>
															</Avatar>
															<span className="mr-2">{team.name}</span>
															<Live teamId={team.id} showLabel={false} />
														</DropdownMenuItem>
													</Link>
												))}
												<DropdownMenuSeparator />
												{session?.user.plan === 'STARTER' ? (
													<AlertUpgrade>
														<DropdownMenuItem
															className="cursor-pointer"
															asChild
															onSelect={(e) => e.preventDefault()}>
															<span>
																<PlusCircle className="mr-2 h-4 w-4" />
																Create a Team
															</span>
														</DropdownMenuItem>
													</AlertUpgrade>
												) : (
													<CreateTeamForm />
												)}
											</DropdownMenuSubContent>
										</DropdownMenuPortal>
									</DropdownMenuSub>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={async () => {
										await signOut()
									}}
									className="cursor-pointer">
									<LogOut className="mr-2 h-4 w-4" />
									<span>Logout</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Skeleton className="h-10 w-10 rounded-full" />
					)}
				</div>
			</div>
		</nav>
	)
}
