"use client";

import { useState } from 'react';
import styles from './contact.module.css';

export default function Contact() {
    const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('General Inquiry');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('submitting');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message })
            });

            if (!res.ok) throw new Error('Failed to send message');

            setFormState('success');
            setName('');
            setEmail('');
            setSubject('General Inquiry');
            setMessage('');

            setTimeout(() => setFormState('idle'), 5000);
        } catch (error) {
            console.error('Submission error', error);
            setFormState('error');
            setTimeout(() => setFormState('idle'), 5000);
        }
    };

    const toggleFaq = (index: number) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    const faqs = [
        { question: "DO YOU SHIP INTERNATIONALLY?", answer: "Yes, we ship to over 50 countries worldwide including North America, Europe, and Asia." },
        { question: "WHAT IS YOUR RETURN POLICY?", answer: "We accept returns within 14 days of delivery for store credit or exchange. Items must be unworn with tags attached." },
        { question: "WHEN WILL MY PRE-ORDER SHIP?", answer: "Pre-order items typically ship within 3-4 weeks. Check the product page for specific estimates." }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                {/* Info Section */}
                <div className={styles.infoSection}>
                    <h1 className={styles.title}>
                        LET'S <br />
                        BUILD <br />
                        <span className={styles.accent}>SOMETHING.</span>
                    </h1>
                    <p className={styles.description}>
                        Whether you have a question about an order, want to collaborate, or just want to talk streetwear — we're listening.
                    </p>

                    <div className={styles.contactDetails}>
                        <div className={styles.detailItem}>
                            <h4>ADDRESS</h4>
                            <p>123 Concrete Ave, District 4<br />New York, NY 10012</p>
                        </div>
                        <div className={styles.detailItem}>
                            <h4>EMAIL</h4>
                            <p>contact@urbans.com</p>
                        </div>
                        <div className={styles.detailItem}>
                            <h4>PHONE</h4>
                            <p>+1 (555) 000-0000</p>
                        </div>
                    </div>

                    <div className={styles.socials}>
                        <a href="#" className={styles.socialLink}>INSTAGRAM</a>
                        <a href="#" className={styles.socialLink}>TWITTER</a>
                        <a href="#" className={styles.socialLink}>LINKEDIN</a>
                    </div>

                    {/* FAQ Accordion */}
                    <div className={styles.faqSection}>
                        <h3 className={styles.faqTitle}>QUICK ANSWERS</h3>
                        {faqs.map((faq, index) => (
                            <div key={index} className={styles.faqItem}>
                                <div
                                    className={styles.faqQuestion}
                                    onClick={() => toggleFaq(index)}
                                    style={{ color: activeFaq === index ? 'var(--accent)' : '' }}
                                >
                                    {faq.question} {activeFaq === index ? '−' : '+'}
                                </div>
                                {activeFaq === index && (
                                    <p className={styles.faqAnswer}>{faq.answer}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Section */}
                <div className={styles.formSection}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label>NAME</label>
                            <input
                                type="text"
                                placeholder="JOHN DOE"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>EMAIL</label>
                            <input
                                type="email"
                                placeholder="JOHN@EXAMPLE.COM"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>SUBJECT</label>
                            <select
                                className={styles.selectInput}
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            >
                                <option>General Inquiry</option>
                                <option>Order Support</option>
                                <option>Collaboration</option>
                                <option>Press</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>MESSAGE</label>
                            <textarea
                                rows={6}
                                placeholder="TYPE YOUR MESSAGE HERE..."
                                required
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            ></textarea>
                        </div>

                        {formState === 'success' ? (
                            <div className={styles.successMessage}>
                                MESSAGE SENT SUCCESSFULLY. WE'LL BE IN TOUCH.
                            </div>
                        ) : formState === 'error' ? (
                            <div className={styles.successMessage} style={{ backgroundColor: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', borderColor: '#ff4444' }}>
                                FAILED TO SEND MESSAGE. PLEASE TRY AGAIN.
                            </div>
                        ) : (
                            <button
                                className={styles.submitBtn}
                                disabled={formState === 'submitting'}
                            >
                                {formState === 'submitting' ? 'SENDING...' : 'SEND MESSAGE'}
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
