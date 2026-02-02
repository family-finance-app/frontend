import { Transaction } from '@/(main layout)/transactions/types';

import { Account } from '@/(main layout)/accounts/types';

import { ExchangeRateMap } from '@/api/exchangeRate/queries';
import { convertToUAH } from '@/utils';

// utility for dashboard stats section that calculates income, expenses, and savings for the chosen period with change rate
export default function calculatePeriodStats(
  transactions: Transaction[],
  period: 'week' | 'month' | 'year' = 'month',
  accounts: Account[],
  rates?: ExchangeRateMap,
) {
  const now = new Date();
  let startDate = new Date();

  if (period === 'week') {
    startDate.setDate(now.getDate() - now.getDay());
  } else if (period === 'month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (period === 'year') {
    startDate = new Date(now.getFullYear(), 0, 1);
  }

  const getTransactionCurrency = (t: Transaction): string => {
    const accountCurrency = accounts.find(
      (a) => a.id === t.accountId,
    )?.currency;
    return (accountCurrency || t.currency || 'UAH').toString().toUpperCase();
  };

  const toUAH = (amount: number, currency: string) =>
    convertToUAH(amount, currency, rates);

  const periodTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= now;
  });

  const income = periodTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => {
      const amount =
        typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
      const currency = getTransactionCurrency(t);
      const amountUAH = toUAH(isNaN(amount) ? 0 : amount, currency);
      return sum + amountUAH;
    }, 0);

  const expenses = periodTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => {
      const amount =
        typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
      const currency = getTransactionCurrency(t);
      const amountUAH = toUAH(isNaN(amount) ? 0 : amount, currency);
      return sum + amountUAH;
    }, 0);

  const savingsAccounts = accounts
    .filter((a) => a.type === 'SAVINGS')
    .map((a) => a.id);

  const savingsInflows = periodTransactions
    .filter(
      (t) =>
        typeof t.accountRecipientId === 'number' &&
        savingsAccounts.includes(t.accountRecipientId),
    )
    .reduce((sum, t) => {
      const amount =
        typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
      const currency = getTransactionCurrency(t);
      const amountUAH = toUAH(isNaN(amount) ? 0 : amount, currency);
      return sum + amountUAH;
    }, 0);

  // outflows: любые списания с savings-счетов
  const savingsOutflows = periodTransactions
    .filter(
      (t) =>
        typeof t.accountId === 'number' &&
        savingsAccounts.includes(t.accountId),
    )
    .reduce((sum, t) => {
      const amount =
        typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
      const currency = getTransactionCurrency(t);
      const amountUAH = toUAH(isNaN(amount) ? 0 : amount, currency);
      return sum + amountUAH;
    }, 0);

  const savings = savingsInflows - savingsOutflows;

  const savingsRate = income > 0 ? (savings / income) * 100 : 0;

  const inflowTx = periodTransactions.filter(
    (t) =>
      typeof t.accountRecipientId === 'number' &&
      savingsAccounts.includes(t.accountRecipientId),
  );
  const outflowTx = periodTransactions.filter(
    (t) =>
      typeof t.accountId === 'number' && savingsAccounts.includes(t.accountId),
  );

  return {
    income,
    expenses,
    netAmount: income - expenses,
    savings,
    savingsRate: savingsRate,
    savingsPercentage: savingsRate,
    changeType:
      income - expenses >= 0 ? ('positive' as const) : ('negative' as const),
    transactionsCount: periodTransactions.length,
  };
}
