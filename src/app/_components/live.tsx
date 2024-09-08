'use client'
import { api } from '~/trpc/react'

interface LiveProps {
	teamId: string
}
export default function Live({ teamId }: LiveProps) {
	const { data } = api.live.getStatusStream.useQuery({
		teamId,
	})
	return (
		<div className="flex place-items-center space-x-2">
			<span className="font-semibold capitalize text-white">
				{data?.status === 'live' ? 'live' : 'offline'}
			</span>
			<div
				className={`h-3 w-3 rounded-full ${data?.status === 'live' ? 'animate-pulse bg-live' : 'bg-offline'}`}></div>
		</div>
	)
}
