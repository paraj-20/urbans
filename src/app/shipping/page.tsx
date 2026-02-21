import React from 'react';
import styles from '@/components/auth.module.css'; // Reusing premium aesthetic container

export default function ShippingPolicy() {
    return (
        <div className={styles.container} style={{ alignItems: 'flex-start', paddingTop: '4rem' }}>
            <div className={styles.card} style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}>
                <div className={styles.header} style={{ textAlign: 'left', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '1rem' }}>SHIPPING POLICY</h1>
                    <p>Last updated: February 21, 2026</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: '#ccc', lineHeight: '1.8' }}>
                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>1. ORDER PROCESSING</h2>
                        <p>All orders are processed and handed over to our carrier partners within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped containing your tracking number.</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>2. DOMESTIC SHIPPING RATES AND ESTIMATES</h2>
                        <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li><strong>Standard Shipping:</strong> 3-5 business days - $5.99 (Free on orders over $150)</li>
                            <li><strong>Priority Shipping:</strong> 2 business days - $14.99</li>
                            <li><strong>Next Day Air:</strong> 1 business day - $29.99 (Must be ordered before 12 PM EST)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>3. INTERNATIONAL SHIPPING</h2>
                        <p>We offer global shipping to over 50 countries. International shipping times range from 7 to 21 business days. Shipping charges for your order will be calculated and displayed at checkout.</p>
                        <p style={{ marginTop: '1rem' }}><em>Please note: Your order may be subject to import duties and taxes (including VAT), which are incurred once a shipment reaches your destination country. URBANS is not responsible for these charges if they are applied and are your responsibility as the customer.</em></p>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>4. HOW DO I CHECK THE STATUS OF MY ORDER?</h2>
                        <p>When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available. If you haven’t received your order within 10 days of receiving your shipping confirmation email, please contact us with your name and order number, and we will look into it for you.</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>5. PO BOXES & APO/FPO ADDRESSES</h2>
                        <p>Some carriers have limitations around shipping to PO Boxes. We use USPS for these addresses alongside standard residential deliveries.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
