"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CartItem = {
    cartItemId: string;
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
    selectedSize: string;
};

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    clearCart: () => void;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    cartTotal: number;
    calculateTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const storedCart = localStorage.getItem('Al-Urbans_cart');
        if (storedCart) {
            try {
                setItems(JSON.parse(storedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('Al-Urbans_cart', JSON.stringify(items));
        }
    }, [items, isMounted]);

    const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
        setItems(prev => {
            const existing = prev.find(item => item.cartItemId === newItem.cartItemId);
            if (existing) {
                return prev.map(item => item.cartItemId === newItem.cartItemId ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...newItem, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (cartItemId: string) => {
        setItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
    };

    const updateQuantity = (cartItemId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(cartItemId);
            return;
        }
        setItems(prev => prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity } : item));
    };

    const clearCart = () => {
        setItems([]);
    };

    const calculateTotal = () => items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartTotal = calculateTotal();

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, isCartOpen, setIsCartOpen, calculateTotal, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
