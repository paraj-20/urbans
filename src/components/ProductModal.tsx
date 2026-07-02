"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/db';
import { useCart } from '@/context/CartContext';
import styles from './ProductModal.module.css';
import { X, Clock, RefreshCcw, Banknote, ShieldCheck } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

interface ProductModalProps {
    product: Product;
    onClose: () => void;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ProductModal({ product, onClose }: ProductModalProps) {
    const [selectedSize, setSelectedSize] = useState<string>('');
    const { addToCart } = useCart();
    const { formatPrice } = useCurrency();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleAddToCart = () => {
        if (!selectedSize) return;

        addToCart({
            cartItemId: `${product.id}-${selectedSize}`,
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            selectedSize
        });
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={20} />
                </button>

                <div className={styles.imageSection}>
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: 'cover' }}
                    />
                </div>

                <div className={styles.infoSection}>
                    <div className={styles.header}>
                        <h2 className={styles.name}>{product.name}</h2>
                        <p className={styles.price}>{formatPrice(product.price)}</p>
                    </div>

                    <div>
                        <h3 className={styles.sectionTitle}>Select Size</h3>
                        <div className={styles.sizes}>
                            {SIZES.map(size => (
                                <button
                                    key={size}
                                    className={`${styles.sizeBtn} ${selectedSize === size ? styles.active : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.perks}>
                        <div className={styles.perkItem}>
                            <Clock size={18} />
                            <span>Delivery within 2 days from order</span>
                        </div>
                        <div className={styles.perkItem}>
                            <RefreshCcw size={18} />
                            <span>10 day hassle-free return</span>
                        </div>
                        <div className={styles.perkItem}>
                            <Banknote size={18} />
                            <span>Cash on delivery available</span>
                        </div>
                        <div className={styles.perkItem}>
                            <ShieldCheck size={18} />
                            <span>URBANS Assured Quality</span>
                        </div>
                    </div>

                    <button
                        className={styles.addToBagBtn}
                        onClick={handleAddToCart}
                        disabled={!selectedSize}
                    >
                        {selectedSize ? 'ADD TO BAG' : 'SELECT A SIZE'}
                    </button>
                </div>
            </div>
        </div>
    );
}
