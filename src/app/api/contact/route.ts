import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        // Basic validation
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
        }

        // Simulate network/email sending delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // ----------------------------------------------------
        // SIMULATED EMAIL TO heavygamerz2006@gmail.com
        // ----------------------------------------------------
        console.log('\n\n======================================================');
        console.log('                 INCOMING TRANSMISSION');
        console.log('======================================================');
        console.log(`📡 DESTINATION: heavygamerz2006@gmail.com`);
        console.log(`👤 FROM: ${name} <${email}>`);
        console.log(`📌 SUBJECT: ${subject || 'General Inquiry'}`);
        console.log(`✉️ MESSAGE:`);
        console.log(message);
        console.log('======================================================\n\n');

        return NextResponse.json({ success: true, message: 'Message successfully sent to heavygamerz2006@gmail.com' });

    } catch (error: any) {
        console.error('Contact form error:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
