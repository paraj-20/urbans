
import styles from './about.module.css';

export default function About() {
    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <div className={styles.heroOverlay}></div>
                <h1 className={styles.heroTitle}>WE ARE <br /> URBANS</h1>
            </section>

            {/* Intro Stats */}
            <section className={styles.statsSection}>
                <div className={styles.statItem}>
                    <div className={styles.statNumber}>EST. 2018</div>
                    <div className={styles.statLabel}>FOUNDED IN NYC</div>
                </div>
                <div className={styles.statItem}>
                    <div className={styles.statNumber}>50+</div>
                    <div className={styles.statLabel}>COUNTRIES SERVED</div>
                </div>
                <div className={styles.statItem}>
                    <div className={styles.statNumber}>100%</div>
                    <div className={styles.statLabel}>SUSTAINABLE FABRICS</div>
                </div>
            </section>

            <section className={styles.mission}>
                <h2>MISSION STATEMENT</h2>
                <p>
                    URBANS is a global fashion house built on the foundation of urban culture and contemporary design.
                    We bridge the gap between high fashion and everyday utility, creating pieces that empower
                    the individual to express their unique identity in the concrete jungle.
                </p>
            </section>

            <section className={styles.values}>
                <h3 className={styles.sectionTitle}>OUR CORE VALUES</h3>
                <div className={styles.valuesGrid}>
                    <div className={styles.valueCard}>
                        <span className={styles.valueIcon}>🏆</span>
                        <h3>QUALITY</h3>
                        <p>Every stitch matters. We source premium fabrics and employ meticulous construction techniques to ensure longevity.</p>
                    </div>
                    <div className={styles.valueCard}>
                        <span className={styles.valueIcon}>⚡</span>
                        <h3>INNOVATION</h3>
                        <p>Pushing boundaries with avant-garde silhouettes and functional materials designed for modern life.</p>
                    </div>
                    <div className={styles.valueCard}>
                        <span className={styles.valueIcon}>🌍</span>
                        <h3>SUSTAINABILITY</h3>
                        <p>Committed to ethical production and sustainable practices, reducing our footprint one collection at a time.</p>
                    </div>
                </div>
            </section>

            <section className={styles.team}>
                <h3 className={styles.sectionTitle}>THE CREATIVES</h3>
                <div className={styles.teamGrid}>
                    {[
                        { name: "ALEX RIVERA", role: "Creative Director", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop" },
                        { name: "SARAH CHEN", role: "Head of Design", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&auto=format&fit=crop" },
                        { name: "MARCUS JOHNSON", role: "Brand Strategist", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop" },
                        { name: "ELENA RODRIGUEZ", role: "Lead Stylist", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop" }
                    ].map((member) => (
                        <div key={member.name} className={styles.memberCard}>
                            <div className={styles.memberImage}>
                                <img src={member.img} alt={member.name} />
                                <div className={styles.socialOverlay}>
                                    <span>LINKEDIN</span>
                                </div>
                            </div>
                            <h4>{member.name}</h4>
                            <p>{member.role}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Join Us CTA */}
            <section className={styles.ctaSection}>
                <h2>JOIN THE MOVEMENT</h2>
                <p>We are always looking for visionary talent to join our team.</p>
                <button className={styles.ctaBtn}>VIEW CAREERS</button>
            </section>
        </div>
    );
}
