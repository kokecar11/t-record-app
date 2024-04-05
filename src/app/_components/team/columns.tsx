'use client'

import Link from 'next/link'
import { Badge } from '~/components/ui/badge'
import { type Members, type Team } from '~/adapters/team.adapter'
import { type ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

export const columnsMembers: ColumnDef<Members>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => {
			const userImage = row.original.image!
			const initalName: string = row.getValue('name')
			const name: string = row.getValue('name')

			return (
				<div className="flex items-center">
					<Avatar className="mr-2 cursor-pointer">
						<AvatarImage src={userImage} alt="profile-image" />
						<AvatarFallback>
							{initalName
								.split(' ')
								.map((n: string) => n[0])
								.join('')}
						</AvatarFallback>
					</Avatar>
					<span className="text-sm font-semibold text-white">{name}</span>
				</div>
			)
		},
	},
	{
		accessorKey: 'status',
		header: 'Role',
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const status_value = row.getValue('status')
			if (typeof status_value !== 'string') {
				return null
			}
			const status: Record<string, 'success' | 'warning' | 'danger'> = {
				accepted: 'success',
				pending: 'warning',
				rejected: 'danger',
			}
			return (
				<Badge className="capitalize" variant={status[status_value]}>
					{status_value}
				</Badge>
			)
		},
	},
]

export const columnsTeams: ColumnDef<Team>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => {
			const name: string = row.getValue('name')
			const id: string = row.original.id
			return (
				<Link href={`/team/${id}`} className="font-semibold capitalize">
					{name}
				</Link>
			)
		},
	},
]

// export const columnsInvitations: ColumnDef<{}>[] = [
// 	{
// 		accessorKey: 'inviteer',
// 		header: 'Inviteer',
// 		cell: ({ row }) => {
// 			const userImage = row.original.image!
// 			const initalName: string = row.getValue('name')
// 			const name: string = row.getValue('name')
// 			return (
// 				<div className="flex items-center">
// 					<Avatar className="mr-2 cursor-pointer">
// 						<AvatarImage src={userImage} alt="profile-image" />
// 						<AvatarFallback>
// 							{initalName
// 								.split(' ')
// 								.map((n: string) => n[0])
// 								.join('')}
// 						</AvatarFallback>
// 					</Avatar>
// 					<span className="text-sm font-semibold text-white">{name}</span>
// 				</div>
// 			)
// 		},
// 	},
// ]
