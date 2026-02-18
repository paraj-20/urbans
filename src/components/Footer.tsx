"use client";

import Link from 'next/link';
import { useState } from 'react';
import styles from './footer.module.css';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = () => {
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 5000);
        }
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.footerTop}>
                <div className={styles.footerLogo}>
                    <h2>URBANS</h2>
                    <p>EST. 2024</p>
                </div>
                <div className={styles.footerLinks}>
                    <div className={styles.linkColumn}>
                        <h4>SHOP</h4>
                        <Link href="#">Men</Link>
                        <Link href="#">Women</Link>
                        <Link href="#">New Arrivals</Link>
                        <Link href="#">Accessories</Link>
                    </div>
                    <div className={styles.linkColumn}>
                        <h4>SUPPORT</h4>
                        <Link href="#">FAQ</Link>
                        <Link href="#">Shipping</Link>
                        <Link href="#">Returns</Link>
                        <Link href="/contact">Contact</Link>
                    </div>
                    <div className={styles.linkColumn}>
                        <h4>LEGAL</h4>
                        <Link href="#">Privacy</Link>
                        <Link href="#">Terms</Link>
                        <Link href="#">Accessibility</Link>
                    </div>
                </div>
            </div>

            {/* Newsletter Section */}
            <div className={styles.newsletterSection}>
                <div className={styles.newsletterContent}>
                    <div className={styles.newsletterLeft}>
                        <h3>STAY IN THE LOOP</h3>
                        <p>Subscribe for exclusive drops, early access, and editorial content.</p>
                    </div>
                    <div className={styles.newsletterRight}>
                        <div className={styles.enhancedInputGroup}>
                            {subscribed ? (
                                <div className={styles.successMsg}>YOU'RE ON THE LIST.</div>
                            ) : (
                                <>
                                    <input
                                        type="email"
                                        placeholder="ENTER YOUR EMAIL"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <button onClick={handleSubscribe}>SUBSCRIBE</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <p>© 2026 URBANS. ALL RIGHTS RESERVED.</p>
            </div>
        </footer>
    );
}
