import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div style={{ height: "15vh" }}></div>
          <div className={styles.springTag}>THE RISE</div>
          <h1 className={styles.heroTitle} style={{ marginBottom: "0.5rem" }}>
            URBANS:<br />
            <span className={styles.titleLine}>
              <span>BUILT FOR THE BOLD</span>
            </span>
          </h1>

          <div className={styles.heroFooter} style={{ marginTop: 0 }}>
            <button className={styles.viewBtn}>
              VIEW COLLECTION
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            <p className={styles.heroDesc}>
              Crafted for the rhythm of the city. Sharp silhouettes, elevated essentials, and unapologetic confidence.
            </p>
          </div>
        </div>

        {/* Hero Background Image (Right Side) */}
        <div className={styles.heroImageOverlay}>
          {/* Image will be set via CSS background */}
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categories}>
        <h2 className={styles.sectionTitle}>SHOP BY CATEGORY</h2>
        <div className={styles.categoryGrid}>
          <Link href="/men" className={styles.categoryCard} style={{ display: 'block' }}>
            <div className={styles.categoryImage}></div>
            <div className={styles.categoryOverlay}>
              <h3>MEN</h3>
              <div className={styles.exploreBtn}>EXPLORE <span className="arrow">→</span></div>
            </div>
          </Link>
          <Link href="/women" className={styles.categoryCard} style={{ display: 'block' }}>
            <div className={styles.categoryImage}></div>
            <div className={styles.categoryOverlay}>
              <h3>WOMEN</h3>
              <div className={styles.exploreBtn}>EXPLORE <span className="arrow">→</span></div>
            </div>
          </Link>
        </div>
      </section>

      {/* Product Lines */}
      <section className={styles.productLines}>
        <div className={styles.tickerWrapper}>
          <div className={styles.ticker}>
            <span>URBANS ESSENTIALS — PREMIUM COTTON — CONSTRUCTED DENIM — HEADWEAR — </span>
            <span>URBANS ESSENTIALS — PREMIUM COTTON — CONSTRUCTED DENIM — HEADWEAR — </span>
          </div>
        </div>

        <div className={styles.linesGrid}>
          <div className={styles.lineItem}>
            <div className={styles.lineImage}></div>
            <h4>T-SHIRTS</h4>
            <p>Heavyweight cotton basics</p>
          </div>
          <div className={styles.lineItem}>
            <div className={styles.lineImage}></div>
            <h4>SHIRTS</h4>
            <p>Oversized structured fits</p>
          </div>
          <div className={styles.lineItem}>
            <div className={styles.lineImage}></div>
            <h4>DENIM</h4>
            <p>Japanese selvedge & raw</p>
          </div>
          <div className={styles.lineItem}>
            <div className={styles.lineImage}></div>
            <h4>ACCESSORIES</h4>
            <p>Caps & utility gear</p>
          </div>
        </div>
      </section>

      {/* Brand Statement / About */}
      <section className={styles.brandStatement}>
        <div className={styles.statementContent}>
          <h2>WE BUILD UNIFORMS FOR THE <br /> <span className={styles.accentText}>CITY THAT NEVER SLEEPS</span></h2>
          <p>
            Born in the streets, refined in the studio. URBANS represents the intersection
            of utility and luxury. Every thread is selected for durability, every cut
            made for movement. We don't just sell clothes; we architect your daily armor.
          </p>
          <button className={styles.readStoryBtn}>OUR STORY</button>
        </div>
      </section>
    </div>
  );
}
