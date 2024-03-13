import { api } from "~/trpc/server"

export interface PaymentResponse {
    data: {
        id: string,
        attributes: PaymentData
    }
}
export interface PaymentData {
    product_id: string,
    user_email: string,
    variant_id: string,
    variant_name: string,
    renews_at: string,
    ends_at: string,
    ls_subsId: string,
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
    }
	
	await api.subscriptions.setPaymentSubscriptionByUser.mutate(data)
	return Response.json({message: 'Payment successful'}, {status: 200})
}
