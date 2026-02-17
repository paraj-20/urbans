"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={styles.page}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          {/* Hamburger Button (Mobile Only) */}
          <button className={styles.hamburgerBtn} onClick={toggleMenu} aria-label="Toggle Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>

          <div className={styles.logo}>
            <div className={styles.logoIcon}></div>
            <span>URBANS</span>
          </div>

          <div className={`${styles.navLinks} ${styles.desktopLinks}`}>
            <a href="#">SHOP</a>
            <a href="#">ABOUT</a>
            <a href="#">OUR STORY</a>
            <a href="#">BLOGS</a>
            <a href="#">CONTACT US</a>
          </div>
        </div>

        <div className={styles.navIcons}>
          <button className={styles.iconBtn} aria-label="Shopping Bag">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          </button>
          <button className={styles.loginBtn}>LOGIN</button>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
          <div className={styles.mobileLinks}>
            <a href="#" onClick={toggleMenu}>SHOP</a>
            <a href="#" onClick={toggleMenu}>ABOUT</a>
            <a href="#" onClick={toggleMenu}>OUR STORY</a>
            <a href="#" onClick={toggleMenu}>BLOGS</a>
            <a href="#" onClick={toggleMenu}>CONTACT US</a>
            <div className={styles.mobileAuth}>
              <button className={styles.loginBtn}>LOGIN</button>
              <button className={styles.iconBtn}>ACCOUNT</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          {/* Coordinates removed */}

          <div className={styles.springTag}>SPRING / SUMMER 2026</div>
          <h1 className={styles.heroTitle}>
            URBANS:<br />
            DEFINING THE<br />
            <span className={styles.italicText}>CONCRETE</span><br />
            SILHOUETTE
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
          {/* Image will be set via CSS background or Next/Image if generated */}
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

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerLogo}>
            <h2>URBANS</h2>
            <p>EST. 2024</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.linkColumn}>
              <h4>SHOP</h4>
              <a href="#">Men</a>
              <a href="#">Women</a>
              <a href="#">New Arrivals</a>
              <a href="#">Accessories</a>
            </div>
            <div className={styles.linkColumn}>
              <h4>SUPPORT</h4>
              <a href="#">FAQ</a>
              <a href="#">Shipping</a>
              <a href="#">Returns</a>
              <a href="#">Contact</a>
            </div>
            <div className={styles.linkColumn}>
              <h4>LEGAL</h4>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Accessibility</a>
            </div>
          </div>
          <div className={styles.newsletter}>
            <h4>STAY IN THE LOOP</h4>
            <div className={styles.inputGroup}>
              <input type="email" placeholder="ENTER YOUR EMAIL" />
              <button>→</button>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 URBANS. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}
