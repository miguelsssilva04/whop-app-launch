import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/app/lib/whop-sdk';

export async function POST(request: NextRequest) {
  try {
    const { price, experienceId, planType, title } = await request.json();

    if (typeof price === 'undefined' || !experienceId || !planType || !title) { 
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isRenewal = planType === 'renewal';

    const plan = isRenewal
      ? {
          company_id: "biz_OSs3bI5ATzIiD0",
          plan_type: "renewal",
          currency: "usd",
          renewal_price: price,
          billing_period: 30,
          initial_price: price,
          title: title,
        }
      : {
          company_id: "biz_OSs3bI5ATzIiD0",
          plan_type: "one_time",
          currency: "usd",
          initial_price: price,
          title: title,
        };

    const checkoutConfiguration = await whopsdk.checkoutConfigurations.create({
      plan: plan as any,
      metadata: {
        experienceId,
        planType,
      },
    });

    return NextResponse.json(checkoutConfiguration);
  } catch (error) {
    console.error('Error creating checkout configuration:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to create checkout configuration', details: errorMessage }, { status: 500 });
  }
}

