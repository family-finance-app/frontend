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
} from '@/components/dashboard';
import {
  formatTransactionsForList,
  enrichTransactionsWithData,
  formatAccountsForWidget,
  calculatePeriodStats,
  calculateExpensesByCategory,
  calculateIncomeChange,
  calculateExpensesChange,
} from '@/utils/financial';
import { useTotalBalanceInUAH } from '@/hooks/useTotalBalanceInUAH';

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

  const { totalBalance } = useTotalBalanceInUAH(accounts);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formattedAccounts = formatAccountsForWidget(accounts || []);

  const formattedTransactions = formatTransactionsForList(transactions || []);

  const enrichedTransactions = enrichTransactionsWithData(
    formattedTransactions,
    accounts || [],
    categories
  );

  const periodStats = calculatePeriodStats(enrichedTransactions, timeframe);
  const incomeChange = calculateIncomeChange(
    periodStats.income,
    enrichedTransactions,
    timeframe
  );
  const expensesChange = calculateExpensesChange(
    periodStats.expenses,
    enrichedTransactions,
    timeframe
  );

  const expensesByCategory = calculateExpensesByCategory(
    enrichedTransactions,
    categories
  );

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
            monthlyIncome={periodStats.income}
            monthlyExpenses={periodStats.expenses}
            savings={periodStats.savings}
            savingsRate={periodStats.savingsRate}
            period={timeframe}
            incomeChange={incomeChange}
            expensesChange={expensesChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DashboardTransactionsSection
            transactions={enrichedTransactions}
            accounts={accounts || []}
            categories={categories}
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
    </div>
  );
}
