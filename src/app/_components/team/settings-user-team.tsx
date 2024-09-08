'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '~/components/ui/button'
import {
	Form,
	FormControl,
	FormDescription,
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

import { AlertTriangle, Settings2 } from 'lucide-react'
import { useToast } from '~/components/ui/use-toast'
import { Switch } from '~/components/ui/switch'
import { Separator } from '~/components/ui/separator'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select'
import type { Permission, Role } from '@prisma/client'
import { api } from '~/trpc/react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'

const formSchema = z.object({
	team_marker_view: z.boolean(),
	team_marker_create: z.boolean(),
	team_marker_edit: z.boolean(),
	team_marker_delete: z.boolean(),
	team_edit: z.boolean(),
	team_delete: z.boolean(),
	team_user_invite: z.boolean(),
	team_user_remove: z.boolean(),
	team_user_edit: z.boolean(),
	role: z.enum(['OWNER', 'MEMBER', 'EDITOR', 'MODERATOR']),
})

const defaultRolesWithPermissions: Record<Role, Permission[]> = {
	OWNER: [],
	MEMBER: ['TEAM_MARKER_VIEW'],
	EDITOR: [
		'TEAM_USER_INVITE',
		'TEAM_MARKER_CREATE',
		'TEAM_MARKER_DELETE',
		'TEAM_MARKER_EDIT',
		'TEAM_MARKER_VIEW',
	],
	MODERATOR: ['TEAM_USER_INVITE', 'TEAM_MARKER_VIEW'],
}

interface SettingsUserTeamProps {
	permissions: Permission[]
	role: Role
	userId: string
}

export function SettingsUserTeam({
	userId,
	permissions,
	role,
}: SettingsUserTeamProps) {
	const params = useParams()
	const { data: session } = useSession()
	const { toast } = useToast()
	const [open, setOpen] = useState(false)
	const [userPermissionAndRole, setUserPermissionAndRole] = useState<{
		role: Role
		permissions: Permission[]
	}>({ role: 'MEMBER', permissions: ['TEAM_MARKER_VIEW'] })

	const queryClient = useQueryClient()
	const { data: userPermissionsAndRoleData } =
		api.team.userPermissionsAndRole.useQuery({ teamId: params.id as string })

	useEffect(() => {
		if (userPermissionsAndRoleData) {
			setUserPermissionAndRole(userPermissionsAndRoleData)
		}
	}, [userPermissionsAndRoleData])

	const { mutate } = api.team.updateUserPermissionsAndRole.useMutation({
		onSuccess: async () => {
			await queryClient.invalidateQueries()
		},
	})
	const roles: Role[] = ['OWNER', 'MEMBER', 'EDITOR', 'MODERATOR']
	const allPermissions: Permission[] = [
		'TEAM_EDIT',
		'TEAM_DELETE',
		'TEAM_USER_INVITE',
		'TEAM_USER_REMOVE',
		'TEAM_USER_EDIT',
		'TEAM_MARKER_CREATE',
		'TEAM_MARKER_DELETE',
		'TEAM_MARKER_EDIT',
		'TEAM_MARKER_VIEW',
	]
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			team_marker_delete: permissions.includes('TEAM_MARKER_DELETE') ?? false,
			team_marker_edit: permissions.includes('TEAM_MARKER_EDIT') ?? false,
			team_marker_create: permissions.includes('TEAM_MARKER_CREATE') ?? false,
			team_marker_view: permissions.includes('TEAM_MARKER_VIEW') ?? false,
			team_edit: permissions.includes('TEAM_EDIT') ?? false,
			team_delete: permissions.includes('TEAM_DELETE') ?? false,
			team_user_invite: permissions.includes('TEAM_USER_INVITE') ?? false,
			team_user_remove: permissions.includes('TEAM_USER_REMOVE') ?? false,
			team_user_edit: permissions.includes('TEAM_USER_EDIT') ?? false,
			role: role,
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		mutate({
			teamId: params.id as string,
			userId: userId,
			role: values.role,
			permissions: allPermissions.filter(
				(permission) => values[permission.toLowerCase() as keyof typeof values],
			),
		})
		toast({
			title: 'User team settings',
			description: 'Your settings have been saved',
			variant: 'default',
		})

		setOpen(false)
	}
	const isFieldDisabled = () => {
		if (
			userPermissionAndRole.role !== 'OWNER' &&
			!userPermissionAndRole.permissions.includes('TEAM_USER_EDIT')
		)
			return true
		if (role === 'OWNER') return true

		return false
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={'default'} size={'icon'}>
					<Settings2 className=" h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-3xl">
				<DialogHeader>
					<DialogTitle>User team settings</DialogTitle>
					<DialogDescription>
						Configure the permissions of the user in the team & markers
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="w-full space-y-4">
						<div className="grid gap-1">
							<div className="text-md font-semibold">Team configuration</div>
							<p className="text-sm text-muted-foreground">
								Configure the permissions of the user in the team
							</p>
							<Separator className="" />
						</div>
						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Role</FormLabel>
									<Select
										disabled={isFieldDisabled()}
										onValueChange={(value: Role) => {
											allPermissions.map((permission: Permission) => {
												form.setValue(
													permission.toLowerCase() as keyof z.infer<
														typeof formSchema
													>,
													false,
												)
											})
											defaultRolesWithPermissions[value].map(
												(permission: Permission) => {
													form.setValue(
														permission.toLowerCase() as keyof z.infer<
															typeof formSchema
														>,
														true,
													)
												},
											)
											field.onChange(value)
										}}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select role" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{roles
												.filter((v) => v !== 'OWNER')
												.map((r) => (
													<SelectItem key={r} value={r}>
														{r}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
									<FormDescription>
										Users with OWNER access can manage team settings
										<br />
										<br />
										{form.getValues('role') === 'EDITOR' && (
											<Alert variant={'warning'}>
												<AlertTriangle className="h-4 w-4" />
												<AlertTitle>
													Action Required: Editor Role Configuration on Twitch
												</AlertTitle>
												<AlertDescription>
													To ensure you have the correct permissions, please
													configure your Editor role on Twitch. Simply go to the
													role settings and make the necessary changes.{' '}
													<Link
														target="_blank"
														className="text-yellow-500 underline"
														href={`https://dashboard.twitch.tv/u/${session?.user.name}/community/roles`}>
														Go to change role.
													</Link>
												</AlertDescription>
											</Alert>
										)}
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="team_user_invite"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
										<div className="space-y-0.5">
											<FormLabel>Invite users to the team</FormLabel>
											<FormDescription>
												Users with invite access can invite other users to the
												team
											</FormDescription>
										</div>
										<FormControl>
											<Switch
												disabled={isFieldDisabled()}
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="team_user_edit"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
										<div className="space-y-0.5">
											<FormLabel>Modify user permissions and role</FormLabel>
											<FormDescription>
												Users with modify user access can modify user
												permissions and role
											</FormDescription>
										</div>
										<FormControl>
											<Switch
												disabled={isFieldDisabled()}
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="team_user_remove"
								render={({ field }) => (
									<FormItem className="col-span-2 flex flex-row items-center justify-between rounded-lg border p-4">
										<div className="space-y-0.5">
											<FormLabel>Remove users from the team</FormLabel>
											<FormDescription>
												Users with remove access can remove users from the team
											</FormDescription>
										</div>
										<FormControl>
											<Switch
												disabled={isFieldDisabled()}
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-1">
							<div className="text-md font-semibold">Markers configuration</div>
							<p className="text-sm text-muted-foreground">
								Configure the permissions of the user in the markers
							</p>
							<Separator className="" />
						</div>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="team_marker_view"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
										<div className="space-y-0.5">
											<FormLabel>Read Marker</FormLabel>
											<FormDescription>
												Users with read marker access can view markers
											</FormDescription>
										</div>
										<FormControl>
											<Switch
												disabled={isFieldDisabled()}
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="team_marker_create"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
										<div className="space-y-0.5">
											<FormLabel>Create Marker</FormLabel>
											<FormDescription>
												Users with create marker access can create new markers
											</FormDescription>
										</div>
										<FormControl>
											<Switch
												disabled={isFieldDisabled()}
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="team_marker_edit"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
										<div className="space-y-0.5">
											<FormLabel>Modify Marker</FormLabel>
											<FormDescription>
												Users with modify marker access can modify markers
											</FormDescription>
										</div>
										<FormControl>
											<Switch
												disabled={isFieldDisabled()}
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="team_marker_delete"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
										<div className="space-y-0.5">
											<FormLabel>Delete marker</FormLabel>
											<FormDescription>
												Users with delete marker access can delete markers
											</FormDescription>
										</div>
										<FormControl>
											<Switch
												disabled={isFieldDisabled()}
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						{/* <FormField
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
														? users.find(
																(language) => language.id === field.value,
															)?.name
														: 'Select user to invite'}
													<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-full p-0">
											<Command>
												<CommandInput placeholder="Search user to invite..." />
												<CommandEmpty>Not user found.</CommandEmpty>
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
															<span className="font-semibold">{user.name}</span>
														</CommandItem>
													))}
												</CommandGroup>
											</Command>
										</PopoverContent>
									</Popover>

									<FormMessage />
								</FormItem>
							)}
						/> */}

						<div className="flex gap-4">
							<DialogClose asChild>
								<Button className="w-full" variant={'outline'} type="button">
									Cancel
								</Button>
							</DialogClose>
							<Button
								disabled={role === 'OWNER'}
								className="w-full"
								variant={'default'}
								type="submit">
								Save
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
