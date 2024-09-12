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

import { Send } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '~/components/ui/use-toast'

const formSchema = z.object({
	email: z.string().email({
		message: 'Please enter a valid email address.',
	}),
})

export function SendEmailInvitationForm() {
	const { toast } = useToast()
	const [open, setOpen] = useState(false)
	const queryClient = useQueryClient()
	const { mutate } = api.team.sendEmailInvitation.useMutation({
		onSuccess: async () => {
			await queryClient.invalidateQueries()
		},
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log('values', values)
		mutate(
			{ email: values.email },
			{
				onSuccess: () => {
					toast({
						title: 'Invitation sent',
						description: 'The invitation has been sent successfully.',
						variant: 'default',
					})
				},
				onError: (error) => {
					toast({
						title: 'Error sending invitation',
						description: error.message,
						variant: 'destructive',
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
				<Button className="cursor-pointer">
					<Send className="mr-2 h-4 w-4" />
					Send Email Invitation
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Send Email Invitation</DialogTitle>
					<DialogDescription>
						Enter the email of your new member.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="Email" {...field} />
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
								Send
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
