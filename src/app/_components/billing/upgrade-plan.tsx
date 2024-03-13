'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, startOfToday } from 'date-fns'
import { cn } from '~/lib/utils'

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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '~/components/ui/popover'
import { Calendar } from '~/components/ui/calendar'
import { CalendarIcon, Plus } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '~/components/ui/use-toast'

const formSchema = z.object({
	title: z.string().min(2, {
		message: 'Title must be at least 2 characters.',
	}),
	stream_date: z.date({
		required_error: 'A date of stream date is required.',
	}),
})

export function UpgradePlan() {
	const { toast } = useToast()
	const [open, setOpen] = useState(false)
	const queryClient = useQueryClient()
	const { mutate } = api.marker.create.useMutation({
		onSuccess: async () => {
			await queryClient.invalidateQueries()
		},
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			stream_date: startOfToday(),
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		mutate({ title: values.title, stream_date: values.stream_date })
		toast({
			title: 'Marker created',
			description: 'Your marker has been created successfully.',
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
					Create Marker
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>New Marker</DialogTitle>
					<DialogDescription>
						Create a new marker to help you organize your content.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder="Title of marker" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="stream_date"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Stream date</FormLabel>
									<FormControl>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={'outline'}
														className={cn(
															'w-full pl-3 text-left font-normal',
															!field.value && 'text-muted-foreground',
														)}>
														{field.value ? (
															format(field.value, 'PPP')
														) : (
															<span>Pick a date</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													input
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													initialFocus
													disabled={(date) => date < new Date()}
												/>
											</PopoverContent>
										</Popover>
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
