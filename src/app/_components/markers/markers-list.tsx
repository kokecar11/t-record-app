'use client'
import { useEffect, useState } from 'react'
import { api } from '~/trpc/react'
import MarkerCard from './marker-card'
import { CreateMarkerForm } from './create-marker-form'
import useFilters from '~/store/useFilters'
import { Loader } from '~/components/ui/loader'

import type { Marker, Permission, Role } from '@prisma/client'
import type { Live } from '~/models'

interface MarkerListProps {
	teamId?: string
}

export default function Markerlist({ teamId }: MarkerListProps) {
	const [markers, setMarkers] = useState<Marker[]>([])
	const [live, setLive] = useState<Live>({ status: 'offline' })
	const [userPermissionRole, setUserPermissionRole] = useState<{
		role: Role
		permissions: Permission[]
	}>({ role: 'MEMBER', permissions: ['TEAM_MARKER_VIEW'] })

	const status = useFilters((state) => state.filters.status)
	const selectedDate = useFilters((state) => state.filters.selectDayStream)
	const { data: liveApi } = api.live.getStatusStream.useQuery({
		teamId: teamId ?? '',
	})

	const { data } = api.marker.getMarkers.useQuery({
		filters: {
			status,
			selectDayStream: selectedDate,
		},
		idTeam: teamId ?? '',
	})

	const { data: userPermissionData } = api.team.userPermissionsAndRole.useQuery(
		{
			teamId: teamId ?? '',
		},
	)

	useEffect(() => {
		if (data) {
			setMarkers(data)
		}
		if (liveApi) {
			setLive(liveApi)
		}
		if (userPermissionData) {
			setUserPermissionRole(userPermissionData)
		}
	}, [data, selectedDate, liveApi, userPermissionData, teamId])

	const updateMarker = (updatedMarker: Marker) => {
		setMarkers((prevMarkers) =>
			prevMarkers.map((marker) =>
				marker.id === updatedMarker.id ? updatedMarker : marker,
			),
		)
	}

	return (
		<>
			{data ? null : <Loader />}
			{markers.length > 0 ? (
				<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:my-6 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
					{markers.map((marker, index) => (
						<MarkerCard
							key={index}
							marker={marker}
							onMarkerUpdate={updateMarker}
							live={live}
							teamId={teamId ?? ''}
						/>
					))}
				</div>
			) : (
				<div className="mt-4 grid min-h-screen place-items-center">
					<div className="mb-24 max-w-lg rounded-lg bg-background px-10 py-4 shadow-lg">
						<h1 className="my-1 text-center text-3xl font-semibold">
							No markers
						</h1>
						<p className="my-2 text-sm text-muted-foreground">
							You don&apos;t have any marker for your stream yet, create a
							marker.
						</p>
						<div className="my-2 grid">
							{teamId &&
							userPermissionRole.permissions.includes('TEAM_MARKER_CREATE') ? (
								<CreateMarkerForm teamId={teamId} />
							) : (
								<CreateMarkerForm />
							)}
						</div>
					</div>
				</div>
			)}
		</>
	)
}
