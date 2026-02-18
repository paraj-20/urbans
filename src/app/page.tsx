
import styles from "./page.module.css";
import Image from "next/image";

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.springTag}>SPRING / SUMMER 2026</div>
          <h1 className={styles.heroTitle}>
            URBANS:<br />
            <span className={styles.titleLine}>
              <span>DEFINING THE</span>
            </span>
            <span className={styles.titleLine}>
              <span className={styles.italicText}>CONCRETE</span>
            </span>
            <span className={styles.titleLine}>
              <span>SILHOUETTE</span>
            </span>
          </h1>

          <div className={styles.heroFooter}>
            <button className={styles.viewBtn}>
              VIEW COLLECTION
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            <p className={styles.heroDesc}>
              Luxury streetwear engineered for the modern metropolitan dweller.
              Fusing architectural precision with editorial vision.
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
          <div className={styles.categoryCard}>
            <div className={styles.categoryImage}></div>
            <div className={styles.categoryOverlay}>
              <h3>MEN</h3>
              <button>EXPLORE <span className="arrow">→</span></button>
            </div>
          </div>
          <div className={styles.categoryCard}>
            <div className={styles.categoryImage}></div>
            <div className={styles.categoryOverlay}>
              <h3>WOMEN</h3>
              <button>EXPLORE <span className="arrow">→</span></button>
            </div>
          </div>
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
