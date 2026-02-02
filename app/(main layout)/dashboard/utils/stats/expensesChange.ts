import { Transaction } from '@/(main layout)/transactions/types';

import { Account } from '@/(main layout)/accounts/types';

import { ExchangeRateMap } from '@/api/exchangeRate/queries';

import previousPeriodStats from './previousPeriodStats';

import { formatCurrencyAmount } from '@/utils';

// calculates expenses change in absolute values per periods for dashboard stats section (example: +2000 vs last month); pervious period data is being calculated in getPreviousPeriodStats function
export default function calculateExpensesChange(
  currentExpenses: number,
  transactions: Transaction[],
  period: 'week' | 'month' | 'year' = 'month',
  accounts: Account[] = [],
  rates?: ExchangeRateMap
): {
  value: number;
  type: 'positive' | 'negative' | 'neutral';
  displayValue: string;
} {
  const previousStats = previousPeriodStats(
    transactions,
    period,
    accounts,
    rates
  );
  const change = currentExpenses - previousStats.expenses;
  const absoluteChange = Math.abs(change);

  return {
    value: absoluteChange,
    type: change < 0 ? 'positive' : change > 0 ? 'negative' : 'neutral',
    displayValue:
      change > 0
        ? `+${formatCurrencyAmount(absoluteChange)}`
        : change < 0
          ? `-${formatCurrencyAmount(absoluteChange)}`
          : '0.00',
  };
}
