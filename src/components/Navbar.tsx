"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./navbar.module.css";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<null | 'MEN' | 'WOMEN'>(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleCategory = (category: 'MEN' | 'WOMEN') => {
        if (activeCategory === category) {
            setActiveCategory(null);
        } else {
            setActiveCategory(category);
        }
    };

    const megaMenuData = {
        MEN: {
            Clothing: ["Shirts", "T-shirts", "Jackets", "Pants", "Jeans"],
            Accessories: ["Caps", "Backpacks"]
        },
        WOMEN: {
            Clothing: ["T-shirts", "Tops", "Shorts", "Joggers & Track Pants", "Sweatshirts", "Jackets", "Pants", "Jeans"],
            Accessories: ["Caps", "Bags", "Gym Bags"]
        }
    };

    return (
        <nav className={styles.navbar} onMouseLeave={() => setActiveCategory(null)}>
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

                <Link href="/" className={styles.logo}>
                    <div className={styles.logoIcon}></div>
                    <span>URBANS</span>
                </Link>

                <div className={`${styles.navLinks} ${styles.desktopLinks}`}>
                    <button
                        className={styles.navLinkBtn}
                        onClick={() => toggleCategory('MEN')}
                        onMouseEnter={() => setActiveCategory('MEN')}
                    >
                        MEN
                    </button>
                    <button
                        className={styles.navLinkBtn}
                        onClick={() => toggleCategory('WOMEN')}
                        onMouseEnter={() => setActiveCategory('WOMEN')}
                    >
                        WOMEN
                    </button>
                    <Link href="/about">ABOUT</Link>
                    <Link href="/our-story">OUR STORY</Link>
                    <Link href="/blogs">BLOGS</Link>
                    <Link href="/contact">CONTACT US</Link>
                </div>
            </div>

            <div className={styles.navIcons}>
                <button className={styles.iconBtn} aria-label="Shopping Bag">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                </button>
                <button className={styles.loginBtn}>LOGIN</button>
            </div>

            {/* Mega Menu Overlay */}
            <div className={`${styles.megaMenu} ${activeCategory ? styles.active : ''}`}>
                {activeCategory && (
                    <div className={styles.megaMenuContent}>
                        {Object.entries(megaMenuData[activeCategory]).map(([section, items]) => (
                            <div key={section} className={styles.megaMenuSection}>
                                <h4 className={styles.megaMenuTitle}>{section}</h4>
                                <ul className={styles.megaMenuList}>
                                    {items.map((item) => (
                                        <li key={item}>
                                            <Link href="#">{item}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        {/* Optional Visual Column for aesthetics */}
                        <div className={styles.megaMenuVisual}>
                            <div className={styles.visualText}>
                                NEW ARRIVALS <br />
                                <span className={styles.accentText}>FW26 COLLECTION</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
                <div className={styles.mobileLinks}>
                    <button className={styles.mobileLinkBtn} onClick={() => toggleCategory('MEN')}>MEN</button>
                    {activeCategory === 'MEN' && (
                        <div className={styles.mobileSubmenu}>
                            {Object.entries(megaMenuData['MEN']).map(([section, items]) => (
                                <div key={section} className={styles.mobileSubmenuSection}>
                                    <h5 className={styles.mobileSubmenuTitle}>{section}</h5>
                                    {items.map(item => (
                                        <Link key={item} href="#" className={styles.mobileSubmenuItem} onClick={toggleMenu}>{item}</Link>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}

                    <button className={styles.mobileLinkBtn} onClick={() => toggleCategory('WOMEN')}>WOMEN</button>
                    {activeCategory === 'WOMEN' && (
                        <div className={styles.mobileSubmenu}>
                            {Object.entries(megaMenuData['WOMEN']).map(([section, items]) => (
                                <div key={section} className={styles.mobileSubmenuSection}>
                                    <h5 className={styles.mobileSubmenuTitle}>{section}</h5>
                                    {items.map(item => (
                                        <Link key={item} href="#" className={styles.mobileSubmenuItem} onClick={toggleMenu}>{item}</Link>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}

                    <Link href="/about" onClick={toggleMenu}>ABOUT</Link>
                    <Link href="/our-story" onClick={toggleMenu}>OUR STORY</Link>
                    <Link href="/blogs" onClick={toggleMenu}>BLOGS</Link>
                    <Link href="/contact" onClick={toggleMenu}>CONTACT US</Link>
                    <div className={styles.mobileAuth}>
                        <button className={styles.loginBtn}>LOGIN</button>
                        <button className={styles.iconBtn}>ACCOUNT</button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
