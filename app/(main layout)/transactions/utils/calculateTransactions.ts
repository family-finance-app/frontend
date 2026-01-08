import { Transaction } from '../types';

// calculate the amount of transactions by type
export default function calculateTransactions(transactions: Transaction[]) {
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
}
