'use client'

import { useState } from "react"
import { Label } from "~/components/ui/label"
import { Switch } from "~/components/ui/switch"

interface TogglePricingProps {
    typeSubscription: string;
    toggleSubscriptionType: () => void;
}

export default function TogglePricing({ typeSubscription, toggleSubscriptionType }:TogglePricingProps) {

    return(
        <div className="flex items-center space-x-2">
            <Label htmlFor="switch-pricing" className={`cursor-pointer text-lg ${typeSubscription === 'monthly' ? 'underline' : 'no-underline'}` }>Monthly</Label>
            <Switch id="switch-pricing" onClick={toggleSubscriptionType} />
            <Label htmlFor="switch-pricing" className={`cursor-pointer text-lg ${typeSubscription === 'yearly' ? 'underline' : 'no-underline'}` }>Yearly</Label>
        </div>
    )
}