import { Transaction } from '@/(main layout)/transactions/types';

import { Account } from '@/(main layout)/accounts/types';

import { Category } from '@/(main layout)/transactions/types';

import { ExchangeRateMap } from '@/api/exchangeRate/queries';
import { convertToUAH, calculateTotalBalanceInUAH } from '@/utils';

const resolveCurrency = (
  transaction: Transaction,
  accounts: Account[],
): string => {
  const accountCurrency = accounts.find(
    (a) => a.id === transaction.accountId,
  )?.currency;

  return (accountCurrency || transaction.currency || 'UAH')
    .toString()
    .toUpperCase();
};

// FOR CHARTS DATA

// calculates total expenses by category for analytics donut chart
export function calculateExpensesByCategory(
  transactions: Transaction[],
  categories: Category[],
  accounts: Account[] = [],
  rates?: ExchangeRateMap,
) {
  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === 'EXPENSE',
  );

  if (expenseTransactions.length === 0) return [];

  const expenseByCategory = expenseTransactions
    .reduce(
      (acc, transaction) => {
        const category = categories.find(
          (cat) => cat.id === transaction.categoryId,
        );
        const categoryName = category?.name || 'Other';
        const amount =
          typeof transaction.amount === 'string'
            ? parseFloat(transaction.amount)
            : transaction.amount;
        const currency = resolveCurrency(transaction, accounts);
        const amountUAH = convertToUAH(
          isNaN(amount) ? 0 : amount,
          currency,
          rates,
        );
        const existingCategory = acc.find((item) => item.name === categoryName);

        if (existingCategory) existingCategory.amount += amountUAH;
        else acc.push({ name: categoryName, amount: amountUAH });

        return acc;
      },
      [] as Array<{ name: string; amount: number }>,
    )
    .sort((a, b) => b.amount - a.amount);

  const totalExpenses = expenseByCategory.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  return expenseByCategory.map((item) => ({
    name: item.name,
    rate: Math.round((item.amount / totalExpenses) * 100 * 10) / 10,
  }));
}

// calculates total income stats by category for analytics (donut chart)
export function calculateIncomeByCategory(
  transactions: Transaction[],
  categories: Category[],
  accounts: Account[] = [],
  rates?: ExchangeRateMap,
) {
  const incomeTransactions = transactions.filter(
    (transaction) => transaction.type === 'INCOME',
  );

  if (incomeTransactions.length === 0) return [];

  const incomeByCategory = incomeTransactions
    .reduce(
      (acc, transaction) => {
        const category = categories.find(
          (cat) => cat.id === transaction.categoryId,
        );
        const categoryName = category?.name || 'Other';
        const amount =
          typeof transaction.amount === 'string'
            ? parseFloat(transaction.amount)
            : transaction.amount;
        const currency = resolveCurrency(transaction, accounts);
        const amountUAH = convertToUAH(
          isNaN(amount) ? 0 : amount,
          currency,
          rates,
        );
        const existingCategory = acc.find((item) => item.name === categoryName);

        if (existingCategory) {
          existingCategory.amount += amountUAH;
        } else {
          acc.push({ name: categoryName, amount: amountUAH });
        }

        return acc;
      },
      [] as Array<{ name: string; amount: number }>,
    )
    .sort((a, b) => b.amount - a.amount);

  const totalIncome = incomeByCategory.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  return incomeByCategory.map((item) => ({
    name: item.name,
    rate: Math.round((item.amount / totalIncome) * 100 * 10) / 10,
  }));
}

// analytics area chart
export function calculateMonthlyIncomeAndExpenses(
  transactions: Transaction[],
  accounts: Account[] = [],
  rates?: ExchangeRateMap,
) {
  if (!transactions) {
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(new Date().getFullYear(), i, 1);
      return {
        date: date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
        }),
        Income: 0,
        Expenses: 0,
      };
    });
  }

  if (transactions.length === 0) {
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(new Date().getFullYear(), i, 1);
      return {
        date: date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
        }),
        Income: 0,
        Expenses: 0,
      };
    });
  }

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-11
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const mostRecentTransaction = sortedTransactions[0];
  const mostRecentYear = new Date(mostRecentTransaction.date).getFullYear();
  const year = currentYear === mostRecentYear ? currentYear : mostRecentYear;
  const maxMonthIndex = year === currentYear ? currentMonth : 11;

  const months: Array<{ date: Date; income: number; expenses: number }> = [];

  for (let monthIndex = 0; monthIndex <= maxMonthIndex; monthIndex++) {
    const monthStart = new Date(year, monthIndex, 1);
    const monthEnd = new Date(year, monthIndex + 1, 0);

    const monthTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });

    const income = monthTransactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => {
        const amount =
          typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
        const currency = resolveCurrency(t, accounts);
        const amountUAH = convertToUAH(
          isNaN(amount) ? 0 : amount,
          currency,
          rates,
        );
        return sum + amountUAH;
      }, 0);

    const expenses = monthTransactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => {
        const amount =
          typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
        const currency = resolveCurrency(t, accounts);
        const amountUAH = convertToUAH(
          isNaN(amount) ? 0 : amount,
          currency,
          rates,
        );
        return sum + amountUAH;
      }, 0);

    months.push({
      date: monthStart,
      income: Math.round(income * 100) / 100,
      expenses: Math.round(expenses * 100) / 100,
    });
  }

  return months.map((month) => ({
    date: month.date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    }),
    Income: month.income,
    Expenses: month.expenses,
  }));
}

// analitycs savings bar chart
export function calculateSavingsStats(
  transactions: Transaction[],
  accounts: Account[] = [],
  rates?: ExchangeRateMap,
) {
  const savingsAccountIds = accounts
    .filter((a) => a.type === 'SAVINGS')
    .map((a) => a.id);

  const getTotalSavingsAmount = (): number => {
    const savingsAccounts = accounts.filter((a) => a.type === 'SAVINGS');
    const totalBalance = calculateTotalBalanceInUAH(savingsAccounts, rates);
    return Math.round(totalBalance * 100) / 100;
  };

  const getSavingsStatsPerYear = (): Array<{
    date: string;
    'Net savings amount per month': number;
  }> => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const savingsStatsPerYear: Array<{
      date: string;
      'Net savings amount per month': number;
    }> = [];

    for (let monthIndex = 0; monthIndex <= currentMonth; monthIndex++) {
      const monthStart = new Date(currentYear, monthIndex, 1);
      const monthEnd = new Date(currentYear, monthIndex + 1, 0);

      const isInMonth = (t: Transaction): boolean => {
        const transactionDate = new Date(t.date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      };

      const monthTransfers = transactions
        .filter((t) => {
          if (t.type !== 'TRANSFER' || !isInMonth(t)) return false;
          const categoryName =
            (t as any).category?.name || (t as any).categoryName;
          return (
            categoryName === 'Savings' ||
            (typeof t.accountRecipientId === 'number' &&
              savingsAccountIds.includes(t.accountRecipientId))
          );
        })
        .reduce((sum, t) => {
          const amount =
            typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
          const currency = resolveCurrency(t, accounts);
          const amountUAH = convertToUAH(
            isNaN(amount) ? 0 : amount,
            currency,
            rates,
          );
          return sum + amountUAH;
        }, 0);

      const monthExpenses = transactions
        .filter((t) => {
          if (!isInMonth(t)) return false;
          const isExpenseFromSavings =
            t.type === 'EXPENSE' && savingsAccountIds.includes(t.accountId);
          const isTransferOutFromSavings =
            t.type === 'TRANSFER' &&
            typeof t.accountId === 'number' &&
            savingsAccountIds.includes(t.accountId) &&
            !(
              typeof t.accountRecipientId === 'number' &&
              savingsAccountIds.includes(t.accountRecipientId)
            );

          return isExpenseFromSavings || isTransferOutFromSavings;
        })
        .reduce((sum, t) => {
          const amount =
            typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
          const currency = resolveCurrency(t, accounts);
          const amountUAH = convertToUAH(
            isNaN(amount) ? 0 : amount,
            currency,
            rates,
          );
          return sum + amountUAH;
        }, 0);

      const monthName = monthStart.toLocaleDateString('en-US', {
        month: 'short',
      });

      savingsStatsPerYear.push({
        date: monthName,
        'Net savings amount per month':
          Math.round((monthTransfers - monthExpenses) * 100) / 100,
      });
    }

    return savingsStatsPerYear;
  };

  return {
    getTotalSavingsAmount,
    getSavingsStatsPerYear,
  };
}
