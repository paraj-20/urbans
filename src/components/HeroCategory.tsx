import Image from 'next/image';
import styles from './HeroCategory.module.css';

interface HeroCategoryProps {
    title: string;
    subtitle: string;
    imageUrl: string;
}

export default function HeroCategory({ title, subtitle, imageUrl }: HeroCategoryProps) {
    return (
        <section className={styles.hero}>
            <Image
                src={imageUrl}
                alt={title}
                fill
                className={styles.bgImage}
                priority
            />
            <div className={styles.overlay} />
            <div className={styles.content}>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.subtitle}>{subtitle}</p>
            </div>
        </section>
    );
}
