'use client'
import { api } from '~/trpc/react'

export default function Live() {
	const { data } = api.live.getStatusStream.useQuery()
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
