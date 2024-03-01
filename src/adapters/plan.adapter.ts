import { type TypeSubscription, type Plan } from "@prisma/client"

export interface PlanAdapter {
    id: string
    title: string
    price: number | string | null
    link: string | null
    popular: boolean | null
    features: string[]
    typePlan: string
    typeSubscription: TypeSubscription
}

export const planAdapter = (plan: Plan, typeSubscription:TypeSubscription) => {
    return {
        id: plan.id,
        title: plan.title,
        price: typeSubscription === 'monthly' ? plan.price_monthly : plan.price_yearly,
        link: typeSubscription === 'monthly' ? plan.link_monthly : plan.link_yearly,
        popular: plan.popular,
        features: plan.features,
        typePlan: plan.type,
        typeSubscription
    }
}
export const plansAdapter = (plans: Plan[]) => {
    const planMonthly: PlanAdapter[] = plans.map((p) => planAdapter(p, 'monthly'))
    const planYearly: PlanAdapter[] = plans.map((p) => planAdapter(p, 'yearly'))
    return [...planMonthly, ...planYearly]
}