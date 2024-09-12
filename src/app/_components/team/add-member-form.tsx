'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '~/trpc/react'

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
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/dialog'
import { Check, ChevronsUpDown, UserPlus } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '~/components/ui/use-toast'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '~/components/ui/popover'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandSeparator,
} from '~/components/ui/command'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { CommandList } from 'cmdk'
import { cn } from '~/lib/utils'

const formSchema = z.object({
	inviteeId: z.string({
		required_error: 'Please select a User.',
	}),
})

export function AddMemberForm() {
	const { toast } = useToast()
	const [open, setOpen] = useState(false)
	const [users, setUsers] = useState<
		{ id: string; name: string | undefined; image: string | undefined }[]
	>([])
	const queryClient = useQueryClient()
	const { data: membersTwitchData } = api.team.membersTwitch.useQuery()

	const { data } = api.user.getAllUsersTeams.useQuery()

	useEffect(() => {
		if (data) {
			const updatedData = data.map((user) => ({
				...user,
				name: user.name ?? undefined,
				image: user.image ?? undefined,
			}))
			setUsers(updatedData)
		}
	}, [data, membersTwitchData])

	const { mutate } = api.team.sendInvitation.useMutation({
		onSuccess: async () => {
			await queryClient.invalidateQueries()
		},
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			inviteeId: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		mutate(
			{ inviteeId: values.inviteeId },
			{
				onSuccess: () => {
					toast({
						title: 'Invitation sent',
						description: 'The invitation has been sent successfully.',
						variant: 'default',
					})
				},
			},
		)
		form.reset()
		setOpen(false)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={'default'}>
					<UserPlus className="mr-2 h-4 w-4" />
					Add Member
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Member</DialogTitle>
					<DialogDescription>
						Enter the name of the user you want to invite to your team.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="inviteeId"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Users</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													role="combobox"
													type="button"
													className={cn(
														'w-full',
														!field.value && 'text-muted-foreground',
													)}>
													{field.value
														? users.find((u) => u.id === field.value)?.name
														: 'Select user to invite'}
													<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-full p-0">
											<Command>
												<CommandInput placeholder="Search user to invite..." />
												<CommandList>
													<CommandEmpty>User not found.</CommandEmpty>
													<CommandGroup>
														{users.map((user) => (
															<CommandItem
																value={user.name}
																key={user.id}
																onSelect={() => {
																	form.setValue('inviteeId', user.id)
																}}>
																<Check
																	className={cn(
																		'mr-2 h-4 w-4',
																		user.id === field.value
																			? 'opacity-100'
																			: 'opacity-0',
																	)}
																/>
																<Avatar className="mr-2 h-8 w-8 cursor-pointer">
																	<AvatarImage
																		src={user.image}
																		alt="profile-image"
																	/>
																	<AvatarFallback>
																		{user.name
																			?.split(' ')
																			.map((n: string) => n[0])
																			.join('')}
																	</AvatarFallback>
																</Avatar>
																<span className="font-semibold">
																	{user.name}
																</span>
															</CommandItem>
														))}
													</CommandGroup>
													<CommandSeparator />
												</CommandList>
											</Command>
										</PopoverContent>
									</Popover>
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
								Send
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
