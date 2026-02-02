import { DashboardChartDataProps, PeriodType } from '../../types';

import {
  Transaction,
  TransactionType,
} from '@/(main layout)/transactions/types';

import { Account } from '@/(main layout)/accounts/types';

import { ExchangeRateMap } from '@/api/exchangeRate/queries';
import { convertToUAH } from '@/utils';

// calculate total expenses per period for last three periods for dashboard stats expense section chart
export default function getPeriodExpenseComparison(
  transactions: Transaction[],
  period: PeriodType = 'month',
  rates: ExchangeRateMap | undefined,
  accounts: Account[] = [],
): DashboardChartDataProps[] {
  const now = new Date();
  const expenseTransactions = transactions.filter(
    (t) => t.type === TransactionType.EXPENSE,
  );

  const results: DashboardChartDataProps[] = [];

  const getTransactionCurrency = (t: Transaction): string => {
    const accountCurrency = accounts.find(
      (a) => a.id === t.accountId,
    )?.currency;
    return (accountCurrency || t.currency || 'UAH').toString().toUpperCase();
  };

  const calculatePeriodExpense = (startDate: Date, endDate: Date): number => {
    return expenseTransactions
      .filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      })
      .reduce((sum, t) => {
        const amountUAH = convertToUAH(
          Number(t.amount),
          getTransactionCurrency(t),
          rates,
        );
        return sum + amountUAH;
      }, 0);
  };

  const getPeriodLabel = (
    start: Date,
    end: Date,
    periodType: PeriodType,
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
        0,
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

    const expense = calculatePeriodExpense(periodStart, periodEnd);
    results.push({
      date: label,
      amount: Math.round(expense * 100) / 100,
    });
  }

  return results;
}
