import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PaymentRepository } from '@/lib/db/repositories';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const activeSubscription = await PaymentRepository.findActiveSubscriptionByUserId(userId);

        if (!activeSubscription) {
            return NextResponse.json({
                status: 'inactive',
                plan: null,
                entitlements: [],
            });
        }

        // This is a simplified entitlement mapping. You would have a more complex
        // mapping from planId to a list of features/entitlements.
        const entitlements = activeSubscription.planId === 'pro'
            ? ['pro-features', 'unlimited-projects']
            : ['basic-features'];

        return NextResponse.json({
            status: activeSubscription.status,
            plan: activeSubscription.planId,
            entitlements,
            currentPeriodEnd: (activeSubscription.metadata as any)?.currentPeriodEnd,
        });

    } catch (error) {
        console.error('[API] Stripe Status Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
