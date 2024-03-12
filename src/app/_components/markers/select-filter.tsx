"use client"

import { type StatusMarker } from "@prisma/client"
import { useState } from "react"
import { Button } from "~/components/ui/button"
import { 
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue } from "~/components/ui/select"
import useFilters from "~/store/useFilters"

export default function SelectFilter() {
    const [key, setKey] = useState(+new Date())
    const status = useFilters((state) => state.filters.status)
    const setStatus = useFilters((state) => state.setStatus)
    
    return (
        <Select key={key} defaultValue={status} onValueChange={(status : StatusMarker) => setStatus(status)}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="RECORDING">Recording</SelectItem>
                    <SelectItem value="UNRECORDED">Unrecorded</SelectItem>
                    <SelectItem value="RECORDED">Recorded</SelectItem>
                </SelectGroup>
                <Button
                    className="w-full"
                    variant="danger"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation()
                        setStatus(undefined)
                        setKey(+new Date())
                    }}
                >
                    Clear status
                </Button>
            </SelectContent>
        </Select>
    )
}