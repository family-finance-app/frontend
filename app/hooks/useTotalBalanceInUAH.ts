'use client';

import { Account } from '@/(main layout)/accounts/types';

import { calculateTotalBalanceInUAH } from '@/utils';

import { useMainData } from '@/(main layout)/data/MainDataProvider';

export function useTotalBalanceInUAH(accounts: Account[]) {
  const { exchangeRates, isLoading } = useMainData();

  try {
    const balance = calculateTotalBalanceInUAH(accounts, exchangeRates);
    return {
      totalBalance: balance,
      isLoading: isLoading || !exchangeRates,
      error: null,
    };
  } catch (error) {
    return {
      totalBalance: 0,
      isLoading: isLoading,
      error: (error as Error).message,
    };
  }
}
