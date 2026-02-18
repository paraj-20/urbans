"use client";

import { useState } from 'react';
import styles from './blogs.module.css';

export default function Blogs() {
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [visibleCount, setVisibleCount] = useState(3);
    const [isLoading, setIsLoading] = useState(false);

    const categories = ['ALL', 'DESIGN', 'CULTURE', 'SUSTAINABILITY', 'STYLE GUIDE'];

    const articles = [
        {
            id: 1,
            title: "THE RISE OF UTILITARIAN AESTHETICS",
            category: "DESIGN",
            image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500&auto=format&fit=crop",
            excerpt: "How functionality is overtaking form in the modern wardrobe, and why pockets are the new status symbol.",
            date: "FEB 10, 2026",
            readTime: "5 MIN READ"
        },
        {
            id: 2,
            title: "SUSTAINABLE FABRICS: BEYOND THE BUZZWORD",
            category: "SUSTAINABILITY",
            image: "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=80&w=500&auto=format&fit=crop",
            excerpt: "Exploring the next generation of textiles, from mushroom leather to recycled ocean plastics.",
            date: "JAN 28, 2026",
            readTime: "7 MIN READ"
        },
        {
            id: 3,
            title: "STREETWEAR IN TOKYO: A PHOTO DIARY",
            category: "CULTURE",
            image: "https://images.unsplash.com/photo-1542056380-4057d2941974?q=80&w=500&auto=format&fit=crop",
            excerpt: "Our team spent a week in Harajuku documenting the most inspiring fits of the season.",
            date: "JAN 15, 2026",
            readTime: "10 MIN READ"
        },
        {
            id: 4,
            title: "ARCHIGRAM: FASHION MEETS ARCHITECTURE",
            category: "DESIGN",
            image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=500&auto=format&fit=crop",
            excerpt: "How brutalist architecture influences the lines and cuts of our latest collection.",
            date: "DEC 22, 2025",
            readTime: "6 MIN READ"
        },
        {
            id: 5,
            title: "THE ART OF LAYERING",
            category: "STYLE GUIDE",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=500&auto=format&fit=crop",
            excerpt: "Mastering the transition between seasons with our essential layering pieces.",
            date: "DEC 10, 2025",
            readTime: "4 MIN READ"
        },
        {
            id: 6,
            title: "SOUNDTRACKS FOR THE STUDIO",
            category: "CULTURE",
            image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=500&auto=format&fit=crop",
            excerpt: "A curated playlist of the beats that fuel our design sessions late into the night.",
            date: "NOV 30, 2025",
            readTime: "3 MIN READ"
        }
    ];

    const filteredArticles = activeCategory === 'ALL'
        ? articles
        : articles.filter(article => article.category === activeCategory);

    const handleLoadMore = () => {
        setIsLoading(true);
        setTimeout(() => {
            setVisibleCount(prev => prev + 3);
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className={styles.container}>
            <header className={styles.hero}>
                <h1>EDITORIAL</h1>
                <div className={styles.categories}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`${styles.categoryBtn} ${activeCategory === cat ? styles.active : ''}`}
                            onClick={() => { setActiveCategory(cat); setVisibleCount(3); }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            {/* Featured Article */}
            <section className={styles.featured}>
                <div className={styles.featuredCard}>
                    <div className={styles.overlay}>
                        <span className={styles.featuredTag}>FEATURED</span>
                        <h2 className={styles.featuredTitle}>REDEFINING LUXURY IN THE AGE OF SCARCITY</h2>
                        <div className={styles.featuredMeta}>FEB 18, 2026 • BY ALEX RIVERA • 8 MIN READ</div>
                        <button className={styles.featuredBtn}>READ ARTICLE</button>
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className={styles.grid}>
                {filteredArticles.slice(0, visibleCount).map(article => (
                    <div key={article.id} className={styles.card}>
                        <div
                            className={styles.cardImage}
                            style={{ backgroundImage: `url('${article.image}')` }}
                        ></div>
                        <div className={styles.cardContent}>
                            <div className={styles.cardMeta}>
                                <span className={styles.cardTag}>{article.category}</span>
                                <span className={styles.readTime}>{article.readTime}</span>
                            </div>
                            <h3 className={styles.cardTitle}>{article.title}</h3>
                            <p className={styles.cardExcerpt}>{article.excerpt}</p>
                            <button className={styles.readMore}>READ ARTICLE <span className={styles.arrow}>→</span></button>
                        </div>
                    </div>
                ))}
            </section>

            {visibleCount < filteredArticles.length && (
                <div className={styles.loadMoreContainer}>
                    <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
                        {isLoading ? 'LOADING...' : 'LOAD MORE STORIES'}
                    </button>
                </div>
            )}
        </div>
    );
}
