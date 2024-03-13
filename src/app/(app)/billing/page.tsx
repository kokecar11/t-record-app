import type { Metadata } from 'next'
import BtnCancelSubscription from '~/app/_components/billing/btn-cancel-sub'
import { Button } from '~/components/ui/button'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table'

import { getServerAuthSession } from '~/server/auth'
import { api } from '~/trpc/server'

export const metadata: Metadata = {
	title: 'T-Record | Plan & Billing',
	description: 'T-Record Dashboard',
}

export default async function Billing() {
	const session = await getServerAuthSession()
	const subscription = await api.subscriptions.getSubscriptionByUserId.mutate()

	return (
		<main className="container flex min-h-screen flex-col bg-background text-white">
			<div className="container">
				<div className="my-2 rounded-lg border-2 border-primary bg-primary/30 shadow-lg">
					<div className="mx-4 flex border-b border-white/50 pt-4">
						<div className="flex-1">
							<h1 className="text-xl font-bold">Plan Information</h1>
							<h2 className="mb-1 text-sm text-gray-400">
								Plan information description
							</h2>
						</div>
						<div className="flex-none">
							{session?.user.plan === 'STARTER' ? (
								// <Button variant={'default'} className="">
								// 	Upgrade Plan
								// </Button>
								<BtnCancelSubscription />
							) : (
								<BtnCancelSubscription />
							)}
						</div>
					</div>

					<div className="flex p-4 sm:space-x-16">
						<div className="grid sm:flex-1">
							<span className="text-sm text-gray-400">Current Plan</span>
							<span className="text-sm font-semibold capitalize text-white">
								{session?.user.plan.toLowerCase()}
							</span>
						</div>
						<div className="grid sm:flex-1">
							<span className="text-sm text-gray-400">Payment</span>
							{session?.user.plan === 'STARTER' ? (
								<span className="text-lg capitalize text-white">FREE</span>
							) : subscription?.type === 'monthly' ? (
								<span className="text-sm font-semibold capitalize text-white">
									${subscription?.plan.price_monthly}
									<span className="text-xs lowercase text-gray-100">
										{' '}
										per month
									</span>
								</span>
							) : (
								<span className="text-sm font-semibold capitalize text-white">
									${subscription?.plan.price_yearly}
									<span className="text-xs lowercase text-gray-100">
										{' '}
										per year
									</span>
								</span>
							)}
						</div>
						{subscription?.renews_at && (
							<div className="grid sm:flex-1">
								<span className="text-sm text-gray-400">Renews at</span>
								<span className="text-sm font-semibold text-white">
									{subscription.renews_at.toDateString()}
								</span>
							</div>
						)}
						{subscription?.ends_at && (
							<div className="grid sm:flex-1">
								<span className="text-sm text-gray-400">Ends at</span>
								<span className="text-sm font-semibold text-white">
									{subscription.ends_at.toDateString()}
								</span>
							</div>
						)}
					</div>
				</div>
				{/* TODO:Verificar Billing information con LS */}
				<div className="my-4 rounded-lg border-2 bg-primary-old">
					<div className="mx-4 border-b border-white/50 pt-4">
						<h1 className="text-xl font-bold">Billing Information</h1>
						<h2 className="mb-1 text-sm text-gray-400">
							Billing information description
						</h2>
					</div>
					<div className="p-4">
						<Table>
							<TableCaption>A list of your recent invoices.</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[100px]">Invoice</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Method</TableHead>
									<TableHead className="text-right">Amount</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableCell className="font-medium">INV001</TableCell>
									<TableCell>Paid</TableCell>
									<TableCell>Credit Card</TableCell>
									<TableCell className="text-right">$250.00</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</main>
	)
}
