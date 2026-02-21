import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/auth';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const user = await getUserSession();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { items, total, cardDetails } = await req.json();

        // 1. Check cart validity
        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        // 2. Validate Demo Payment (Just simple validation for demo purposes)
        if (!cardDetails || !cardDetails.number || cardDetails.number.length < 15) {
            return NextResponse.json({ error: 'Invalid card details' }, { status: 400 });
        }

        // 3. Process Payment (Simulate 1.5s delay)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // 4. Send Actual Email Receipt to the User using Admin Email
        const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const date = new Date().toLocaleString();

        let emailStatus = 'Simulated. Requires EMAIL_PASS in .env.local';

        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'heavygamerz2006@gmail.com',
                    pass: process.env.EMAIL_PASS || 'MISSING_PASSWORD'
                }
            });

            const emailHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #050505; color: #fff; padding: 30px;">
                    <h1 style="color: #00ff94; letter-spacing: 2px;">URBANS</h1>
                    <h2 style="font-size: 18px; margin-bottom: 30px;">ORDER CONFIRMATION</h2>
                    <p>Hi ${user.name},</p>
                    <p style="color: #ccc;">Thank you for shopping at URBANS. Here is your receipt for order <strong>#${orderId}</strong>:</p>
                    
                    <div style="background-color: #111; padding: 20px; border-radius: 4px; margin: 20px 0;">
                        ${items.map((item: any) => `
                            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 10px;">
                                <span>${item.quantity}x ${item.name}</span>
                                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                        <div style="display: flex; justify-content: space-between; font-weight: bold; margin-top: 15px; font-size: 18px;">
                            <span>TOTAL PAID:</span>
                            <span style="color: #00ff94;">$${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <p style="color: #888; font-size: 12px; margin-top: 30px;">Date: ${date}</p>
                    <p style="color: #888; font-size: 12px;">Card ending in: ${cardDetails.number.slice(-4)}</p>
                </div>
            `;

            // Attempt to send
            await transporter.sendMail({
                from: '"URBANS Store" <heavygamerz2006@gmail.com>',
                to: user.email as string,
                subject: `URBANS Receipt - Order #${orderId}`,
                html: emailHtml
            });

            emailStatus = 'Sent successfully!';
            console.log(`✅ REAL EMAIL RECEIPT SENT TO ${user.email} FROM heavygamerz2006@gmail.com`);

        } catch (err) {
            console.error('❌ Email failed to send! You probably need to set EMAIL_PASS in .env.local:', err);
        }

        return NextResponse.json({
            message: 'Payment Successful',
            orderId,
            receipt: {
                items,
                total,
                date,
            }
        });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
