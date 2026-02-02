import { Transaction } from '@/(main layout)/transactions/types';

import { Account } from '@/(main layout)/accounts/types';

import { ExchangeRateMap } from '@/api/exchangeRate/queries';
import { convertToUAH } from '@/utils';

// calculates income and expenses statistics for the previous period relative to the current date.
export default function getPreviousPeriodStats(
  transactions: Transaction[],
  period: 'week' | 'month' | 'year' = 'month',
  accounts: Account[] = [],
  rates?: ExchangeRateMap,
) {
  const now = new Date();
  let startDate = new Date();
  let prevStartDate = new Date();

  if (period === 'week') {
    startDate.setDate(now.getDate() - now.getDay());
    prevStartDate.setDate(now.getDate() - now.getDay() - 7);
  } else if (period === 'month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  } else if (period === 'year') {
    startDate = new Date(now.getFullYear(), 0, 1);
    prevStartDate = new Date(now.getFullYear() - 1, 0, 1);
  }

  let prevEndDate = new Date(startDate);
  prevEndDate.setDate(prevEndDate.getDate() - 1);

  const getTransactionCurrency = (t: Transaction): string => {
    const accountCurrency = accounts.find(
      (a) => a.id === t.accountId,
    )?.currency;
    return (accountCurrency || t.currency || 'UAH').toString().toUpperCase();
  };

  const toUAH = (amount: number, currency: string) =>
    convertToUAH(amount, currency, rates);

  const previousPeriodTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= prevStartDate && transactionDate <= prevEndDate;
  });

  const previousIncome = previousPeriodTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => {
      const amount =
        typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
      const currency = getTransactionCurrency(t);
      const amountUAH = toUAH(isNaN(amount) ? 0 : amount, currency);
      return sum + amountUAH;
    }, 0);

  const previousExpenses = previousPeriodTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => {
      const amount =
        typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
      const currency = getTransactionCurrency(t);
      const amountUAH = toUAH(isNaN(amount) ? 0 : amount, currency);
      return sum + amountUAH;
    }, 0);

  return {
    income: previousIncome,
    expenses: previousExpenses,
  };
}

export function getPreviousMonthStats(
  transactions: Transaction[],
  accounts: Account[] = [],
  rates?: ExchangeRateMap,
) {
  return getPreviousPeriodStats(transactions, 'month', accounts, rates);
}
