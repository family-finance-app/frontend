'use client';

import { Account } from '@/(main layout)/accounts/types';

import { calculateTotalBalanceInUAH } from '@/utils';

import { useExchangeRates } from '@/api/exchangeRate/queries';

export function useTotalBalanceInUAH(accounts: Account[]) {
  const {
    exchangeRates,
    isLoading: exchangeRatesLoading,
    isError,
  } = useExchangeRates();

  try {
    const balance = calculateTotalBalanceInUAH(accounts, exchangeRates);
    return {
      totalBalance: balance,
      isLoading: exchangeRatesLoading,
      error: null,
    };
  } catch (error) {
    return {
      totalBalance: 0,
      isLoading: exchangeRatesLoading,
      error: (error as Error).message,
    };
  }
}
