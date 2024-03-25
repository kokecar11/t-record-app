import { type ListSubscriptionInvoices } from "@lemonsqueezy/lemonsqueezy.js"

export type Billing = {
	id: string
	amount: string
	status: string
	status_formatted: string
	billingReason: string
	date: string
	currency: string
}

export const billingsHistoryAdapter = (billings: ListSubscriptionInvoices) => {
    const listInvoices: Billing[] = []
    billings.data.map((b) => listInvoices.push({
        id: b.id,
        amount: b.attributes.total_formatted,
        status: b.attributes.status,
        status_formatted: b.attributes.status_formatted,
        billingReason: b.attributes.billing_reason,
        date: b.attributes.created_at,
        currency: b.attributes.currency,
    }))
    return listInvoices
}


