import { Transaction } from '../types';

// filters transactions by type and time range
export default function filterTransactions(
  transactions: Transaction[],
  filterType: 'all' | 'INCOME' | 'EXPENSE' | 'TRANSFER',
  timeRange: 'week' | 'month' | 'year' | 'all'
): Transaction[] {
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
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return transactionDate >= startDate && transactionDate <= now;
  });
}
