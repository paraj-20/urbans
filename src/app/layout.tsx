import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  metadataBase: new URL('https://urbans-clothing.vercel.app'), // Update with actual URL
  title: {
    default: "URBANS | Defining the Concrete Silhouette",
    template: "%s | URBANS",
  },
  description: "Luxury streetwear engineered for the modern metropolitan dweller. High-quality sustainable fabrics and forward-thinking silhouettes.",
  keywords: ["streetwear", "luxury", "urban fashion", "sustainable clothing", "tech-wear", "metropolitan style"],
  authors: [{ name: "URBANS Design Team" }],
  creator: "URBANS",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://urbans-clothing.vercel.app",
    title: "URBANS | Defining the Concrete Silhouette",
    description: "Luxury streetwear engineered for the modern metropolitan dweller.",
    siteName: "URBANS",
    images: [{
      url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&h=630&auto=format&fit=crop", // Add a fallback og:image
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "URBANS | Defining the Concrete Silhouette",
    description: "Luxury streetwear engineered for the modern metropolitan dweller.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <main style={{ minHeight: 'calc(100vh - 400px)' }}>
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
