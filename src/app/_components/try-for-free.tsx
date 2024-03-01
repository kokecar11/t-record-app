'use client'

import { signIn } from "next-auth/react"
import { Button } from "~/components/ui/button"

export default function TryForFreeButton() {    
    return (
        <Button onClick={async () => {
            await signIn('twitch', {callbackUrl: '/dashboard'})
        }} variant={'live'} size={'lg'} className="text-base">Try T-Record for free</Button>
    )
}