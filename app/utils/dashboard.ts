import { Transaction } from '@/types/transaction';
import { Account } from '@/types/account';

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
    amount: transaction.amount,
    date: transaction.date,
    createdAt: transaction.createdAt || new Date().toISOString(),
    updatedAt: transaction.updatedAt || new Date().toISOString(),
    description: transaction.description,
    user: transaction.user,
    account: transaction.account,
    category: transaction.category,
    group: transaction.group,
  }));

  return formatted.sort((a, b) => {
    const dateA = (a.date || a.createdAt || '').toString();
    const dateB = (b.date || b.createdAt || '').toString();
    return dateB.localeCompare(dateA);
  });
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
    balance: account.balance,
    currency: account.currency,
    change: 0,
  }));
}

export function calculateMonthlyStats(transactions: Transaction[]) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  const monthlyIncome = currentMonthTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = currentMonthTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income: monthlyIncome,
    expenses: monthlyExpenses,
    netAmount: monthlyIncome - monthlyExpenses,
    savingsPercentage:
      monthlyIncome > 0
        ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100
        : 0,
    changeType:
      monthlyIncome - monthlyExpenses >= 0
        ? ('positive' as const)
        : ('negative' as const),
    transactionsCount: currentMonthTransactions.length,
  };
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

export const QUICK_ACTIONS_CONFIG = [
  {
    id: 'income',
    label: 'Add Income',
    description: 'Record new income',
    color: 'success',
    href: '#', // TODO: Update with actual route
  },
  {
    id: 'expense',
    label: 'Add Expense',
    description: 'Record new expense',
    color: 'danger',
    href: '#', // TODO: Update with actual route
  },
  {
    id: 'transfer',
    label: 'Transfer',
    description: 'Between accounts',
    color: 'primary',
    href: '#', // TODO: Update with actual route
  },
  {
    id: 'reports',
    label: 'Reports',
    description: 'View analytics',
    color: 'warning',
    href: '/reports', // TODO: Update with actual route
  },
];
