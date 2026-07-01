import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/auth';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
    try {
        const user = await getUserSession();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { items, total } = await req.json();

        // 1. Check cart validity
        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        if (!total || total <= 0) {
            return NextResponse.json({ error: 'Invalid total amount' }, { status: 400 });
        }

        // 2. Create Razorpay Order
        // Razorpay expects amount in paise (1 INR = 100 paise, or 1 USD = 100 cents)
        // We will assume USD for now, so total * 100 to convert to cents
        const amountInCents = Math.round(total * 100);

        const options = {
            amount: amountInCents,
            currency: 'USD',
            receipt: `rcptid_${user.id}_${Date.now()}`,
            notes: {
                userId: user.id,
                email: user.email,
            }
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            message: 'Order Created Successfully',
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        });

    } catch (error: any) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
