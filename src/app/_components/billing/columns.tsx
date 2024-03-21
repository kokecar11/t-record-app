'use client'

import { format } from 'date-fns'
import { Badge } from '~/components/ui/badge'
import { type ColumnDef } from '@tanstack/react-table'
import { type Billing } from '~/adapters/subscription.adapter'

export const columns: ColumnDef<Billing>[] = [
	{
		accessorKey: 'date',
		header: 'Date',
		cell: ({ row }) => {
			const date = format(new Date(row.getValue('date')), 'd LLL, yyyy')
			return <div>{date}</div>
		},
	},
	{
		accessorKey: 'billingReason',
		header: 'Billing reason',
	},
	{
		accessorKey: 'status_formatted',
		header: 'Status',
		cell: ({ row }) => {
			const status = row.getValue('status')
			const status_formatted = row.getValue('status_formatted')
			return (
				<Badge variant={status === 'paid' ? 'success' : 'danger'}>
					{status_formatted as string}
				</Badge>
			)
		},
	},
	{
		accessorKey: 'currency',
		header: 'Currency',
	},
	{
		accessorKey: 'amount',
		header: 'Amount',
	},
]
