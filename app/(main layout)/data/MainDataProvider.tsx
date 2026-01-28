'use client';

import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { useMyAccounts } from '@/api/accounts/queries';
import { useTransactions } from '@/api/transactions/queries';
import { useCategories } from '@/api/categories/queries';
import { useExchangeRates } from '@/api/exchangeRate/queries';

interface MainDataContextValue {
  accounts: ReturnType<typeof useMyAccounts>['accounts'];
  transactions: ReturnType<typeof useTransactions>['transactions'];
  categories: ReturnType<typeof useCategories>['categories'];
  exchangeRates: ReturnType<typeof useExchangeRates>['exchangeRates'];
  exchangeRatesUpdatedAt: ReturnType<typeof useExchangeRates>['lastUpdated'];
  isLoading: boolean;
  isError: boolean;
}

const MainDataContext = createContext<MainDataContextValue | undefined>(
  undefined,
);

export function MainDataProvider({ children }: { children: React.ReactNode }) {
  const accountsQuery = useMyAccounts();
  const transactionsQuery = useTransactions();
  const categoriesQuery = useCategories();
  const exchangeRatesQuery = useExchangeRates();

  useEffect(() => {}, [
    accountsQuery.accounts,
    accountsQuery.isLoading,
    accountsQuery.isFetching,
    accountsQuery.isError,
    transactionsQuery.transactions,
    transactionsQuery.isLoading,
    transactionsQuery.isFetching,
    transactionsQuery.isError,
    categoriesQuery.categories,
    categoriesQuery.isLoading,
    categoriesQuery.isFetching,
    categoriesQuery.isError,
    exchangeRatesQuery.exchangeRates,
    exchangeRatesQuery.isLoading,
    exchangeRatesQuery.isFetching,
    exchangeRatesQuery.isError,
  ]);

  const value = useMemo<MainDataContextValue>(() => {
    const isLoading =
      accountsQuery.isLoading ||
      transactionsQuery.isLoading ||
      categoriesQuery.isLoading ||
      exchangeRatesQuery.isLoading;

    const isError =
      accountsQuery.isError ||
      transactionsQuery.isError ||
      categoriesQuery.isError ||
      exchangeRatesQuery.isError;

    return {
      accounts: accountsQuery.accounts,
      transactions: transactionsQuery.transactions,
      categories: categoriesQuery.categories,
      exchangeRates: exchangeRatesQuery.exchangeRates,
      exchangeRatesUpdatedAt: exchangeRatesQuery.lastUpdated,
      isLoading,
      isError,
    };
  }, [
    accountsQuery.accounts,
    accountsQuery.isLoading,
    accountsQuery.isError,
    categoriesQuery.categories,
    categoriesQuery.isLoading,
    categoriesQuery.isError,
    exchangeRatesQuery.exchangeRates,
    exchangeRatesQuery.lastUpdated,
    exchangeRatesQuery.isLoading,
    exchangeRatesQuery.isError,
    transactionsQuery.transactions,
    transactionsQuery.isLoading,
    transactionsQuery.isError,
  ]);

  return (
    <MainDataContext.Provider value={value}>
      {children}
    </MainDataContext.Provider>
  );
}

export function useMainData() {
  const context = useContext(MainDataContext);
  if (!context) {
    throw new Error('useMainData must be used within MainDataProvider');
  }
  return context;
}
