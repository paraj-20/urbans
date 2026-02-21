import React from 'react';
import styles from '@/components/auth.module.css'; // Reusing premium aesthetic container

export default function ReturnsPolicy() {
    return (
        <div className={styles.container} style={{ alignItems: 'flex-start', paddingTop: '4rem' }}>
            <div className={styles.card} style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}>
                <div className={styles.header} style={{ textAlign: 'left', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '1rem' }}>RETURNS & EXCHANGES</h1>
                    <p>Last updated: February 21, 2026</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: '#ccc', lineHeight: '1.8' }}>
                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>1. STANDARD RETURN POLICY</h2>
                        <p>We accept returns of unworn, unwashed, and undamaged items within 30 days of original purchase. Items must be returned with all original tags attached. Returns that do not meet these conditions may be refused or sent back at the customer's expense.</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>2. HOW TO INITIATE A RETURN</h2>
                        <p>To initiate a return or exchange, please follow these steps:</p>
                        <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <li>1. Go to your Order Confirmation email and click "Start a Return".</li>
                            <li>2. Provide your order number and email address.</li>
                            <li>3. Select the items you wish to return and state the reason.</li>
                            <li>4. A printable prepaid return shipping label will be generated for you.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>3. REFUND TIMELINE</h2>
                        <p>Once your return is received and inspected (which typically takes 3-5 business days upon arrival at our warehouse), we will send you an email to notify you that we have processed your return. Your refund will be credited to the original method of payment. Please note that it may take an additional 5-10 business days for your bank to post the refund to your account.</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>4. EXCHANGES</h2>
                        <p>If you need a different size or color, the fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>5. EXCEPTIONS / NON-RETURNABLE ITEMS</h2>
                        <p>Certain types of items cannot be returned due to hygiene reasons. This includes underwear, socks, and earrings. Custom products (such as special orders or personalized items) also cannot be returned. Please contact us if you have questions or concerns about your specific item.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
