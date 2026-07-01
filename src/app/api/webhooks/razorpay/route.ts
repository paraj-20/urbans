import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const bodyText = await req.text();
        const signature = req.headers.get('x-razorpay-signature');
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!signature || !webhookSecret) {
            return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
        }

        // Verify Signature
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(bodyText)
            .digest('hex');

        if (expectedSignature !== signature) {
            console.error('Webhook signature mismatch!');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // Parse Payload
        const payload = JSON.parse(bodyText);
        const event = payload.event;

        console.log(`Received Razorpay Webhook: ${event}`);

        if (event === 'order.paid') {
            const orderInfo = payload.payload.order.entity;
            const paymentInfo = payload.payload.payment.entity;
            
            const userEmail = paymentInfo.notes?.email || orderInfo.notes?.email;
            
            if (userEmail) {
                console.log(`✅ Order ${orderInfo.id} paid successfully by ${userEmail}. Sending receipt...`);
                
                // Send Real Email Receipt
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
                            <p>Hi there,</p>
                            <p style="color: #ccc;">Thank you for shopping at URBANS. Your payment was successful for order <strong>#${orderInfo.id}</strong>.</p>
                            
                            <div style="background-color: #111; padding: 20px; border-radius: 4px; margin: 20px 0;">
                                <div style="display: flex; justify-content: space-between; font-weight: bold; margin-top: 15px; font-size: 18px;">
                                    <span>TOTAL PAID:</span>
                                    <span style="color: #00ff94;">${orderInfo.currency} ${(orderInfo.amount / 100).toFixed(2)}</span>
                                </div>
                            </div>

                            <p style="color: #888; font-size: 12px; margin-top: 30px;">Date: ${new Date().toLocaleString()}</p>
                            <p style="color: #888; font-size: 12px;">Payment Method: ${paymentInfo.method}</p>
                        </div>
                    `;

                    await transporter.sendMail({
                        from: '"URBANS Store" <heavygamerz2006@gmail.com>',
                        to: userEmail,
                        subject: `URBANS Receipt - Order #${orderInfo.id}`,
                        html: emailHtml
                    });
                    
                    console.log('✅ Real email receipt sent!');
                } catch (emailErr) {
                    console.error('❌ Email failed to send! Missing EMAIL_PASS?', emailErr);
                }
            }
        } else if (event === 'payment.failed') {
            console.warn(`Payment failed: ${payload.payload.payment.entity.id}`);
        }

        return NextResponse.json({ status: 'ok' });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
