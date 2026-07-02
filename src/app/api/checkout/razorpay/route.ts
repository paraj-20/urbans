import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/auth';
import Razorpay from 'razorpay';

// Razorpay will be initialized inside the POST handler

export async function POST(req: Request) {
    try {
        const user = await getUserSession();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { items, total, currency = 'USD' } = await req.json();

        // 1. Check cart validity
        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        if (!total || total <= 0) {
            return NextResponse.json({ error: 'Invalid total amount' }, { status: 400 });
        }

        // 2. Create Razorpay Order
        // Razorpay expects amount in subunits (paise for INR, cents for USD)
        const amountInSubunits = Math.round(total * 100);

        const options = {
            amount: amountInSubunits,
            currency: currency,
            receipt: `rcptid_${String(user.id).substring(0, 10)}_${Date.now()}`,
            notes: {
                userId: String(user.id).substring(0, 40),
                email: String(user.email).substring(0, 40),
            }
        };

        const razorpay = new Razorpay({
            key_id: (process.env.RAZORPAY_KEY_ID || 'dummy_key').trim(),
            key_secret: (process.env.RAZORPAY_KEY_SECRET || 'dummy_secret').trim(),
        });

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            message: 'Order Created Successfully',
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        });

    } catch (error: any) {
        console.error('Error creating Razorpay order:', error);
        
        // Razorpay SDK throws a plain object like { statusCode, error: { description } }
        const errorMessage = error?.error?.description || error?.message || 'Internal Server Error';
        
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
