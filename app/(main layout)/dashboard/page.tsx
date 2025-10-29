'use client';

import { useState, useEffect } from 'react';
import { useMyAccounts } from '@/api/accounts/queries';
import { useMyTransactions } from '@/api/transactions/queries';
import { useCategories } from '@/api/categories/queries';
import {
  DashboardHeader,
  DashboardBalanceSection,
  DashboardStatsSection,
  DashboardTransactionsSection,
  DashboardExpensesSection,
  // QuickActionsSection,
} from '@/components/dashboard';
import {
  formatTransactionsForList,
  formatAccountsForWidget,
  calculateMonthlyStats,
  calculateExpensesByCategory,
} from '@/utils/dashboard';

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>(
    'month'
  );
  const [isClient, setIsClient] = useState(false);
  const { data: accounts, isLoading: accountsLoading } = useMyAccounts();
  const { data: transactions, isLoading: transactionsLoading } =
    useMyTransactions();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  // preventing hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate total balance - ensure all values are numbers
  const totalBalance =
    accounts?.reduce((sum, account) => {
      const balance = Number(account.balance) || 0;
      return sum + balance;
    }, 0) || 0;

  const formattedAccounts = formatAccountsForWidget(accounts || []);

  const formattedTransactions = formatTransactionsForList(transactions || []);

  const monthlyStats = calculateMonthlyStats(formattedTransactions);

  const expensesByCategory = calculateExpensesByCategory(
    formattedTransactions,
    categories
  );

  // const handleQuickAction = (actionId: string) => {
  //   console.log(`Quick action clicked: ${actionId}`);
  //   // maybe implement navigation or modal opening
  // };

  if (!isClient) {
    return null;
  }

  return (
    <div className="space-y-8">
      <DashboardHeader timeframe={timeframe} onTimeframeChange={setTimeframe} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <DashboardBalanceSection
            totalBalance={totalBalance}
            formattedAccounts={formattedAccounts}
            isLoading={accountsLoading}
          />
        </div>

        <div className="xl:col-span-2">
          <DashboardStatsSection
            monthlyIncome={monthlyStats.income}
            monthlyExpenses={monthlyStats.expenses}
            savingsPercentage={monthlyStats.savingsPercentage}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DashboardTransactionsSection
            transactions={formattedTransactions}
            isLoading={transactionsLoading}
          />
        </div>

        <div>
          <DashboardExpensesSection
            expensesByCategory={expensesByCategory}
            isLoading={categoriesLoading || transactionsLoading}
          />
        </div>
      </div>

      {/* <QuickActionsSection onActionClick={handleQuickAction} /> */}
    </div>
  );
}
