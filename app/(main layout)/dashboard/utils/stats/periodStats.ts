import { Transaction } from '@/(main layout)/transactions/types';
import { Account } from '@/types/account';

// Utility for dashboard stats section that calculates income, expenses, and savings for the chosen period with change rate
export default function calculatePeriodStats(
  transactions: Transaction[],
  period: 'week' | 'month' | 'year' = 'month',
  accounts: Account[] = []
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
    .reduce((sum, t) => {
      const amount =
        typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

  const expenses = periodTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => {
      const amount =
        typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

  const savingsAccounts = accounts
    .filter((a) => a.type === 'SAVINGS')
    .map((a) => a.id);

  const savingsInflows = periodTransactions
    .filter((t) => t.type === 'TRANSFER' && t.category?.name === 'Savings')
    .reduce((sum, t) => {
      const amount =
        typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

  // Expenses from savings accounts
  const savingsOutflows = periodTransactions
    .filter(
      (t) => t.type === 'EXPENSE' && savingsAccounts.includes(t.accountId)
    )
    .reduce((sum, t) => {
      const amount =
        typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

  const savings = savingsInflows - savingsOutflows;

  const savingsRate = income > 0 ? (savings / income) * 100 : 0;

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
