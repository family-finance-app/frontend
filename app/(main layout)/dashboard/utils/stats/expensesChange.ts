import { Transaction } from '@/(main layout)/transactions/types';
import previousPeriodStats from './previousPeriodStats';
import { formatCurrencyAmount } from '@/utils/formatters';

// calculates expenses change in absolute values per periods for dashboard stats section (example: +2000 vs last month); pervious period data is being calculated in getPreviousPeriodStats function
export default function calculateExpensesChange(
  currentExpenses: number,
  transactions: Transaction[],
  period: 'week' | 'month' | 'year' = 'month'
): {
  value: number;
  type: 'positive' | 'negative' | 'neutral';
  displayValue: string;
} {
  const previousStats = previousPeriodStats(transactions, period);
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
