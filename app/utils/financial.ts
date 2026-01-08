import { Transaction } from '@/(main layout)/transactions/types';
import { Account } from '@/types/account';
import { formatCurrencyAmount } from './formatters';
import { Category } from '@/types/category';

// calculates total expenses by category for analytics donut chart
export function calculateExpensesByCategory(
  transactions: Transaction[],
  categories: Category[]
) {
  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === 'EXPENSE'
  );

  if (expenseTransactions.length === 0) return [];

  const expenseByCategory = expenseTransactions
    .reduce((acc, transaction) => {
      const category = categories.find(
        (cat) => cat.id === transaction.categoryId
      );
      const categoryName = category?.name || 'Other';
      const amount =
        typeof transaction.amount === 'string'
          ? parseFloat(transaction.amount)
          : transaction.amount;
      const existingCategory = acc.find((item) => item.name === categoryName);

      if (existingCategory) existingCategory.amount += amount;
      else acc.push({ name: categoryName, amount });

      return acc;
    }, [] as Array<{ name: string; amount: number }>)
    .sort((a, b) => b.amount - a.amount);

  const totalExpenses = expenseByCategory.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return expenseByCategory.map((item) => ({
    name: item.name,
    rate: Math.round((item.amount / totalExpenses) * 100 * 10) / 10,
  }));
}

// calculates total income stats by category for analytics (donut chart)
export function calculateIncomeByCategory(
  transactions: Transaction[],
  categories: Category[]
) {
  const incomeTransactions = transactions.filter(
    (transaction) => transaction.type === 'INCOME'
  );

  if (incomeTransactions.length === 0) return [];

  const incomeByCategory = incomeTransactions
    .reduce((acc, transaction) => {
      const category = categories.find(
        (cat) => cat.id === transaction.categoryId
      );
      const categoryName = category?.name || 'Other';
      const amount =
        typeof transaction.amount === 'string'
          ? parseFloat(transaction.amount)
          : transaction.amount;
      const existingCategory = acc.find((item) => item.name === categoryName);

      if (existingCategory) {
        existingCategory.amount += amount;
      } else {
        acc.push({ name: categoryName, amount });
      }

      return acc;
    }, [] as Array<{ name: string; amount: number }>)
    .sort((a, b) => b.amount - a.amount);

  const totalIncome = incomeByCategory.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return incomeByCategory.map((item) => ({
    name: item.name,
    rate: Math.round((item.amount / totalIncome) * 100 * 10) / 10,
  }));
}

// analytics area chart
export function calculateMonthlyIncomeAndExpenses(transactions: Transaction[]) {
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
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
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
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);

    const expenses = monthTransactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => {
        const amount =
          typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
        return sum + (isNaN(amount) ? 0 : amount);
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
  accounts: Account[] = []
) {
  // Get savings account IDs
  const savingsAccountIds = accounts
    .filter((a) => a.type === 'SAVINGS')
    .map((a) => a.id);

  // Total balance of all SAVINGS accounts
  const getTotalSavingsAmount = (): number => {
    const totalBalance = accounts
      .filter((a) => a.type === 'SAVINGS')
      .reduce((sum, a) => sum + a.balance, 0);
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

      // TRANSFER to SAVINGS accounts (accountRecipientId is savings account)
      const monthTransfers = transactions
        .filter((t) => {
          if (t.type !== 'TRANSFER' || !isInMonth(t)) return false;
          return (
            t.accountRecipientId &&
            savingsAccountIds.includes(t.accountRecipientId)
          );
        })
        .reduce((sum, t) => {
          const amount =
            typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

      // EXPENSE from SAVINGS accounts (accountId is savings account)
      const monthExpenses = transactions
        .filter((t) => {
          if (t.type !== 'EXPENSE' || !isInMonth(t)) return false;
          return savingsAccountIds.includes(t.accountId);
        })
        .reduce((sum, t) => {
          const amount =
            typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
          return sum + (isNaN(amount) ? 0 : amount);
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
