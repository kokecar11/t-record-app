import { getServerSession } from 'next-auth'
import { unstable_noStore as noStore } from 'next/cache'
import { authOptions } from '~/server/auth'
import TryForFreeButton from '../_components/try-for-free'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'T-Record',
	description:
		"Unlock the power of T-Record's real-time markers for your lives. Organize, customize, and engage like never before. Boost your Twitch presence with T-Record today!",
}

export default async function Home() {
	noStore()
	const session = await getServerSession(authOptions)

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#15162c] to-[#2e026d] text-white">
			<div className="container flex flex-col items-center justify-center gap-12 px-4 py-14">
				<h1 className="animate-fade-down mx-auto max-w-[20ch] text-center text-7xl font-bold leading-[1.1]">
					Discover the power of{' '}
					<span className="animate-hero-title bg-gradient-to-r from-live via-[#9444fb] to-live bg-clip-text text-transparent">
						organization on Twitch
					</span>
				</h1>
				<h2 className="animate-fade-down mx-auto max-w-[60ch] text-center text-lg text-gray-300">
					We optimize your markers and turn them into chapters, allowing you to
					explore your most exciting moments with ease and speed.
				</h2>

				{!session && <TryForFreeButton />}

				<div className="animate-fade-down my-4 flex place-content-center items-center">
					<video
						width={1080}
						className="rounded-lg"
						loop
						src="https://res.cloudinary.com/dlcx4lubg/video/upload/f_auto:video,q_auto/s8uqnjezzoudl3b3euss"></video>
				</div>

				<div className="container flex flex-col items-center gap-4">
					<h3 className="text-center text-4xl font-bold">
						Features to help you grow
					</h3>
					<div className="my-2 grid grid-cols-1 gap-4 rounded-lg px-2 py-4 backdrop-blur-lg sm:grid-cols-3">
						<div className="animate-fade-right col-span-1 rounded-lg border border-white border-opacity-10 bg-white/10 p-6 shadow-lg backdrop-blur-3xl backdrop-filter transition-all hover:bg-white/20 sm:col-span-2">
							<h3 className="text-xl font-medium text-white">
								Link to go to the marker on VOD highlighter.
							</h3>
							<p className="mt-2 text-sm text-white">
								T-Record revolutionizes the viewing experience with its standout
								VOD Highlighter feature. This innovative system allows users to
								access key moments in their videos through personalized links,
								streamlining navigation and providing an efficient way to review
								meaningful content in seconds.
							</p>
						</div>

						<div className="animate-fade-left rounded-lg border border-white border-opacity-10 bg-white/10 p-6 shadow-lg backdrop-blur-3xl backdrop-filter transition-all hover:bg-white/20">
							<h3 className="text-xl font-medium text-white">
								Manage your markers.
							</h3>
							<p className="mt-2 text-sm text-white">
								Effortlessly manage your markers with T-Record&apos;s dashboard.
								Streamline your experience and organize key points efficiently.
							</p>
						</div>

						<div className="animate-fade-right rounded-lg border border-white border-opacity-10 bg-white/10 p-6 shadow-lg backdrop-blur-3xl backdrop-filter transition-all hover:bg-white/20">
							<h3 className="text-xl font-medium text-white">
								Notification of marker closing in the chat (coming soon).
							</h3>
							<p className="mt-2 text-sm text-white">
								Reminder notification to close the marker in the chat: Receive
								instant alerts to ensure you don&apos;t forget to close your
								markers.
							</p>
						</div>

						<div className="animate-fade-left col-span-1 rounded-lg border border-white border-opacity-10 bg-white/10 p-6 shadow-lg backdrop-blur-3xl backdrop-filter transition-all hover:bg-white/20 sm:col-span-2">
							<h3 className="text-xl font-medium text-white">
								Team manage your markers (coming soon).
							</h3>
							<p className="mt-2 text-sm text-white">
								Your team effortlessly manages your markers with T-Record.
								Simplify collaboration and streamline your workflow with this
								intuitive feature.
							</p>
						</div>
					</div>
				</div>

				<div className="flex flex-col items-center gap-2">
					<div className="flex flex-col items-center justify-center gap-4"></div>
				</div>
			</div>
		</main>
	)
}
