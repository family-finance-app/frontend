import { Transaction } from '@/types/transaction';
import { Account } from '@/types/account';
import { formatCurrencyAmount } from './formatters';

// enriches transactions with account and category data
export function enrichTransactionsWithData(
  transactions: Transaction[],
  accounts: Account[],
  categories: any[]
): any[] {
  return transactions.map((transaction) => {
    const account = accounts.find((acc) => acc.id === transaction.accountId);
    const category = categories.find(
      (cat) => cat.id === transaction.categoryId
    );

    return {
      ...transaction,
      account:
        transaction.account ||
        (account
          ? {
              id: account.id,
              name: account.name,
              type: account.type,
              currency: account.currency,
            }
          : undefined),
      category:
        transaction.category ||
        (category
          ? {
              id: category.id,
              name: category.name,
              type: category.type,
              icon: category.icon,
              color: category.color,
            }
          : undefined),
    };
  });
}

// converts transaction amount to number, normalizes optional fields
export function formatTransactionsForList(
  apiTransactions: any[]
): Transaction[] {
  if (!apiTransactions) return [];

  const formatted = apiTransactions.map((transaction) => ({
    id: transaction.id,
    userId: transaction.userId || 0,
    groupId: transaction.groupId,
    accountId: transaction.accountId,
    type: transaction.type,
    categoryId: transaction.categoryId || 0,
    amount: Number(transaction.amount) || 0,
    date: transaction.date,
    createdAt: transaction.createdAt || new Date().toISOString(),
    updatedAt: transaction.updatedAt || new Date().toISOString(),
    description: transaction.description,
    user: transaction.user,
    account: transaction.account,
    category: transaction.category,
    group: transaction.group,
  }));

  // Don't sort here - let TransactionList component handle sorting
  return formatted;
}

export function getAccountTypeName(type: string): string {
  switch (type) {
    case 'BANK':
      return 'Bank Account';
    case 'DEBIT':
      return 'Debit Card';
    case 'CREDIT':
      return 'Credit Card';
    case 'CASH':
      return 'Cash';
    case 'INVESTMENT':
      return 'Investment';
    case 'DEPOSIT':
      return 'Deposit';
    case 'DIGITAL':
      return 'Digital';
    case 'SAVINGS':
      return 'Savings';
    default:
      return 'Account';
  }
}

export function formatAccountsForWidget(accounts: Account[] | undefined) {
  if (!accounts) return [];

  return accounts.map((account) => ({
    id: account.id.toString(),
    name: account.name,
    type: getAccountTypeName(account.type),
    balance: formatCurrencyAmount(account.balance),
    currency: account.currency,
    change: 0,
  }));
}

export function calculatePeriodStats(
  transactions: Transaction[],
  period: 'week' | 'month' | 'year' = 'month'
) {
  const now = new Date();
  let startDate = new Date();

  if (period === 'week') {
    startDate.setDate(now.getDate() - now.getDay()); // start week from monday
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

export function calculateExpensesByCategory(
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
    // Return all 12 months of current year with 0 values
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
    // Return all 12 months of current year with 0 values
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

  // Determine which year to use - prefer current year if it has transactions, otherwise use most recent year
  const currentYear = new Date().getFullYear();
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const mostRecentTransaction = sortedTransactions[0];
  const mostRecentYear = new Date(mostRecentTransaction.date).getFullYear();

  // Use current year if we're in it and have transactions, otherwise use the year with most recent transactions
  const year = currentYear === mostRecentYear ? currentYear : mostRecentYear;

  // Generate all 12 months for the selected year
  const months: Array<{ date: Date; income: number; expenses: number }> = [];

  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const monthStart = new Date(year, monthIndex, 1);
    const monthEnd = new Date(year, monthIndex + 1, 0);

    // Get transactions for this month
    const monthTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });

    // Calculate income and expenses - ensure amount is converted to number
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

  // Format data for chart - use 'date' as index and 'Income', 'Expenses' as categories
  return months.map((month) => ({
    date: month.date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    }),
    Income: month.income,
    Expenses: month.expenses,
  }));
}
