"use client"
import { useEffect, useState } from "react"
import { api } from "~/trpc/react"
import MarkerCard from "./marker-card"
import useFilters from "~/store/useFilters"
import { Loader } from "~/components/ui/loader"

import type { Marker } from "@prisma/client"
import type { Live } from "~/models"

export default function Markerlist() {
    const [markers, setMarkers] = useState<Marker[]>([])
    const [live, setLive] = useState<Live>({status: 'offline', })
    const status = useFilters((state) => state.filters.status)
    const selectedDate = useFilters((state) => state.filters.selectDayStream)
    const { data: liveApi } =  api.live.getStatusStream.useQuery()

    const { data } = api.marker.getMarkers.useQuery({
        filters: {
            status,
            selectDayStream: selectedDate
        }
    })

    useEffect(() => {
        if (data) {
            setMarkers(data)
        }
        if(liveApi){
            setLive(liveApi)
        }
    }, [data, selectedDate, liveApi])

    const updateMarker = (updatedMarker: Marker) => {
        setMarkers(prevMarkers =>
            prevMarkers.map(marker =>
                marker.id === updatedMarker.id ? updatedMarker : marker
            )
        );
    }

    return (
        <>
            {data ? null : <Loader />}
            {
                markers.length > 0 ?
                (<div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-3 md:my-6 md:gap-6 lg:grid-cols-4">
                    {markers.map((marker, index) => (
                        <MarkerCard key={index} marker={marker} onMarkerUpdate={updateMarker} live={live} />
                    )) }
                </div>)
                :
                ( 
                <div className="grid place-items-center mt-4 h-full">
                    <h1 className="text-3xl font-bold text-white">
                        You don&apos;t have any marker for your stream yet, create a marker.
                    </h1>
                </div>
                )
            }
        </>
    )
}