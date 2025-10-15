import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const CurrencyContext = createContext();

export const useCurrency = () => {
  return useContext(CurrencyContext);
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD');
  const [rate, setRate] = useState(1); // USD -> USD default
  const [baseCurrency, setBaseCurrency] = useState('USD'); // assume prices stored in USD

  useEffect(() => {
    // Load currency preference from localStorage
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
    const savedRate = localStorage.getItem('fx_rate');
    const savedRateTo = localStorage.getItem('fx_rate_to');
    const savedFetchedAt = localStorage.getItem('fx_rate_fetched');
    if (savedRate && savedRateTo && savedFetchedAt && Date.now() - Number(savedFetchedAt) < 24*60*60*1000) {
      setRate(Number(savedRate));
    }
  }, []);

  const fetchRate = useCallback(async (from, to) => {
    if (from === to) return 1;
    const res = await axios.get(`/api/currency/rate`, { params: { from, to } });
    const r = Number(res.data?.rate || 1);
    localStorage.setItem('fx_rate', String(r));
    localStorage.setItem('fx_rate_to', to);
    localStorage.setItem('fx_rate_fetched', String(res.data?.fetchedAt || Date.now()));
    setRate(r);
    return r;
  }, []);

  const updateCurrency = async (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
    const to = newCurrency;
    const from = baseCurrency;
    try {
      await fetchRate(from, to);
    } catch (e) {
      // fallback: keep existing rate
    }
  };

  // Format currency based on selected currency
  const formatCurrency = useCallback((amount) => {
    const value = currency === baseCurrency ? amount : amount * rate;
    const options = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    if (currency === 'INR') {
      return `₹${Number(value || 0).toLocaleString('en-IN', options)}`;
    }
    return `$${Number(value || 0).toLocaleString('en-US', options)}`;
  }, [currency, rate, baseCurrency]);

  const convert = useCallback((amount, from = baseCurrency, to = currency) => {
    if (from === to) return amount;
    if (from === baseCurrency && to === currency) return amount * rate;
    // If asked different path, try invert
    if (from === currency && to === baseCurrency && rate) return amount / rate;
    return amount;
  }, [currency, rate, baseCurrency]);

  const value = {
    currency,
    updateCurrency,
    formatCurrency,
    convert,
    rate,
    baseCurrency,
    setBaseCurrency
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};