'use client';

import { useMyAccounts } from '@/api/accounts/queries';
import { useMyTransactions } from '@/api/transactions/queries';
import { useCategories } from '@/api/categories/queries';
import { useTotalBalanceInUAH } from '@/hooks';
import { periodStats } from '@/(main layout)/dashboard/utils';
import { enrichTransactionsWithData } from '@/utils/transactions';
import { formatTransactionsForList } from '@/utils/transactions';
import { formatCurrencyAmount } from '@/utils/formatters';

export function SidebarBalanceWidget() {
  const { data: accounts, isLoading: accountsLoading } = useMyAccounts();
  const { data: transactions, isLoading: transactionsLoading } =
    useMyTransactions();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const { totalBalance, isLoading: balanceLoading } =
    useTotalBalanceInUAH(accounts);

  const formattedTransactions = formatTransactionsForList(transactions || []);
  const enrichedTransactions = enrichTransactionsWithData(
    formattedTransactions,
    accounts || [],
    categories || []
  );
  const monthlyStats = periodStats(enrichedTransactions, 'month');

  const isLoading =
    accountsLoading ||
    transactionsLoading ||
    balanceLoading ||
    categoriesLoading;

  if (isLoading) {
    return (
      <div className="bg-background-50 rounded-lg p-4 space-y-3 animate-pulse">
        <div className="h-4 bg-background-200 rounded w-3/4"></div>
        <div className="h-4 bg-background-200 rounded w-full"></div>
        <div className="h-4 bg-background-200 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="bg-background-50 dark:bg-background-100 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-background-900 dark:text-background-800 uppercase tracking-wider">
          Balance
        </span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className=" text-background-600 dark:text-background-800">
          Total Balance
        </span>
        <span className="font-mono font-semibold text-background-900 dark:text-background-800">
          {formatCurrencyAmount(totalBalance)} UAH
        </span>
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className=" text-background-600 dark:text-background-800">
          Monthly income
        </span>
        <span className="font-mono font-semibold text-success-700">
          +{formatCurrencyAmount(monthlyStats.income)}
        </span>
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className=" text-background-600 dark:text-background-800">
          Monthly expenses
        </span>
        <span className="font-mono font-semibold text-danger-700">
          -{formatCurrencyAmount(monthlyStats.expenses)}
        </span>
      </div>
    </div>
  );
}
