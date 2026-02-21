import React, { Suspense } from 'react';
import HeroCategory from '@/components/HeroCategory';
import SectionLayout from '@/components/SectionLayout';
import ProductCard from '@/components/ProductCard';
import { fetchProductsBySection, fetchTrending } from '@/lib/db';
import styles from './page.module.css';

async function ProductGrid({ category, subcategory }: { category: 'MEN' | 'WOMEN', subcategory: string }) {
    const products = await fetchProductsBySection(category, [subcategory]);

    if (products.length === 0) {
        return <p className={styles.emptyState}>No products available at the moment.</p>;
    }

    return (
        <>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </>
    );
}

async function TrendingGrid({ category }: { category: 'MEN' | 'WOMEN' }) {
    const products = await fetchTrending(category);

    if (products.length === 0) {
        return <p className={styles.emptyState}>No trending products available at the moment.</p>;
    }

    return (
        <>
            {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </>
    );
}

export default function MenPage() {
    const clothingCategories = [
        { id: 'shirts', title: 'SHIRTS' },
        { id: 't-shirts', title: 'T-SHIRTS' },
        { id: 'jackets', title: 'JACKETS' },
        { id: 'pants', title: 'PANTS' },
        { id: 'jeans', title: 'JEANS' },
        { id: 'aesthetics', title: 'AESTHETICS' }
    ];

    const accessoriesCategories = [
        { id: 'caps', title: 'CAPS' },
        { id: 'backpacks', title: 'BACKPACKS' }
    ];

    return (
        <main className={styles.page}>
            <HeroCategory
                title="MEN'S COLLECTION"
                subtitle="Discover premium cuts, bold aesthetics, and timeless silhouettes."
                imageUrl="https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&q=80"
            />

            <SectionLayout id="trending" title="TRENDING NOW" subtitle="The season's most sought-after pieces.">
                <Suspense fallback={<div className={styles.loading}>Loading trends...</div>}>
                    <TrendingGrid category="MEN" />
                </Suspense>
            </SectionLayout>

            <SectionLayout id="clothing" title="CLOTHING" subtitle="Essentials re-imagined.">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', gridColumn: '1 / -1' }}>
                    {clothingCategories.map(cat => (
                        <div key={cat.id} id={cat.id} className={styles.subSection}>
                            <h3 className={styles.subTitle}>{cat.title}</h3>
                            <div className={styles.grid}>
                                <Suspense fallback={<div className={styles.loading}>Loading {cat.title}...</div>}>
                                    <ProductGrid category="MEN" subcategory={cat.id} />
                                </Suspense>
                            </div>
                        </div>
                    ))}
                </div>
            </SectionLayout>

            <SectionLayout id="accessories" title="ACCESSORIES" subtitle="Complete your look.">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', gridColumn: '1 / -1' }}>
                    {accessoriesCategories.map(cat => (
                        <div key={cat.id} id={cat.id} className={styles.subSection}>
                            <h3 className={styles.subTitle}>{cat.title}</h3>
                            <div className={styles.grid}>
                                <Suspense fallback={<div className={styles.loading}>Loading {cat.title}...</div>}>
                                    <ProductGrid category="MEN" subcategory={cat.id} />
                                </Suspense>
                            </div>
                        </div>
                    ))}
                </div>
            </SectionLayout>
        </main>
    );
}
