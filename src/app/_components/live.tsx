'use client'
import { api } from "~/trpc/react"

export default function Live() {
    const { data } =  api.live.getStatusStream.useQuery()
    return (
        <div className='flex place-items-center space-x-2'>
            <span className='font-semibold text-white capitalize'>{data?.status === 'live' ? 'live' : 'offline'}</span>
            <div className={`rounded-full w-3 h-3 ${data?.status === 'live' ? 'bg-live animate-pulse':'bg-offline'}`}></div>
        </div>
    )
}