'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '~/components/ui/form'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/dialog'
import { api } from '~/trpc/react'
import { DialogClose } from '@radix-ui/react-dialog'

import { Plus } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '~/components/ui/use-toast'

const formSchema = z.object({
	name: z.string().min(2, {
		message: 'Name of team must be at least 2 characters.',
	}),
})

export function CreateTeamForm() {
	const { toast } = useToast()
	const [open, setOpen] = useState(false)
	const queryClient = useQueryClient()
	const { mutate } = api.team.create.useMutation({
		onSuccess: async () => {
			await queryClient.invalidateQueries()
		},
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		mutate({ name: values.name })
		toast({
			title: 'Team created',
			description: 'Your team has been created successfully.',
			variant: 'default',
		})
		form.reset()
		setOpen(false)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={'default'}>
					<Plus className="mr-2 h-4 w-4" />
					Create Team
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>New Team</DialogTitle>
					<DialogDescription>
						Enter the name of your new team.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name of team</FormLabel>
									<FormControl>
										<Input placeholder="Name of team" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex gap-4">
							<DialogClose asChild>
								<Button className="w-full" variant={'outline'} type="button">
									Cancel
								</Button>
							</DialogClose>
							<Button className="w-full" variant={'default'} type="submit">
								Save
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
