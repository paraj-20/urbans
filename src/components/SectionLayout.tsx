import styles from './SectionLayout.module.css';

interface SectionLayoutProps {
    id: string;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export default function SectionLayout({ id, title, subtitle, children }: SectionLayoutProps) {
    return (
        <section id={id} className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                </div>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </section>
    );
}
