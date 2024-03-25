'use client'
import Image from 'next/image'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { LogOut, LayoutDashboard, Wallet, Users } from 'lucide-react'

export function Navbar() {
	const { data: session } = useSession()

	const userImage = session?.user?.image as string | undefined
	const initalName = session?.user?.name
		?.split(' ')
		.map((n: string) => n[0])
		.join('')

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
			<div className="ml-3 flex flex-1 font-semibold">
				<Link
					className="p-4 font-semibold text-white transition duration-300 ease-in-out hover:bg-purple-600 hover:bg-opacity-10"
					href="/pricing">
					Pricing
				</Link>
				<Link
					className="p-4 font-semibold text-white transition duration-300 ease-in-out hover:bg-purple-600 hover:bg-opacity-10"
					href="https://trecord.featurebase.app/?b=65aef3148a898e7dd20aae96"
					target="_blank">
					Feedback
				</Link>
				<Link
					className="p-4 font-semibold text-white transition duration-300 ease-in-out hover:bg-purple-600 hover:bg-opacity-10"
					href="https://trecord.featurebase.app/roadmap"
					target="_blank">
					Roadmap
				</Link>
				<Link
					className="p-4 font-semibold text-white transition duration-300 ease-in-out hover:bg-purple-600 hover:bg-opacity-10"
					href="https://trecord.featurebase.app/changelog"
					target="_blank">
					Changelog
				</Link>
			</div>
			<div className="flex justify-end">
				{session?.user?.image ? (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Avatar className="cursor-pointer">
								<AvatarImage src={userImage} alt="profile-image" />
								<AvatarFallback>{initalName}</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56">
							<DropdownMenuGroup>
								<Link href="/dashboard/">
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
								<Link href="/team">
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
					<Button
						onClick={async () => {
							await signIn('twitch', { callbackUrl: '/dashboard' })
						}}>
						Get Started
					</Button>
				)}
			</div>
		</nav>
	)
}
