"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'USD' | 'INR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (priceInUSD: number) => string;
  convertPrice: (priceInUSD: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [inrRate, setInrRate] = useState<number>(83.5); // Fallback rate

  useEffect(() => {
    // Check local storage for preference
    const savedCurrency = localStorage.getItem('preferred_currency') as Currency;
    if (savedCurrency === 'USD' || savedCurrency === 'INR') {
      setCurrency(savedCurrency);
    }

    // Fetch real-time rate
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates.INR) {
          setInrRate(data.rates.INR);
        }
      })
      .catch(err => console.error("Failed to fetch exchange rate", err));
  }, []);

  const handleSetCurrency = (c: Currency) => {
    setCurrency(c);
    localStorage.setItem('preferred_currency', c);
  };

  const formatPrice = (priceInUSD: number) => {
    if (currency === 'INR') {
      const converted = priceInUSD * inrRate;
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(converted);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(priceInUSD);
    }
  };

  const convertPrice = (priceInUSD: number) => {
    return currency === 'INR' ? priceInUSD * inrRate : priceInUSD;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
