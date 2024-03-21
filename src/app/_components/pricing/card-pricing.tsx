'use client'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { type PlanAdapter } from '~/adapters'
import { FeCheckCircle, FeGift, FeStar } from '~/components/icons'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { capitalizeFirstLetter } from '~/lib/utils'

export type TypeSubscription = 'yearly' | 'monthly'

export type CardPricingProps = PlanAdapter

export default function CardPricing({
	popular,
	title,
	link,
	typeSubscription,
	price,
	features,
	typePlan,
}: CardPricingProps) {
	const { data: session } = useSession()
	const router = useRouter()

	return (
		<div
			className={`w-full max-w-sm rounded-lg border border-secondary-old p-0.5 sm:min-w-[20rem] 
            ${!popular ? 'border-opacity-30 bg-[#15162c]' : 'border-opacity-100 bg-secondary-old shadow-2xl shadow-secondary-old'}`}>
			{popular && (
				<p className="flex items-center justify-center bg-secondary-old py-2 text-center font-semibold text-white">
					<FeStar className="mr-1 text-lg" /> Most Popular
				</p>
			)}

			<div
				className={`flex flex-col rounded-lg  bg-[#15162c] p-4 ${!popular && 'h-full'}`}>
				<span className="mb-4 flex text-xl font-medium text-white">
					{title}{' '}
					{typeSubscription === 'yearly' && popular && (
						<Badge className="ml-2" variant="secondary-old">
							<FeGift className="mr-1 text-lg" />2 months free
						</Badge>
					)}{' '}
				</span>
				<hr className="mb-8 border-white opacity-10"></hr>
				<div className="flex items-baseline text-white">
					<span className="text-5xl font-extrabold tracking-tight">
						${price}
					</span>
					<span className="ml-1 text-gray-200">
						/ {capitalizeFirstLetter(typeSubscription.toLowerCase())}
					</span>
				</div>
				<hr className="mt-8 border-white opacity-10"></hr>
				<ul role="list" className="my-7 space-y-5">
					{features?.map((feature) => (
						<li key={feature} className="flex items-center space-x-3 text-base">
							<FeCheckCircle className="text-secondary-old" />
							<span className="font-normal leading-tight text-white">
								{feature}
							</span>
						</li>
					))}
				</ul>
				<div className="mt-auto flex flex-col">
					{typePlan === 'STARTER' ? (
						<Button
							variant={'secondary-old'}
							id={`${capitalizeFirstLetter(typePlan.toLowerCase())}-${capitalizeFirstLetter(typePlan.toString())}`}
							onClick={async () => {
								if (session) {
									router.push('/billing')
								} else {
									await signIn('twitch', { callbackUrl: '/pricing' })
								}
							}}>
							Get started
						</Button>
					) : (
						<Button
							variant={'secondary-old'}
							id={`${capitalizeFirstLetter(typePlan.toLowerCase())}-${capitalizeFirstLetter(typePlan.toLowerCase())}`}
							onClick={async () => {
								if (session) {
									if (session.user.plan !== 'STARTER') {
										router.push('/dashboard')
									} else {
										router.push(`${link}${session.user.email}`)
									}
								} else {
									await signIn('twitch', { callbackUrl: '/pricing' })
								}
							}}>
							Get started
						</Button>
					)}
				</div>
			</div>
		</div>
	)
}
