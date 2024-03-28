import '~/styles/globals.css'
import { GoogleTagManager } from '@next/third-parties/google'

import { TRPCReactProvider } from '~/trpc/react'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '~/components/theme-provider'
import { Toaster } from '~/components/ui/toaster'

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-sans',
})

export const metadata = {
	title: 'T-Record',
	description: '',
	icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={`font-sans ${inter.variable} bg-background`}>
				<TRPCReactProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="dark"
						enableSystem
						disableTransitionOnChange>
						{children}
					</ThemeProvider>
				</TRPCReactProvider>
				<Toaster />
			</body>
			<GoogleTagManager gtmId="GTM-MLT5XFTT" />
		</html>
	)
}
