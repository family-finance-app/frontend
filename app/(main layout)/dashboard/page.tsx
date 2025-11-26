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
  calculatePeriodStats,
  calculateMonthExpensesByCategory,
  calculateIncomeChange,
  calculateExpensesChange,
} from '@/utils/financial';
import { enrichTransactionsWithData } from '@/utils/transactions';
import { formatAccountsForWidget } from '@/utils/accounts';
import { formatTransactionsForList } from '@/utils/transactions';
import { useTotalBalanceInUAH } from '@/hooks/useTotalBalanceInUAH';
import {
  getPeriodExpenseComparison,
  getPeriodIncomeComparison,
  getPeriodSavingsComparison,
} from '@/utils/stats';

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>(
    'month'
  );
  const [isClient, setIsClient] = useState(false);
  const { data: accounts, isLoading: accountsLoading } = useMyAccounts();
  const { data: transactions = [], isLoading: transactionsLoading } =
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

  const periodStats = calculatePeriodStats(
    enrichedTransactions,
    timeframe,
    accounts
  );
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

  const expensesByCategory = calculateMonthExpensesByCategory(
    enrichedTransactions,
    categories
  );

  const periodIncomeComparison = getPeriodIncomeComparison(
    transactions,
    timeframe
  );

  const periodExpensesComparison = getPeriodExpenseComparison(
    transactions,
    timeframe
  );

  const periodSavingsComparison = getPeriodSavingsComparison(
    transactions,
    accounts,
    timeframe
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
            income={periodStats.income}
            expenses={periodStats.expenses}
            savings={periodStats.savings}
            savingsRate={periodStats.savingsRate}
            period={timeframe}
            incomeChange={incomeChange}
            expensesChange={expensesChange}
            incomeComparison={periodIncomeComparison}
            expensesComparison={periodExpensesComparison}
            savingsComparison={periodSavingsComparison}
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
