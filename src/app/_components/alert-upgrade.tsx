'use client'
import { useRouter } from 'next/navigation'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '~/components/ui/alert-dialog'

interface AlertUpgradeProps {
	defaultOpen?: boolean
	children: React.ReactNode
}
export default function AlertUpgrade({
	defaultOpen = false,
	children,
}: AlertUpgradeProps) {
	const router = useRouter()
	return (
		<AlertDialog defaultOpen={defaultOpen}>
			{children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Upgrade your plan to unlock more features
					</AlertDialogTitle>
					<AlertDialogDescription>
						Upgrade now to access a wider range of tools and capabilities that
						will enhance your experience.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction
						onClick={async () => {
							router.push('/billing')
						}}>
						Continue to billing
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
