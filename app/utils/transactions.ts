// Transaction utilities for filtering and data transformation
import { Transaction } from '@/types/transaction';
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

/**
 * Calculate transaction statistics
 */
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

/**
 * Get readable name for transaction type
 */
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

/**
 * Get color for transaction type
 */
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

/**
 * Format currency value with symbol
 */
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

/**
 * Time range options
 */
export const TIME_RANGE_OPTIONS = [
  { value: 'all' as const, label: 'All time' },
  { value: 'week' as const, label: 'Week' },
  { value: 'month' as const, label: 'Month' },
  { value: 'quarter' as const, label: 'Quarter' },
  { value: 'year' as const, label: 'Year' },
];

/**
 * Transaction type options
 */
export const TRANSACTION_TYPE_OPTIONS = [
  { value: 'all' as const, label: 'All' },
  { value: 'INCOME' as const, label: 'Income' },
  { value: 'EXPENSE' as const, label: 'Expense' },
  { value: 'TRANSFER' as const, label: 'Transfer' },
];
