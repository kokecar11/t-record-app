'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import Live from '~/app/_components/live'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Skeleton } from '../ui/skeleton'
import { LogOut, LayoutDashboard, Wallet, Users } from 'lucide-react'
import { Button } from '../ui/button'

export function NavbarApp() {
	const { data: session } = useSession()
	const router = useRouter()

	const userImage = session?.user?.image as string | undefined
	const initalName = session?.user?.name
		?.split(' ')
		.map((n: string) => n[0])
		.join('')
	const handlerNav = () => router.push('/billing/', { scroll: false })

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
									<Link href="/teams">
										<DropdownMenuItem className="cursor-pointer">
											<Users className="mr-2 h-4 w-4" />
											<span>Team</span>
										</DropdownMenuItem>
									</Link>
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
