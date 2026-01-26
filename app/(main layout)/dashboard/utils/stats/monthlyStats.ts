import { Transaction } from '@/(main layout)/transactions/types';

import { Account } from '@/(main layout)/accounts/types';

import { ExchangeRateMap } from '@/api/exchangeRate/queries';

import { periodStats } from '..';

export default function calculateMonthlyStats(
  transactions: Transaction[],
  accounts: Account[],
  rates?: ExchangeRateMap
) {
  return periodStats(transactions, 'month', accounts, rates);
}
