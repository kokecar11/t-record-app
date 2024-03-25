import { db } from "~/server/db"

export async function GET(request: Request) {
    if (request.method !== 'GET') {
        return Response.json({ message: 'Method not allowed' }, {status: 405});
    }

    if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return Response.json({ message: 'Unauthorized' }, {status: 401});
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1)
    const subscriptions = await db.subscription.findMany({
        where: {
            ends_at: {
                gte: today,
                lt: tomorrow
            }
        },
        select: {
            ends_at: true,
            renews_at: true,
            id: true
        }
    })

    const planStarter = await db.plan.findFirst({
        where: {
            type: 'STARTER',
        },
        select: {
            id: true,
        },
    })

    for (const subscription of subscriptions) {
        await db.subscription.update({
            where: {
                id: subscription.id
            },
            data: {
                planId: planStarter?.id,
            }
        });
    }
    return Response.json(
        { 
            message: 'Subscriptions expired or cancelled successfully' 
        },
        { 
            status: 200 
        }
    )
}
