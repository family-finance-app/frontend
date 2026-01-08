'use client';

import { useState } from 'react';
import { useMyAccounts } from '@/api/accounts/queries';
import { useMyTransactions } from '@/api/transactions/queries';
import { useCategories } from '@/api/categories/queries';
import {
  DashboardHeader,
  DashboardBalanceSection,
  DashboardStatsSection,
  DashboardTransactionsSection,
  DashboardExpensesSection,
} from './index';
import {
  periodStats,
  monthlyExpensesByCategory,
  incomeChange,
  expensesChange,
  periodExpenseChartData,
  periodIncomeChartData,
  periodSavingsChartData,
} from './utils/index';
import { enrichTransactionsWithData } from '@/utils/transactions';
import { formatAccountsForWidget } from '@/utils/accounts';
import { formatTransactionsForList } from '@/utils/transactions';
import { useTotalBalanceInUAH } from '@/hooks';

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>(
    'month'
  );
  const { data: accounts = [], isLoading: accountsLoading } = useMyAccounts();
  const { data: transactions = [], isLoading: transactionsLoading } =
    useMyTransactions();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  const { totalBalance } = useTotalBalanceInUAH(accounts);

  const formattedAccounts = formatAccountsForWidget(accounts || []);

  const formattedTransactions = formatTransactionsForList(transactions || []);

  const enrichedTransactions = enrichTransactionsWithData(
    formattedTransactions,
    accounts,
    categories
  );

  const period = periodStats(enrichedTransactions, timeframe, accounts);

  const incomeChangeStats = incomeChange(
    period.income,
    enrichedTransactions,
    timeframe
  );
  const expensesChangeStats = expensesChange(
    period.expenses,
    enrichedTransactions,
    timeframe
  );

  const periodIncomeComparison = periodIncomeChartData(transactions, timeframe);

  const periodExpensesComparison = periodExpenseChartData(
    transactions,
    timeframe
  );

  const periodSavingsComparison = periodSavingsChartData(
    transactions,
    accounts,
    timeframe
  );

  return (
    <div className="space-y-8">
      {/* timeframe select for large screens */}
      <DashboardHeader timeframe={timeframe} onTimeframeChange={setTimeframe} />

      <div className="space-y-6 xl:space-y-0 xl:grid xl:grid-cols-3 xl:gap-8">
        <div className="xl:col-span-1">
          <DashboardBalanceSection
            totalBalance={totalBalance}
            formattedAccounts={formattedAccounts}
            isLoading={accountsLoading}
          />
        </div>

        {/* timeframe select for small (s) and medium (m) screens */}
        <div className="w-full xl:hidden l:hidden s:flex m:flex">
          <div className="flex w-full bg-background-100 dark:bg-background-300 rounded-xl p-1 overflow-x-auto">
            {(['week', 'month', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 shrink-0 ${
                  timeframe === period
                    ? 'bg-white text-primary-800 dark:bg-background-100 shadow-sm'
                    : 'text-background-600 hover:text-background-900'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="xl:col-span-2">
          <DashboardStatsSection
            income={period.income}
            expenses={period.expenses}
            savings={period.savings}
            savingsRate={period.savingsRate}
            period={timeframe}
            incomeChange={incomeChangeStats}
            expensesChange={expensesChangeStats}
            incomeComparison={periodIncomeComparison}
            expensesComparison={periodExpensesComparison}
            savingsComparison={periodSavingsComparison}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3  gap-8">
        <div className="lg:col-span-2 ">
          <DashboardTransactionsSection
            transactions={enrichedTransactions}
            accounts={accounts || []}
            categories={categories}
            isLoading={transactionsLoading}
          />
        </div>

        <div>
          <DashboardExpensesSection
            expensesByCategory={monthlyExpensesByCategory(
              enrichedTransactions,
              categories
            )}
            isLoading={categoriesLoading || transactionsLoading}
          />
        </div>
      </div>
    </div>
  );
}
