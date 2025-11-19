import { Transaction } from '@/types/transaction';
import { Account } from '@/types/account';
import { formatCurrencyAmount } from './formatters';
import { Category } from '@/types/category';

// universal utility for dashboard that calculates income/expenses/savings per chosen period
export function calculatePeriodStats(
  transactions: Transaction[],
  period: 'week' | 'month' | 'year' = 'month'
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

  const periodTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= now;
  });

  const income = periodTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = periodTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsAmount = periodTransactions
    .filter((t) => t.type === 'TRANSFER' && t.account?.type === 'SAVINGS')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expenses,
    netAmount: income - expenses,
    savings: savingsAmount,
    savingsRate: income > 0 ? (savingsAmount / income) * 100 : 0,
    savingsPercentage: income > 0 ? (savingsAmount / income) * 100 : 0,
    changeType:
      income - expenses >= 0 ? ('positive' as const) : ('negative' as const),
    transactionsCount: periodTransactions.length,
  };
}

export function calculateMonthlyStats(transactions: Transaction[]) {
  return calculatePeriodStats(transactions, 'month');
}

// calculates expenses per current month by category
export function calculateMonthExpensesByCategory(
  transactions: Transaction[],
  categories: any[]
) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  const expensesByCategory = currentMonthTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((acc, transaction) => {
      const category = categories.find(
        (cat) => cat.id === transaction.categoryId
      );
      const categoryName =
        transaction.category?.name || category?.name || 'Other';
      const existingCategory = acc.find((item) => item.label === categoryName);

      if (existingCategory) {
        existingCategory.value += transaction.amount;
      } else {
        acc.push({ label: categoryName, value: transaction.amount });
      }

      return acc;
    }, [] as Array<{ label: string; value: number }>)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return expensesByCategory;
}

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

export function getPreviousPeriodStats(
  transactions: Transaction[],
  period: 'week' | 'month' | 'year' = 'month'
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

  const previousPeriodTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= prevStartDate && transactionDate <= prevEndDate;
  });

  const previousIncome = previousPeriodTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const previousExpenses = previousPeriodTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income: previousIncome,
    expenses: previousExpenses,
  };
}

export function getPreviousMonthStats(transactions: Transaction[]) {
  return getPreviousPeriodStats(transactions, 'month');
}

export function calculateIncomeChange(
  currentIncome: number,
  transactions: Transaction[],
  period: 'week' | 'month' | 'year' = 'month'
): {
  value: number;
  type: 'positive' | 'negative' | 'neutral';
  displayValue: string;
} {
  const previousStats = getPreviousPeriodStats(transactions, period);
  const change = currentIncome - previousStats.income;
  const absoluteChange = Math.abs(change);

  return {
    value: absoluteChange,
    type: change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral',
    displayValue:
      change > 0
        ? `+${formatCurrencyAmount(absoluteChange)}`
        : change < 0
        ? `-${formatCurrencyAmount(absoluteChange)}`
        : '0.00',
  };
}

export function calculateExpensesChange(
  currentExpenses: number,
  transactions: Transaction[],
  period: 'week' | 'month' | 'year' = 'month'
): {
  value: number;
  type: 'positive' | 'negative' | 'neutral';
  displayValue: string;
} {
  const previousStats = getPreviousPeriodStats(transactions, period);
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
