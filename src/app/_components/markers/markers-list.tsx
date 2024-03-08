"use client"
import { useEffect, useState } from "react"
import { api } from "~/trpc/react"
import MarkerCard from "./marker-card"
import { type Marker } from "@prisma/client"
import useFilters from "~/store/useFilters"


export default function Markerlist() {
    const [markers, setMarkers] = useState<Marker[]>([])
    const [status, setStatus] = useState(undefined)
    const selectedDate = useFilters((state) => state.filters.selectDayStream)


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
    }, [data, selectedDate])

    return (
        <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-3 md:my-6 md:gap-6 lg:grid-cols-4">
            {markers.map((marker, index) => (
                <MarkerCard key={index} marker={marker} />
            ))}
        </div>
    )
}