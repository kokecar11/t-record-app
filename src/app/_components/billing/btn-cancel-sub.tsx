'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Button } from '~/components/ui/button'
import { toast } from '~/components/ui/use-toast'
import { api } from '~/trpc/react'

export default function BtnCancelSubscription() {
	const queryClient = useQueryClient()
	const { mutate, data } =
		api.subscriptions.cancelSubscriptionLemonSqueezy.useMutation({
			onSuccess: async () => {
				await queryClient.invalidateQueries()
			},
		})
	const handlerCancelSubscription = async () => {
		mutate()
		toast({
			title: 'Subscription Canceled',
			description: data?.message,
		})
	}

	return (
		<Button
			onClick={handlerCancelSubscription}
			variant={'secondary'}
			className="">
			Cancel Plan
		</Button>
	)
}
