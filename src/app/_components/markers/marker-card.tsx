"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useQueryClient } from "@tanstack/react-query"
import { api } from "~/trpc/react"

import { capitalizeFirstLetter, validateMarker } from "~/lib/utils"
import { FeLinkExternal } from "~/components/icons"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"

import { type Marker } from "@prisma/client"
import { type StatusLive } from "~/server/api/routers/live"
import { toast } from "~/components/ui/use-toast"

//TODO:Cambiar la interfaz de Live a un archivo separado
export interface Live {
    status: StatusLive;
    isLoading?: boolean;
    vod?: string;
    gameId?: string;
}

export interface MarkerProps {
    marker: Marker,
    onMarkerUpdate: (marker: Marker) => void
    live: Live,
}


export default function MarkerCard({ marker, onMarkerUpdate, live }:MarkerProps){
    const { data: session } = useSession()
    
    const [btnMarker, setBtnMarker] = useState({
        title: "Start record",
        isInit: true
    })
    const mutationUpdateMarker = api.marker.setMarkerInStream.useMutation({
        onSuccess: async () => {
            await queryClient.invalidateQueries()
        },
    })

    const mutationUpdateMarkerVOD = api.marker.setVODInMarker.useMutation({
        onSuccess: async () => {
            await queryClient.invalidateQueries()
        },
    })

    const queryClient = useQueryClient();
    const toTimeString = (totalSeconds:number) => {
        const totalMs = totalSeconds * 1000
        return new Date(totalMs).toISOString().slice(11, 19)
    }    

    const formatSecondsToTime = (seconds:number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const remainingSeconds = seconds % 60
        return `${hours}h${minutes}m${remainingSeconds}s`
    }
    

    const linkToHighlightTwitch = (VOD:string, time:number) => {
        if (session?.user){
            return `https://dashboard.twitch.tv/u/${session.user.name?.toLowerCase()}/content/video-producer/highlighter/${VOD}?t=${formatSecondsToTime(time)}`
        }
        return ''
    }

    const handlerRecord = async () => {
        try {
            const { updatedMarkerResult, title, message } = await mutationUpdateMarker.mutateAsync({
                marker: {
                    id: marker.id,
                    title: marker.title
                },
                isStartMarker: btnMarker.isInit
            })

            if (updatedMarkerResult) {
                const { updatedMarkerResultVOD } = await mutationUpdateMarkerVOD.mutateAsync({
                    marker: {
                        id: marker.id
                    },
                    isStartMarker: btnMarker.isInit
                })
            
                if (updatedMarkerResult.status === 'RECORDING') {
                    setBtnMarker({ title: "Stop record", isInit: false });
                }

                showToast(title, message)
                if(updatedMarkerResultVOD)
                onMarkerUpdate(updatedMarkerResultVOD)
            } else {
                showToast(title, message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const showToast = (title: string, message:string | undefined) => {
        toast({
            title,
            description: message,
            variant: "default",
        })
    }

    const status: Record<string, 'success' | 'warning' | 'danger'> = {
        RECORDED: 'success',
        RECORDING: 'warning',
        UNRECORDED: 'danger'
    }
    return (
        <div className={`max-w-2xl bg-primary-old border shadow-lg rounded-lg overflow-hidden`}>
            <div className="p-4 relative">
                <div className="flex mb-2">
                        <div className="flex-1 space-x-2">
                            <Badge variant={status[marker.status]}>{capitalizeFirstLetter(marker.status.toLowerCase())}</Badge> 
                        </div>
                    </div>
                    <h2 className="text-white capitalize font-bold text-lg overflow-hidden text-overflow-ellipsis whitespace-nowrap" title={marker.title}>{marker.title}</h2>
                    
                    <div className="my-2 text-sm text-white text-opacity-90">
                        <div className="mt-4">
                            {marker.videoIdStreamStart && session?.user.plan === 'PLUS' ? 
                            (<Link target='_blank' href={linkToHighlightTwitch(marker.videoIdStreamStart, marker.starts_at!)} className="flex text-sm text-white text-opacity-70 hover:text-white">
                                <FeLinkExternal className='mr-1 text-lg'/> {`Starts at ${toTimeString(marker.starts_at!)}`}
                            </Link> ): 
                            (<span className="flex text-sm text-white text-opacity-70">{`Starts at ${toTimeString(marker.starts_at!)}`}</span>)}
                        </div>

                        <div className="mt-4">
                            {marker.videoIdStreamEnd && session?.user.plan === 'PLUS' ? 
                                (<Link target='_blank' href={linkToHighlightTwitch(marker.videoIdStreamEnd, marker.ends_at!)} className="flex text-sm text-white text-opacity-70 hover:text-white">
                                    <FeLinkExternal className='mr-1 text-lg'/>{`Ends at ${toTimeString(marker.ends_at!)}`}
                                </Link>):
                                (<span className="flex text-sm text-white text-opacity-70">{`Ends at ${toTimeString(marker.ends_at!)}`}</span>)}
                        </div>                            
                    </div>
                    <div className="flex place-content-center">
                        <Button 
                            variant='default' 
                            size='sm' 
                            className='w-full' 
                            onClick={handlerRecord}
                            disabled={validateMarker(marker.status, live, marker.stream_date, btnMarker.isInit)}
                        >
                            {btnMarker.title}
                        </Button>
                    </div>
            </div>
        </div>
    )
}