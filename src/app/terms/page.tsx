import React from 'react';
import styles from '@/components/auth.module.css'; // Reusing premium aesthetic container

export default function TermsOfService() {
    return (
        <div className={styles.container} style={{ alignItems: 'flex-start', paddingTop: '4rem' }}>
            <div className={styles.card} style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}>
                <div className={styles.header} style={{ textAlign: 'left', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '1rem' }}>TERMS OF SERVICE</h1>
                    <p>Effective Date: February 21, 2026</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: '#ccc', lineHeight: '1.8' }}>
                    <section>
                        <p>Welcome to URBANS. This website is operated by URBANS LLC. Throughout the site, the terms “we”, “us” and “our” refer to URBANS LLC. URBANS offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>SECTION 1 - ONLINE STORE TERMS</h2>
                        <p>By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>SECTION 2 - GENERAL CONDITIONS</h2>
                        <p>We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve transmissions over various networks. Credit card information is always encrypted during transfer over networks.</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>SECTION 3 - ACCURACY OF BILLING AND ACCOUNT INFORMATION</h2>
                        <p>We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made.</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>SECTION 4 - INTELLECTUAL PROPERTY</h2>
                        <p>All content included on this site, such as text, graphics, logos, images, audio clips, digital downloads, and structural code, is the property of URBANS LLC or its content suppliers and protected by international copyright laws. The compilation of all content on this site is the exclusive property of URBANS LLC.</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>SECTION 5 - GOVERNING LAW</h2>
                        <p>These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of the United States of America.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
