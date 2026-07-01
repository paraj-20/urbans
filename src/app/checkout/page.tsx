"use client";

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@/components/auth.module.css'; // Reusing forms

export default function CheckoutPage() {
    const { user, isLoading } = useAuth();
    const { items, cartTotal, clearCart } = useCart();
    const router = useRouter();

    const [status, setStatus] = useState<'' | 'processing' | 'success'>('');
    const [error, setError] = useState('');
    const [receipt, setReceipt] = useState<any>(null);

    if (isLoading) return null;
    if (!user) {
        router.replace('/login');
        return null;
    }

    if (items.length === 0 && status !== 'success') {
        return (
            <div className={styles.container}>
                <div className={styles.card} style={{ textAlign: 'center' }}>
                    <h2>YOUR CART IS EMPTY</h2>
                    <button className={styles.submitBtn} onClick={() => router.push('/')}>BACK TO SURFING</button>
                </div>
            </div>
        );
    }

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setStatus('processing');

        try {
            // 1. Create order on our backend
            const res = await fetch('/api/checkout/razorpay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    total: cartTotal,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Payment initialization failed');

            // 2. Initialize Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
                amount: data.amount, // Amount is in currency subunits.
                currency: data.currency,
                name: "URBANS Store",
                description: "Test Transaction",
                order_id: data.orderId, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                handler: function (response: any) {
                    // Payment successful
                    console.log("Payment successful", response);
                    setStatus('success');
                    setReceipt({ orderId: data.orderId, receipt: { items, total: cartTotal } });
                    clearCart();
                },
                prefill: {
                    name: user?.name || "Customer",
                    email: user?.email || "customer@example.com",
                },
                theme: {
                    color: "#00ff94"
                }
            };
            
            // @ts-ignore
            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                console.error(response.error);
                setError(response.error.description || 'Payment Failed');
                setStatus('');
            });
            rzp1.open();

        } catch (err: any) {
            setError(err.message);
            setStatus('');
        }
    };

    if (status === 'success' && receipt) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h2 style={{ color: '#00ff94' }}>PAYMENT SUCCESSFUL</h2>
                        <p>Order #{receipt.orderId}</p>
                    </div>

                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                        <p><strong>Receipt sent to:</strong> {user.email}</p>
                        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 0' }} />
                        {receipt.receipt.items.map((item: any) => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0', fontSize: '0.9rem' }}>
                                <span>{item.quantity}x {item.name}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                            <span>Total Paid</span>
                            <span>${receipt.receipt.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <button className={styles.submitBtn} onClick={() => router.push('/')}>CONTINUE SHOPPING</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container} style={{ alignItems: 'flex-start', paddingTop: '4rem' }}>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>

                {/* Payment Form Left */}
                <div className={styles.card} style={{ flex: '1 1 300px', alignSelf: 'flex-start' }}>
                    <div className={styles.header}>
                        <h2>CHECKOUT</h2>
                        <p>Complete your demo payment</p>
                    </div>

                    <form className={styles.form} onSubmit={handleCheckout}>
                        {error && <div className={styles.error}>{error}</div>}

                        <div className={styles.inputGroup}>
                            <label>Email</label>
                            <input type="email" value={user.email} disabled style={{ opacity: 0.5 }} />
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={status === 'processing'}>
                            {status === 'processing' ? 'PROCESSING...' : `PAY $${cartTotal.toFixed(2)}`}
                        </button>
                    </form>
                </div>

                {/* Order Summary Right */}
                <div className={styles.card} style={{ flex: '1 1 300px', alignSelf: 'flex-start' }}>
                    <div className={styles.header}>
                        <h2>ORDER SUMMARY</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        {items.map((item) => (
                            <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ width: '60px', height: '60px', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
                                    <Image src={item.imageUrl} alt={item.name} fill style={{ objectFit: 'cover' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{item.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Qty: {item.quantity}</div>
                                </div>
                                <div style={{ fontWeight: 'bold' }}>
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1.5rem 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '900', color: 'var(--accent)' }}>
                        <span>TOTAL</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
