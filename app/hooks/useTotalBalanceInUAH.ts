'use client';

import { useMemo } from 'react';
import { Account } from '@/types/account';
import { calculateTotalBalanceInUAH } from '@/utils/currency-converter';
import { useExchangeRates } from '@/api/exchangeRate/queries';

export function useTotalBalanceInUAH(accounts: Account[] | undefined) {
  const {
    data: rates = {},
    isLoading: ratesLoading,
    error: ratesError,
  } = useExchangeRates();

  const { totalBalance, isLoading } = useMemo(() => {
    if (!accounts || ratesLoading) {
      return { totalBalance: 0, isLoading: true };
    }

    try {
      const balance = calculateTotalBalanceInUAH(accounts, rates);
      return { totalBalance: balance, isLoading: false };
    } catch (error) {
      console.error('Error calculating total balance:', error);
      return { totalBalance: 0, isLoading: false };
    }
  }, [accounts, rates, ratesLoading]);

  return {
    totalBalance,
    isLoading: ratesLoading || isLoading,
    error: ratesError ? (ratesError as Error).message : null,
  };
}
