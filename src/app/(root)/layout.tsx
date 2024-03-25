import '~/styles/globals.css'

import { Navbar } from '~/components/layout/navbar'
import { Footer } from '~/components/layout/footer'

export const metadata = {
	title: 'T-Record',
	description: '',
	icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootChildrenLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="bg-[#15162c]">
			<Navbar />
			{children}
			<Footer />
		</div>
	)
}
