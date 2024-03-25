import { type StatusSubscription } from "@prisma/client"
import { api } from "~/trpc/server"

export interface PaymentResponse {
    data: {
        id: string,
        attributes: PaymentData
    },
    meta: {
        test_mode: boolean,
        event_name: string,
        webhook_id: string
    }
}
export interface PaymentData {
    product_id: string,
    user_email: string,
    variant_id: string,
    variant_name: string,
    renews_at: string,
    ends_at?: string | null,
    ls_subsId: string,
    status: StatusSubscription
    store_id: string
}

export async function POST(request: Request) {
	const body = await request.json() as PaymentResponse
    const data: PaymentData = {
        product_id: body.data.attributes.product_id.toString(),
        user_email: body.data.attributes.user_email,
        variant_id: body.data.attributes.variant_id.toString(),
        variant_name: body.data.attributes.variant_name.toLowerCase(),
        renews_at: body.data.attributes.renews_at,
        ends_at: body.data.attributes.ends_at,
        ls_subsId: body.data.id,
        status: body.data.attributes.status,
        store_id: body.data.attributes.store_id.toString()
    }

    
    if (body.meta.event_name === 'subscription_updated') {

        if(data.status === 'active') {
            await api.subscriptions.setSubscriptionPlus.mutate(data)
        }

        else if (data.status === 'cancelled' || data.status === 'expired') {
            const dataCancelled = {
                ends_at: data.ends_at,
                renews_at: data.renews_at,
                status: data.status,
                user_email: data.user_email,
                ls_subsId: data.ls_subsId,
            }
            await api.subscriptions.cancelAndExpiredSubscription.mutate(dataCancelled)
            return Response.json({message: 'Subscription Cancelled or Expired'}, {status: 200})
        }

        return Response.json({message: 'Subscription Updated'}, {status: 200})
    }

    return Response.json({message: 'Subscription Not Updated'}, {status: 200})
}
