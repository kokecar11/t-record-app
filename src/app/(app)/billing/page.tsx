// 'use client'
import type { Metadata } from "next"
// import { useSession } from "next-auth/react"
import { getServerAuthSession } from "~/server/auth"

export const metadata: Metadata = {
    title: 'T-Record | Plan & Billing',
    description: 'T-Record Dashboard',
}

export default async function Billing() {
    const session = await getServerAuthSession()

    return (
        <main className="flex container min-h-screen flex-col bg-background text-white">
            <div className="container">
                <h1 className="text-2xl font-bold">Plan & Billing</h1>
                <div className="mb-3 border border-b border-white"></div>
                <div className="bg-primary-old my-2 rounded-lg shadow-lg border">
                    <div className='flex sm:space-x-16 p-4'>
                        <div className="grid sm:flex-1">
                            <span className='text-sm text-gray-400'>Plan</span>
                            <span className='text-xl text-white capitalize'>{session?.user.plan.toLowerCase()}</span>
                        </div>
                        {/* <div className="grid sm:flex-1">
                            <span className='text-sm text-gray-400'>Payment</span>
                            {
                                session?.user.plan === 'STARTER' ? 
                                <span className='text-xl text-white'>FREE</span> 
                                : 
                                <span className='text-xl text-white'>$0.00 
                                    <span className='text-xs text-gray-300'> per month</span>
                                </span> 
                            }
                        </div> */}
                    </div>
                </div>
            </div>
        </main>
    )
}