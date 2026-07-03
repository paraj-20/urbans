"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./navbar.module.css";
import { useCart } from "@/context/CartContext";
import { useAuth } from '@/context/AuthContext';
import { useCurrency, Currency } from "@/context/CurrencyContext";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<null | 'MEN' | 'WOMEN'>(null);
    const { items, setIsCartOpen } = useCart();
    const { user, logout } = useAuth();
    const { currency, setCurrency } = useCurrency();
    const router = useRouter();
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const [isHidden, setIsHidden] = useState(false);
    const lastScrollY = useRef(0);
    const hideTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (typeof window !== 'undefined') {
                const currentScrollY = window.scrollY;

                if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
                    // Scrolling down
                    if (!hideTimeout.current) {
                        hideTimeout.current = setTimeout(() => {
                            setIsHidden(true);
                        }, 2000);
                    }
                } else if (currentScrollY < lastScrollY.current) {
                    // Scrolling up
                    setIsHidden(false);
                    if (hideTimeout.current) {
                        clearTimeout(hideTimeout.current);
                        hideTimeout.current = null;
                    }
                }

                lastScrollY.current = currentScrollY;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (hideTimeout.current) {
                clearTimeout(hideTimeout.current);
            }
        };
    }, []);

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

    const handleCategoryClick = (category: 'MEN' | 'WOMEN') => {
        router.push(`/${category.toLowerCase()}`);
        setActiveCategory(null);
        setIsMenuOpen(false);
    };

    const handleSubLinkClick = (category: string, item: string) => {
        const hash = item.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
        router.push(`/${category.toLowerCase()}#${hash}`);
        setActiveCategory(null);
        setIsMenuOpen(false);
    };

    const handleLogout = async () => {
        await logout();
        setIsUserDropdownOpen(false);
        router.push('/');
    };

    const megaMenuData = {
        MEN: {
            Clothing: ["Shirts", "T-shirts", "Jackets", "Pants", "Jeans", "Aesthetics"],
            Accessories: ["Caps", "Backpacks"]
        },
        WOMEN: {
            Clothing: ["Shirts", "T-shirts", "Jackets", "Pants", "Jeans", "Aesthetics"],
            Accessories: ["Caps", "Backpacks"]
        }
    };

    return (
        <nav className={`${styles.navbar} ${isHidden ? styles.hidden : ''}`} onMouseLeave={() => { setActiveCategory(null); setIsUserDropdownOpen(false) }}>
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

                <Link href="/" className={`${styles.logo} ${styles.desktopLogo}`}>
                    <div className={styles.logoIcon}></div>
                    <span>Al-Urbans</span>
                </Link>

                <div className={`${styles.navLinks} ${styles.desktopLinks}`}>
                    <button
                        className={styles.navLinkBtn}
                        onClick={() => handleCategoryClick('MEN')}
                        onMouseEnter={() => setActiveCategory('MEN')}
                    >
                        MEN
                    </button>
                    <button
                        className={styles.navLinkBtn}
                        onClick={() => handleCategoryClick('WOMEN')}
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

            {/* Mobile Centered Logo */}
            <Link href="/" className={`${styles.logo} ${styles.mobileLogo}`}>
                <div className={styles.logoIcon}></div>
                <span>Al-Urbans</span>
            </Link>

            <div className={styles.navIcons}>
                <div className={`${styles.currencyToggle} ${styles.desktopCurrency}`}>
                    <button
                        className={`${styles.currencyBtn} ${currency === 'USD' ? styles.activeCurrency : ''}`}
                        onClick={() => setCurrency('USD')}
                    >
                        $
                    </button>
                    <button
                        className={`${styles.currencyBtn} ${currency === 'INR' ? styles.activeCurrency : ''}`}
                        onClick={() => setCurrency('INR')}
                    >
                        ₹
                    </button>
                </div>
                <button className={styles.iconBtn} aria-label="Shopping Bag" onClick={() => setIsCartOpen(true)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    {items.length > 0 && (
                        <span className={styles.cartBadge}>{items.reduce((acc, item) => acc + item.quantity, 0)}</span>
                    )}
                </button>
                {user ? (
                    <div
                        className={styles.userMenuContainer}
                        onMouseEnter={() => setIsUserDropdownOpen(true)}
                        onMouseLeave={() => setIsUserDropdownOpen(false)}
                    >
                        <button className={styles.loginBtn} onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}>
                            {user.name.toUpperCase()}
                        </button>
                        {isUserDropdownOpen && (
                            <div className={styles.userDropdown}>
                                <div className={styles.userGreeting}>HI, {user.name.split(' ')[0].toUpperCase()}</div>
                                <Link href="/settings" className={styles.userDropdownLink} onClick={() => setIsUserDropdownOpen(false)}>SETTINGS</Link>
                                <button className={styles.userDropdownBtn} onClick={handleLogout}>LOGOUT</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link href="/login" className={styles.loginBtn}>LOGIN</Link>
                )}
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
                                            <button className={styles.navSublinkBtn} onClick={() => handleSubLinkClick(activeCategory, item)}>
                                                {item}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
                <div className={styles.mobileLinks}>
                    <button className={`${styles.mobileLinkBtn} ${activeCategory === 'MEN' ? styles.active : ''}`} onClick={() => toggleCategory('MEN')}>MEN</button>
                    {activeCategory === 'MEN' && (
                        <div className={styles.mobileSubmenu}>
                            <div className={styles.mobileSubmenuSection}>
                                <button className={styles.mobileSubmenuItem} onClick={() => handleCategoryClick('MEN')} style={{ fontWeight: 700, color: '#fff' }}>
                                    All Men
                                </button>
                            </div>
                            {Object.entries(megaMenuData['MEN']).map(([section, items]) => (
                                <div key={section} className={styles.mobileSubmenuSection}>
                                    <h5 className={styles.mobileSubmenuTitle}>{section}</h5>
                                    {items.map(item => (
                                        <button key={item} className={styles.mobileSubmenuItem} onClick={() => handleSubLinkClick('MEN', item)}>
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}

                    <button className={`${styles.mobileLinkBtn} ${activeCategory === 'WOMEN' ? styles.active : ''}`} onClick={() => toggleCategory('WOMEN')}>WOMEN</button>
                    {activeCategory === 'WOMEN' && (
                        <div className={styles.mobileSubmenu}>
                            <div className={styles.mobileSubmenuSection}>
                                <button className={styles.mobileSubmenuItem} onClick={() => handleCategoryClick('WOMEN')} style={{ fontWeight: 700, color: '#fff' }}>
                                    All Women
                                </button>
                            </div>
                            {Object.entries(megaMenuData['WOMEN']).map(([section, items]) => (
                                <div key={section} className={styles.mobileSubmenuSection}>
                                    <h5 className={styles.mobileSubmenuTitle}>{section}</h5>
                                    {items.map(item => (
                                        <button key={item} className={styles.mobileSubmenuItem} onClick={() => handleSubLinkClick('WOMEN', item)}>
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}

                    <Link href="/about" onClick={toggleMenu}>ABOUT</Link>
                    <Link href="/our-story" onClick={toggleMenu}>OUR STORY</Link>
                    <Link href="/blogs" onClick={toggleMenu}>BLOGS</Link>
                    <Link href="/contact" onClick={toggleMenu}>CONTACT US</Link>
                    
                    <div className={`${styles.currencyToggle} ${styles.mobileCurrency}`}>
                        <button
                            className={`${styles.currencyBtn} ${currency === 'USD' ? styles.activeCurrency : ''}`}
                            onClick={() => { setCurrency('USD'); setIsMenuOpen(false); }}
                        >
                            USD ($)
                        </button>
                        <button
                            className={`${styles.currencyBtn} ${currency === 'INR' ? styles.activeCurrency : ''}`}
                            onClick={() => { setCurrency('INR'); setIsMenuOpen(false); }}
                        >
                            INR (₹)
                        </button>
                    </div>

                    <div className={styles.mobileAuth}>
                        {user ? (
                            <>
                                <Link
                                    href="/settings"
                                    className={styles.loginBtn}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    SETTINGS
                                </Link>
                                <button
                                    className={styles.userDropdownBtn}
                                    onClick={handleLogout}
                                >
                                    LOGOUT
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className={styles.loginBtn}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                LOGIN
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
