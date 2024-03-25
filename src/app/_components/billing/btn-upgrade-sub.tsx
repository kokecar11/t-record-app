'use client'

import { useState } from 'react'
import { type TypeSubscription } from '@prisma/client'
import { Button } from '~/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/dialog'
import { api } from '~/trpc/react'

import CardPricing from '../pricing/card-pricing'
import TogglePricing from '../pricing/toggle-pricing'

export function BtnUpgradeSub() {
	const [open, setOpen] = useState(false)
	const [typeSubscription, setTypeSubscription] =
		useState<TypeSubscription>('monthly')
	const toggleSubscriptionType = () => {
		setTypeSubscription((prevType) =>
			prevType === 'yearly' ? 'monthly' : 'yearly',
		)
	}
	const plans = api.plans.getAllPlans
		.useQuery()
		.data?.filter((plan) => plan.typePlan === 'PLUS')
	if (!plans) {
		return null
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={'default'}>Upgrade Plan</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Upgrade plan</DialogTitle>
					<DialogDescription>
						Upgrade your plan to get more features and benefits.
					</DialogDescription>
				</DialogHeader>

				<div className="grid place-items-center">
					<div className="my-4 flex items-center justify-center">
						<TogglePricing
							typeSubscription={typeSubscription}
							toggleSubscriptionType={toggleSubscriptionType}
						/>
					</div>
					<div className="grid grid-cols-1 gap-4">
						{plans
							.filter((plan) => plan.typeSubscription === typeSubscription)
							.map((plan, index) => (
								<CardPricing key={index} {...plan} />
							))}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
