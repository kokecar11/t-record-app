import {
	Html,
	Button,
	Head,
	Preview,
	Container,
	Body,
	Text,
	Link,
	Tailwind,
} from '@react-email/components'

import { FeGithub, FeHeart, FeInstagram, FeTwitter } from '~/components/icons'

interface EmailInviteJoinProps {
	userTRecord: string | undefined | null
	userInvitee: string
	url: string
}
export function EmailInviteJoin({
	userTRecord,
	userInvitee,
	url,
}: EmailInviteJoinProps) {
	return (
		<Html>
			<Head />
			<Preview>Te han invitado a unirte a T-record</Preview>
			<Tailwind
				config={{
					theme: {
						extend: {
							colors: {
								brand: '#007291',
							},
						},
					},
				}}>
				<Body
					style={{
						fontFamily: 'Arial, sans-serif',
						backgroundColor: '#f4f4f4',
						padding: '20px',
					}}>
					<Container
						style={{
							maxWidth: '650px',
							margin: '0 auto',
							backgroundColor: '#ffffff',
							padding: '20px',
							borderRadius: '8px',
							boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
						}}>
						<Text
							style={{
								fontSize: '18px',
								fontWeight: 'bold',
								marginBottom: '20px',
							}}>
							Hi {userInvitee},
						</Text>
						<Text
							style={{
								fontSize: '16px',
								lineHeight: '1.5',
								marginBottom: '20px',
							}}>
							We hope you&apos;re doing well! We&apos;re excited to inform you
							that you&apos;ve <span className="font-bold">{userTRecord}</span>{' '}
							invited to join T-Record.app, a platform designed to help you
							manage your streams efficiently.
						</Text>
						<Text style={{ textAlign: 'center' }}>
							<Button
								href={url}
								style={{
									cursor: 'pointer',
									backgroundColor: '#7c3aed',
									color: '#ffffff',
									padding: '10px 20px',
									borderRadius: '5px',
									textDecoration: 'none',
									display: 'inline-block',
									fontSize: '16px',
								}}>
								Join T-Record
							</Button>
						</Text>
						<Text
							style={{
								fontSize: '16px',
								lineHeight: '1.5',
								marginBottom: '20px',
							}}>
							If you have any questions or need help getting started, feel free
							to reach out to us. <br /> <br /> We look forward to seeing you on
							T-Record.app soon!
						</Text>
						<Text
							style={{
								fontSize: '16px',
								lineHeight: '1.5',
								marginTop: '20px',
							}}>
							Best regards,
							<br />
							Koke.
						</Text>
					</Container>

					<Container
						style={{
							maxWidth: '650px',
							margin: '20px auto 0',
							textAlign: 'center',
							backgroundColor: '#15162c',
							borderRadius: '8px',
							boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
						}}>
						<Text className="!mb-0 !mt-2 p-0 text-white">
							Made with <FeHeart className="mx-1 text-xl text-rose-600" /> by{' '}
							<Link
								href="https://twitter.com/Kokecar11"
								className="font-bold text-white underline">
								Koke
							</Link>
						</Text>
						<Link href="https://www.instagram.com/koke_car11/" target="_blank">
							<FeInstagram className="mr-2 text-2xl" color="#fffb" />
						</Link>
						<Link href="https://twitter.com/Kokecar11" target="_blank">
							<FeTwitter className="mr-2 text-2xl" color="#fffb" />
						</Link>
						<Link href="https://github.com/kokecar11" target="_blank">
							<FeGithub className="text-2xl" color="#fffb" />
						</Link>
						<Text
							className="text-gray-300"
							style={{
								marginBottom: '0',
								marginTop: '0',
								fontSize: '10px',
							}}>
							© 2024 T-Record, All Rights Reserved
						</Text>
						<Text
							className="text-gray-300"
							style={{ marginTop: '0', fontSize: '10px' }}>
							Bogotá, Colombia
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}
export default EmailInviteJoin
