import { Transaction } from '@/types/transaction';
import { Account } from '@/types/account';

export const filterTransactions = (
  transactions: Transaction[],
  filterType: 'all' | 'INCOME' | 'EXPENSE' | 'TRANSFER',
  timeRange: 'week' | 'month' | 'quarter' | 'year' | 'all'
): Transaction[] => {
  return transactions.filter((transaction) => {
    if (filterType !== 'all' && transaction.type !== filterType) return false;

    if (timeRange === 'all') return true;

    const transactionDate = new Date(transaction.date);
    const now = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return transactionDate >= startDate && transactionDate <= now;
  });
};

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

export const calculateTransactionStats = (transactions: Transaction[]) => {
  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const netFlow = totalIncome - totalExpenses;

  return {
    totalIncome,
    totalExpenses,
    netFlow,
  };
};

export const getTransactionTypeName = (
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER' | string
): string => {
  switch (type) {
    case 'INCOME':
      return 'Income';
    case 'EXPENSE':
      return 'Expense';
    case 'TRANSFER':
      return 'Transfer';
    default:
      return type;
  }
};

export const getTransactionTypeColor = (
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER' | string
): string => {
  switch (type) {
    case 'INCOME':
      return 'text-success-600';
    case 'EXPENSE':
      return 'text-danger-600';
    case 'TRANSFER':
      return 'text-primary-600';
    default:
      return 'text-background-600';
  }
};

export const formatCurrency = (
  value: number,
  currency: string = 'USD'
): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  });
  return formatter.format(value);
};

export const TIME_RANGE_OPTIONS = [
  { value: 'all' as const, label: 'All time' },
  { value: 'week' as const, label: 'Week' },
  { value: 'month' as const, label: 'Month' },
  { value: 'quarter' as const, label: 'Quarter' },
  { value: 'year' as const, label: 'Year' },
];

export const TRANSACTION_TYPE_OPTIONS = [
  { value: 'all' as const, label: 'All' },
  { value: 'INCOME' as const, label: 'Income' },
  { value: 'EXPENSE' as const, label: 'Expense' },
  { value: 'TRANSFER' as const, label: 'Transfer' },
];

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

  return formatted;
}
