import Link from "next/link";
import { useSession } from "next-auth/react";
import { FeLinkExternal } from "~/components/icons";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { capitalizeFirstLetter } from "~/lib/utils";
import { type Marker } from "@prisma/client";
import { type StatusLive } from "~/server/api/routers/live";

export interface Live {
    status: StatusLive;
    isLoading?: boolean;
    vod?: string;
    gameId?: string;
}

export interface MarkerProps {
    marker: Marker,
    // live: Live,
}


export default function MarkerCard({marker}:MarkerProps){
    const {data: session} = useSession()
    
    const toTimeString = (totalSeconds:number) => {
        const totalMs = totalSeconds * 1000;
        return new Date(totalMs).toISOString().slice(11, 19)
    }    
    
    const formatSecondsToTime = (seconds:number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours}h${minutes}m${remainingSeconds}s`
    }
    

    const linkToHighlightTwitch = (VOD:string, time:number) => {
        if (session?.user){
            return `https://dashboard.twitch.tv/u/${session.user.name?.toLowerCase()}/content/video-producer/highlighter/${VOD}?t=${formatSecondsToTime(time)}`
        }
        return ''
    }
    return (
        <div className={`max-w-2xl bg-primary-old border shadow-lg rounded-lg overflow-hidden`}>
            <div className="p-4 relative">
                <div className="flex mb-2">
                        <div className="flex-1 space-x-2">
                            {/* TODO: revisar los badge para que cambien cuando el estado del marcador cambie */}
                            <Badge variant={'default'}>{capitalizeFirstLetter(marker.status.toLowerCase())}</Badge> 
                            {/* <Badge variant={'secondary-old'}>{new Date().toLocaleDateString()}</Badge> */}
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
                        <Button variant='default' size='sm' className='w-full'>Start record</Button>
                    </div>
            </div>
        </div>
    )
}