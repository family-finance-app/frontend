import { DashboardChartDataProps } from '../../types';
import { PeriodType } from '@/types/utilities';
import {
  Transaction,
  TransactionType,
} from '@/(main layout)/transactions/types';
import { Account } from '@/(main layout)/accounts/types';

// calculate total savings balance per priod for last three periods (cumulative balance of all SAVINGS accounts at end of each period)
export default function getPeriodSavingsComparison(
  transactions: Transaction[],
  accounts: Account[] = [],
  period: PeriodType = 'month'
): DashboardChartDataProps[] {
  const now = new Date();

  const savingsAccountIds = accounts
    .filter((a) => a.type === 'SAVINGS')
    .map((a) => a.id);

  const results: DashboardChartDataProps[] = [];

  const calculatePeriodSavings = (startDate: Date, endDate: Date): number => {
    const periodTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    const savingsInflows = periodTransactions
      .filter(
        (t) =>
          t.type === TransactionType.TRANSFER && t.category?.name === 'Savings'
      )
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const savingsOutflows = periodTransactions
      .filter(
        (t) =>
          t.type === TransactionType.EXPENSE &&
          savingsAccountIds.includes(t.accountId)
      )
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return savingsInflows - savingsOutflows;
  };

  const getPeriodLabel = (
    start: Date,
    end: Date,
    periodType: PeriodType
  ): string => {
    if (periodType === 'week') {
      return start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } else if (periodType === 'month') {
      return start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } else {
      return `${start.getFullYear()}`;
    }
  };

  for (let i = 2; i >= 0; i--) {
    let periodStart: Date;
    let periodEnd: Date;
    let label: string;

    if (period === 'week') {
      const weeksAgo = i;
      const currentDay = now.getDay();
      const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;

      periodStart = new Date(now);
      periodStart.setDate(now.getDate() - daysFromMonday - weeksAgo * 7);
      periodStart.setHours(0, 0, 0, 0);

      periodEnd = new Date(periodStart);
      periodEnd.setDate(periodStart.getDate() + 6);
      periodEnd.setHours(23, 59, 59, 999);

      label =
        i === 0
          ? `This week (${periodStart.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })})`
          : `${weeksAgo} week${
              weeksAgo > 1 ? 's' : ''
            } ago (${periodStart.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })})`;
    } else if (period === 'month') {
      const monthsAgo = i;
      periodStart = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
      periodEnd = new Date(
        periodStart.getFullYear(),
        periodStart.getMonth() + 1,
        0
      );
      periodEnd.setHours(23, 59, 59, 999);

      label =
        i === 0
          ? `${periodStart.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}`
          : periodStart.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });
    } else {
      const yearsAgo = i;
      periodStart = new Date(now.getFullYear() - yearsAgo, 0, 1);
      periodEnd = new Date(now.getFullYear() - yearsAgo, 11, 31);
      periodEnd.setHours(23, 59, 59, 999);

      label =
        i === 0
          ? `${periodStart.getFullYear()}`
          : `${periodStart.getFullYear()}`;
    }

    const savings = calculatePeriodSavings(periodStart, periodEnd);

    results.push({
      date: label,
      amount: Math.round(savings * 100) / 100,
    });
  }

  return results;
}
