"use client";

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@/components/auth.module.css'; // Reusing forms

export default function CheckoutPage() {
    const { user, isLoading } = useAuth();
    const { items, cartTotal, clearCart } = useCart();
    const { formatPrice, convertPrice, currency } = useCurrency();
    const router = useRouter();

    const [status, setStatus] = useState<'' | 'processing' | 'success'>('');
    const [error, setError] = useState('');
    const [receipt, setReceipt] = useState<any>(null);

    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [address, setAddress] = useState({
        firstName: user?.name?.split(' ')[0] || 'Paraj',
        lastName: user?.name?.split(' ').slice(1).join(' ') || 'Panchani',
        street: 'K-102, Parishkaar 1, Nr Khokhara Circle, Maninagar East, Khokhara',
        city: 'Ahmedabad',
        postalCode: '380008',
        phone: '9099970388'
    });

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
            const mrpTotal = cartTotal * 1.5;
            const platformFee = 2;
            const finalTotal = cartTotal + platformFee;

            // 1. Create order on our backend
            const res = await fetch('/api/checkout/razorpay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    total: convertPrice(finalTotal),
                    currency: currency
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Payment initialization failed');

            // 2. Initialize Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
                amount: data.amount, // Amount is in currency subunits.
                currency: data.currency,
                name: "Al-Urbans Store",
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
                            <div key={item.cartItemId || item.id} style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0', fontSize: '0.9rem' }}>
                                <span>{item.quantity}x {item.name} (Size: {item.selectedSize || 'M'})</span>
                                <span>{formatPrice(item.price * item.quantity)}</span>
                            </div>
                        ))}
                        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                            <span>Total Paid</span>
                            <span>{formatPrice(receipt.receipt.total)}</span>
                        </div>
                    </div>

                    <button className={styles.submitBtn} onClick={() => router.push('/')}>CONTINUE SHOPPING</button>
                </div>
            </div>
        );
    }

    const mrpTotal = cartTotal * 1.5;
    const discount = mrpTotal - cartTotal;
    const platformFee = 2;
    const finalTotal = cartTotal + platformFee;

    return (
        <div className={styles.container} style={{ alignItems: 'flex-start', paddingTop: '4rem' }}>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>

                {/* Left Column: Address and Items */}
                <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Delivery Address Card */}
                    <div className={styles.card} style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Deliver to:</h3>
                            {!isEditingAddress && (
                                <button
                                    onClick={() => setIsEditingAddress(true)}
                                    style={{ color: 'var(--accent)', border: '1px solid var(--accent)', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', background: 'transparent' }}>
                                    CHANGE
                                </button>
                            )}
                        </div>

                        {isEditingAddress ? (
                            <form onSubmit={(e) => { e.preventDefault(); setIsEditingAddress(false); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className={styles.inputGroup}>
                                        <label>First Name</label>
                                        <input type="text" value={address.firstName} onChange={(e) => setAddress({ ...address, firstName: e.target.value })} required />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Last Name</label>
                                        <input type="text" value={address.lastName} onChange={(e) => setAddress({ ...address, lastName: e.target.value })} required />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Street Address</label>
                                    <input type="text" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} required />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className={styles.inputGroup}>
                                        <label>City</label>
                                        <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Postal Code</label>
                                        <input type="text" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} required />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Phone Number</label>
                                    <input type="text" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} required />
                                </div>
                                <button type="submit" className={styles.submitBtn} style={{ marginTop: '0.5rem' }}>SAVE ADDRESS</button>
                            </form>
                        ) : (
                            <>
                                <div style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                                    {`${address.firstName} ${address.lastName}`.toUpperCase()}
                                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', color: '#ccc' }}>HOME</span>
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem', lineHeight: '1.5' }}>
                                    {address.street},<br />
                                    {address.city} {address.postalCode}
                                </div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                    {user.email} • {address.phone}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Order Items */}
                    <div className={styles.card} style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem' }}>ITEMS IN YOUR ORDER ({items.length})</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {items.map((item) => (
                                <div key={item.cartItemId || item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <div style={{ width: '80px', height: '100px', position: 'relative', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                                        <Image src={item.imageUrl} alt={item.name} fill style={{ objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '0.5rem' }}>Size: {item.selectedSize || 'M'}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#888' }}>Qty: <span style={{ fontWeight: 700, color: '#fff' }}>{item.quantity}</span></div>
                                    </div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        {formatPrice(item.price * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Price Details */}
                <div style={{ flex: '1 1 300px' }}>
                    <div className={styles.card} style={{ padding: '1.5rem', position: 'sticky', top: '2rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>PRICE DETAILS ({items.length} Items)</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#aaa' }}>Total MRP</span>
                                <span>{formatPrice(mrpTotal)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#aaa' }}>Discount on MRP</span>
                                <span style={{ color: 'var(--accent)' }}>- {formatPrice(discount)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#aaa' }}>Platform Fee</span>
                                <span>{formatPrice(platformFee)}</span>
                            </div>
                        </div>

                        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1.5rem 0' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '900' }}>
                            <span>Total Amount</span>
                            <span>{formatPrice(finalTotal)}</span>
                        </div>

                        <div style={{ background: 'rgba(0, 255, 148, 0.1)', color: 'var(--accent)', padding: '0.75rem', marginTop: '1.5rem', borderRadius: '4px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700 }}>
                            You will save {formatPrice(discount)} on this order
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={status === 'processing'}
                            style={{
                                width: '100%',
                                background: 'var(--accent)',
                                color: '#000',
                                padding: '1.2rem',
                                fontWeight: 900,
                                fontSize: '1.1rem',
                                borderRadius: '4px',
                                marginTop: '1.5rem',
                                textTransform: 'uppercase',
                                cursor: status === 'processing' ? 'not-allowed' : 'pointer',
                                opacity: status === 'processing' ? 0.7 : 1,
                                transition: 'opacity 0.2s'
                            }}
                        >
                            {status === 'processing' ? 'PROCESSING...' : `PAY NOW`}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
