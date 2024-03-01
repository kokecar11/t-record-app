'use client'
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type PlanAdapter } from "~/adapters";
import { FeCheckCircle, FeStar } from "~/components/icons";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { capitalizeFirstLetter } from "~/lib/utils";

export type TypeSubscription = 'yearly' | 'monthly'; 

export type CardPricingProps = PlanAdapter

export default function CardPricing({ popular, title, link, typeSubscription, price, features, typePlan }: CardPricingProps) {
    const { data:session } = useSession()
    const router = useRouter()

    return (
        <div className={`w-full sm:min-w-[20rem] max-w-sm p-0.5 border border-secondary-old rounded-lg 
            ${!popular ? 'border-opacity-30 bg-[#15162c]' : 'border-opacity-100 shadow-2xl shadow-secondary-old bg-secondary-old'}`}>

            {popular && (
                <p className="flex text-white items-center justify-center text-center bg-secondary-old py-2 font-semibold">
                    <FeStar className="text-lg mr-1" /> Most Popular
                </p>
            )}
            
            <div className={`flex flex-col p-4  rounded-lg bg-[#15162c] ${!popular && 'h-full'}`}>
                <span className="mb-4 text-xl font-medium text-white">
                    {title}{' '}
                </span>
                <hr className="mb-8 border-white opacity-10"></hr>
                <div className="flex items-baseline text-white">
                    <span className="text-5xl font-extrabold tracking-tight">${price}</span>
                    <span className="ml-1 text-gray-200">/ {capitalizeFirstLetter(typeSubscription.toLowerCase())}
                    { (typeSubscription === 'yearly' && popular) && <Badge className="ml-2" variant="secondary-old">2 months FREE</Badge>}
                    </span>
                </div>
                <hr className="mt-8 border-white opacity-10"></hr>
                <ul role="list" className="space-y-5 my-7">
                    {features?.map((feature) => (
                    <li key={feature} className="flex space-x-3 items-center text-base">

                        <FeCheckCircle className="text-secondary-old" />
                        <span className="font-normal leading-tight text-white">
                        {feature}
                        </span>
                    </li>
                    ))}
                </ul>
                <div className="flex flex-col mt-auto">
                    {typePlan === 'STARTER' ? (
                    <Button
                        variant={'secondary-old'}
                        id={`${capitalizeFirstLetter(typePlan.toLowerCase())}-${capitalizeFirstLetter(typePlan.toString())}`} 
                        onClick={async () => {
                        if (session) {
                            router.push('/billing')
                        } else {
                            await signIn('twitch', { callbackUrl: '/pricing' })
                        }
                        }}
                    >
                        Get started
                    </Button>
                    ) : (
                    <Button
                        variant={'secondary-old'}
                        id={`${capitalizeFirstLetter(typePlan.toLowerCase())}-${capitalizeFirstLetter(typePlan.toLowerCase())}`} 
                        onClick={async () => {
                        if(session){
                            console.log('session', session)
                            if(typePlan !== 'STARTER'){
                                router.push('/dashboard')
                            }else{
                                router.push(`${link}${session.user.email}`)
                            }
                        } else {
                            await signIn('twitch', { callbackUrl: '/pricing' })
                        }
                        }}
                        >
                        Get started
                    </Button>
                    )}
                </div>
            </div>
        </div>
    )
}