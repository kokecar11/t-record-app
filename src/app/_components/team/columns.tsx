'use client'

import Link from 'next/link'
import { Badge } from '~/components/ui/badge'
import { type Members, type Team } from '~/adapters/team.adapter'
import { type ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { SettingsUserTeam } from './settings-user-team'

export const columnsMembers: ColumnDef<Members>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => {
			const userImage = row.original.user.image!
			const name: string = row.original.user.name!

			return (
				<div className="flex items-center">
					<Avatar className="mr-2 cursor-pointer">
						<AvatarImage src={userImage} alt="profile-image" />
						<AvatarFallback>
							{name
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
		accessorKey: 'role',
		header: 'Role & Stream Role',
		cell: ({ row }) => {
			const role: string = row.getValue('role')
			const streamRole: string[] = row.original.roleStream
			return (
				<div className="flex gap-1">
					<Badge variant={'secondary'} className="capitalize">
						{role.toLocaleLowerCase()}
					</Badge>
					{streamRole.map((role: string) => (
						<Badge key={role} className="capitalize">
							{role.toLocaleLowerCase()}
						</Badge>
					))}
				</div>
			)
		},
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
	{
		accessorKey: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			return (
				<SettingsUserTeam
					userId={row.original.user.id}
					permissions={row.original.permissions}
					role={row.original.role}
				/>
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
	{
		accessorKey: 'totalMembers',
		header: 'Total Members',
	},
]
