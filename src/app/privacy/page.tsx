import React from 'react';
import styles from '@/components/auth.module.css'; // Reusing premium aesthetic container

export default function PrivacyPolicy() {
    return (
        <div className={styles.container} style={{ alignItems: 'flex-start', paddingTop: '4rem' }}>
            <div className={styles.card} style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}>
                <div className={styles.header} style={{ textAlign: 'left', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '1rem' }}>PRIVACY POLICY</h1>
                    <p>Effective Date: February 21, 2026</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: '#ccc', lineHeight: '1.8' }}>
                    <section>
                        <p>At URBANS, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and share your personal information when you visit or make a purchase from our website.</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>1. INFORMATION WE COLLECT</h2>
                        <p>When you visit the site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the site, and information about how you interact with the site.</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>2. HOW WE USE YOUR PERSONAL INFORMATION</h2>
                        <p>We use the Order Information that we collect generally to fulfill any orders placed through the site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this Order Information to:</p>
                        <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <li>Communicate with you;</li>
                            <li>Screen our orders for potential risk or fraud; and</li>
                            <li>When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>3. DATA RETENTION</h2>
                        <p>When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>4. YOUR RIGHTS (GDPR / CCPA)</h2>
                        <p>If you are a European resident or a resident of California, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information provided below.</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>5. CHANGES TO THIS POLICY</h2>
                        <p>We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
