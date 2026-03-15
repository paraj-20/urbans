"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './story.module.css';

export default function OurStory() {
    const [activeMilestone, setActiveMilestone] = useState<number | null>(null);
    const timelineRef = useRef<HTMLDivElement>(null);

    const milestones = [
        { year: "2018", title: "THE INCEPTION", desc: "Two friends, one sewing machine, and a vision to redefine streetwear. The first prototype was stitched by hand in a garage in Brooklyn." },
        { year: "2020", title: "THE DROPOUT", desc: "We quit our day jobs. Launched the first capsule collection 'FADED CONCRETE' which sold out in 48 hours. We knew we had something real." },
        { year: "2022", title: "GLOBAL EXPANSION", desc: "Opened our flagship store in Tokyo. Collaborated with underground artists and musicians who shared our ethos of raw authenticity." },
        { year: "2024", title: "DEFINING THE SILHOUETTE", desc: "Established the URBANS design language: stark, architectural, and unapologetically bold. Featured in major fashion weeks globally." },
        { year: "2026", title: "THE FUTURE", desc: "Launching the sustainable tech-wear line. The revolution continues with smart fabrics and zero-waste production methods." }
    ];

    const galleryImages = [
        { src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop", caption: "THE STUDIO" },
        { src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop", caption: "PROTOTYPES" },
        { src: "https://images.unsplash.com/photo-1550921086-5388c383f7a8?q=80&w=800&auto=format&fit=crop", caption: "MATERIALS" },
        { src: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?q=80&w=800&auto=format&fit=crop", caption: "SKETCHES" },
        { src: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800&auto=format&fit=crop", caption: "RUNWAY" }, // New logic requires 5 items for the grid
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(styles.visible);
                    }
                });
            },
            {
                threshold: 0.1, // Trigger when 10% visible
                rootMargin: "0px 0px -50px 0px"
            }
        );

        const items = document.querySelectorAll(`.${styles.milestone}`);
        items.forEach((item) => observer.observe(item));

        return () => observer.disconnect();
    }, []);

    const handleMilestoneClick = (index: number) => {
        setActiveMilestone(activeMilestone === index ? null : index);
    };

    return (
        <div className={styles.container}>
            {/* Intro */}
            <section className={styles.intro}>
                <div className={styles.introBg}></div>
                <div className={styles.overlay}></div>
                <h1 className={styles.title}>BORN IN <br />THE DARK</h1>
                <p className={styles.introText}>
                    URBANS wasn't started in a boardroom. It began in a basement, fueled by caffeine, loud music, and a refusal to compromise on fit or fabric.
                </p>
            </section>

            {/* Philosophy Section */}
            <section className={styles.philosophy}>
                <div className={styles.philosophyGrid}>
                    <div className={styles.philosophyContent}>
                        <h2>THE CODE</h2>
                        <p>
                            We believe that clothing is the first layer of architecture you interact with. It defines your space in the world.
                            Our philosophy is rooted in "Utilitarian Luxury" — the idea that functionality shouldn't sacrifice aesthetics.
                        </p>
                        <p>
                            We strip away the unnecessary. No logos for the sake of logos. No trends for the sake of sales.
                            Just pure form, engineered for the chaos of modern life.
                        </p>
                        <div className={styles.quote}>
                            "Silence is the loudest sound in the city."
                        </div>
                    </div>
                    <div className={styles.philosophyImage}>
                        <Image
                            src="https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=800&auto=format&fit=crop"
                            alt="Design Philosophy"
                            width={800}
                            height={600}
                            className={styles.image}
                        />
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className={styles.timeline} ref={timelineRef}>
                {milestones.map((item, index) => (
                    <div
                        key={item.year}
                        className={`${styles.milestone} ${index % 2 !== 0 ? styles.milestoneRight : ''} ${activeMilestone === index ? styles.active : ''}`}
                        onClick={() => handleMilestoneClick(index)}
                    >
                        <div className={styles.milestoneContent}>
                            <span className={styles.year}>{item.year}</span>
                            <h3 className={styles.milestoneTitle}>{item.title}</h3>
                            <p className={styles.milestoneDesc}>{item.desc}</p>
                            {activeMilestone === index && (
                                <div className={styles.expandedContent}>
                                    <p>Detailed archives from {item.year} show a relentless pursuit of perfection. This era defined our core aesthetic and laid the groundwork for everything that followed.</p>
                                </div>
                            )}
                        </div>
                        <div className={styles.milestoneDot}></div>
                    </div>
                ))}
            </section>

            {/* Gallery */}
            <section className={styles.gallerySection}>
                <h2 className={styles.galleryTitle}>ARCHIVES</h2>
                <div className={styles.gallery}>
                    {galleryImages.map((img, idx) => (
                        <div key={idx} className={styles.galleryItem}>
                            <Image src={img.src} alt={img.caption} width={800} height={800} className={styles.image} />
                            <div className={styles.galleryCaption}>{img.caption}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
