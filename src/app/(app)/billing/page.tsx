import type { Metadata } from 'next'
import { format } from 'date-fns'
import { api } from '~/trpc/server'
import { getServerAuthSession } from '~/server/auth'

import BtnCancelSubscription from '~/app/_components/billing/btn-cancel-sub'
import { DataTable } from '~/app/_components/billing/data-table'
import { columns } from '~/app/_components/billing/columns'
import { BtnUpgradeSub } from '~/app/_components/billing/btn-upgrade-sub'

export const metadata: Metadata = {
	title: 'T-Record | Plan & Billing',
	description:
		'Descubre los detalles de nuestros planes, gratuito y de pago, con información sobre fechas de caducidad y renovación, así como precios. ¡Encuentra el plan perfecto para ti!',
}

export default async function Billing() {
	const session = await getServerAuthSession()
	const subscription = await api.subscriptions.getSubscriptionByUserId.mutate()
	const billingHistory =
		await api.subscriptions.billingHistoryLemonSqueezy.mutate()
	return (
		<main className="container flex min-h-screen flex-col bg-background text-white">
			<div className="container">
				<div className="my-2 rounded-lg bg-primary/30 p-2 shadow-lg">
					<div className="mx-4 flex items-center border-b border-white/50 pt-4">
						<div className="flex-1">
							<span className="text-xl font-bold">Plan Information</span>
							<h2 className="mb-1 text-sm text-gray-200">
								Plan information description
							</h2>
						</div>
						<div className="flex-none">
							{session?.user.plan === 'STARTER' ? (
								<BtnUpgradeSub />
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
						<div className="grid text-sm font-semibold capitalize sm:flex-1">
							<span className="text-sm font-normal text-gray-400">Payment</span>
							{session?.user.plan === 'STARTER' ? (
								<span className="text-sm font-semibold capitalize text-white">
									FREE
								</span>
							) : subscription?.type === 'monthly' ? (
								<span>
									${subscription?.plan.price_monthly}
									<span className="text-xs lowercase text-gray-100">
										{' '}
										per month
									</span>
								</span>
							) : (
								<span>
									${subscription?.plan.price_yearly}
									<span className="text-xs lowercase text-gray-100">
										{' '}
										per year
									</span>
								</span>
							)}
						</div>
						{subscription?.status && (
							<div className="grid sm:flex-1">
								<span className="text-sm text-gray-400">Current Status</span>
								<span className="text-sm font-semibold capitalize text-white">
									{subscription.status}
								</span>
							</div>
						)}
						{subscription?.renews_at && (
							<div className="grid sm:flex-1">
								<span className="text-sm text-gray-400">Renews at</span>
								<span className="text-sm font-semibold text-white">
									{format(new Date(subscription.renews_at), 'd LLL, yyyy')}
								</span>
							</div>
						)}
						{subscription?.ends_at && (
							<div className="grid sm:flex-1">
								<span className="text-sm text-gray-400">Ends at</span>
								<span className="text-sm font-semibold text-white">
									{format(new Date(subscription.ends_at), 'd LLL, yyyy')}
								</span>
							</div>
						)}
					</div>
				</div>
				<div className="my-4 rounded-lg bg-[#15162c] p-2 shadow-lg">
					<div className="mx-4 flex border-b border-white/50 pt-4">
						<div className="flex-1">
							<span className="text-xl font-bold">Billing History</span>
							<h2 className="mb-1 text-sm text-gray-200">
								Billing information history
							</h2>
						</div>
					</div>
					<div className="p-4">
						<DataTable columns={columns} data={billingHistory} />
					</div>
				</div>
			</div>
		</main>
	)
}
