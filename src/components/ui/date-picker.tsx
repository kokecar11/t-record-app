'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { Calendar, type MarkerDate } from '~/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '~/components/ui/popover'
import useFilters from '~/store/useFilters'
import { api } from '~/trpc/react'

export function DatePickerDemo() {
	const date = useFilters((state) => state.filters.selectDayStream)
	const { data } = api.marker.getAllMarkersCalendar.useQuery()
	const [markers, setMarkers] = React.useState<MarkerDate[]>([])

	React.useEffect(() => {
		if (data) {
			setMarkers(data)
		}
	}, [data])

	const setDate = useFilters((state) => state.setDate)

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn(
						'justify-start text-left font-normal',
						!date && 'text-muted-foreground',
					)}>
					<CalendarIcon className="mr-2 h-4 w-4 text-white" />
					{date ? (
						format(date, 'PP')
					) : (
						<span className="text-white">Today</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					markersToday={markers}
					input={false}
					mode="single"
					selected={date}
					onSelect={(newDate) => setDate(newDate)}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	)
}
