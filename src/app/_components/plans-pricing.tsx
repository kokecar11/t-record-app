'use client'

import { useState } from "react"
import CardPricing from "../_components/card-pricing"
import {type PlanAdapter } from "~/adapters"
import { type TypeSubscription } from "@prisma/client"
import TogglePricing from "./toggle-pricing"

interface PlansPricingProps {
    plans: PlanAdapter[];
}
export default function PlansPricing({ plans }:PlansPricingProps) {

    const [typeSubscription, setTypeSubscription] = useState<TypeSubscription>('monthly')
    const toggleSubscriptionType = () => {
        setTypeSubscription(prevType => prevType === 'yearly' ? 'monthly' : 'yearly')
    }

    return (
    <div>
        <div className="flex items-center justify-center my-4">
            <TogglePricing typeSubscription={typeSubscription} toggleSubscriptionType={toggleSubscriptionType} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            {
                plans.filter((plan) => plan.typeSubscription === typeSubscription).map((plan, index) => (
                <CardPricing key={index} {...plan} />
                ))
            }
        </div>
    </div>
    );
}
