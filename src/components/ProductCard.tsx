"use client";

import Image from 'next/image';
import { Product } from '@/lib/db';
import styles from './ProductCard.module.css';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.image}
                />
                {product.isNew && <span className={styles.badge}>NEW</span>}
                <button
                    className={styles.quickAdd}
                    onClick={() => addToCart(product)}
                >
                    + ADD TO BAG
                </button>
            </div>
            <div className={styles.info}>
                <div className={styles.nameHeader}>
                    <h3 className={styles.name}>{product.name}</h3>
                    <p className={styles.price}>${product.price}</p>
                </div>
            </div>
        </div>
    );
}
