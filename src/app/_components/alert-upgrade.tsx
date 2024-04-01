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
} from '~/components/ui/alert-dialog'

export default function AlertUpgrade() {
	const router = useRouter()

	return (
		<AlertDialog defaultOpen>
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
