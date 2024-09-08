import {
	Html,
	Button,
	Head,
	Preview,
	Container,
	Body,
} from '@react-email/components'

export default function EmailTemplate2() {
	return (
		<Html>
			<Head />
			<Preview> Lo que</Preview>
			<Body>
				<Container>
					<Button>Test</Button>
				</Container>
			</Body>
		</Html>
	)
}
