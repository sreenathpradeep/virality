import { NextResponse } from 'next/server';
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js';

export async function POST() {
  const storeId = process.env.LEMONSQUEEZY_STORE_ID!;
  const variantId = process.env.LEMONSQUEEZY_VARIANT_ID!;
  const apiKey = process.env.LEMONSQUEEZY_API_KEY!;

  const checkout = await createCheckout(Number(storeId), Number(variantId), {
    apiKey,
  });

  return NextResponse.json(checkout.data);
}
