"use client";

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './CartDrawer.module.css';
import Image from 'next/image';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

export default function CartDrawer() {
    const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, cartTotal } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    // Prevent background scrolling when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen]);

    if (!isCartOpen) return null;

    return (
        <>
            <div className={styles.overlay} onClick={() => setIsCartOpen(false)} />
            <div className={styles.drawer}>
                <div className={styles.header}>
                    <h2>CART {items.length > 0 && `(${items.length})`}</h2>
                    <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.content}>
                    {items.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>Your cart is empty.</p>
                            <button
                                className={styles.continueBtn}
                                onClick={() => setIsCartOpen(false)}
                            >
                                CONTINUE SHOPPING
                            </button>
                        </div>
                    ) : (
                        <div className={styles.itemsList}>
                            {items.map((item) => (
                                <div key={item.id} className={styles.cartItem}>
                                    <div className={styles.itemImage}>
                                        <Image src={item.imageUrl} alt={item.name} fill sizes="100px" style={{ objectFit: 'cover' }} />
                                    </div>
                                    <div className={styles.itemDetails}>
                                        <div className={styles.itemHeader}>
                                            <h3>{item.name}</h3>
                                            <p className={styles.itemPrice}>${item.price}</p>
                                        </div>

                                        <div className={styles.actions}>
                                            <div className={styles.quantityCtrl}>
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                                    <Minus size={14} />
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.summaryRow}>
                            <span>SUBTOTAL</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <p className={styles.taxesInfo}>Taxes & shipping calculated at checkout.</p>
                        <button className={styles.checkoutBtn} onClick={() => {
                            setIsCartOpen(false);
                            if (!user) {
                                sessionStorage.setItem('urbans_return_url', '/checkout');
                                router.push('/login');
                            } else {
                                router.push('/checkout');
                            }
                        }}>
                            CHECKOUT
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
