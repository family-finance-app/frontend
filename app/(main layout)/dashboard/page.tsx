'use client';

import { useState } from 'react';

import { useMyAccounts } from '@/api/accounts/queries';
import { useTransactions } from '@/api/transactions/queries';
import { useCategories } from '@/api/categories/queries';
import { useExchangeRates } from '@/api/exchangeRate/queries';

import {
  DashboardHeader,
  DashboardBalanceSection,
  DashboardStatsSection,
  DashboardTransactionsSection,
  DashboardExpensesSection,
  periodStats,
  monthlyExpensesByCategory,
  incomeChange,
  expensesChange,
  periodExpenseChartData,
  periodIncomeChartData,
  periodSavingsChartData,
  formatAccountsForDashboardWidget,
} from './index';

import {
  enrichTransactions,
  formatTransactions,
} from '@/(main layout)/transactions';

import { useTotalBalanceInUAH } from '@/hooks';

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>(
    'month',
  );
  const { accounts, isLoading: accountsLoading } = useMyAccounts();
  const { transactions, isLoading: transactionsLoading } = useTransactions();
  const { categories, isLoading: categoriesLoading } = useCategories();

  const { exchangeRates } = useExchangeRates();

  const { totalBalance } = useTotalBalanceInUAH(accounts);

  const formattedAccounts = formatAccountsForDashboardWidget(accounts);

  const formattedTransactions = formatTransactions(transactions);

  const enrichedTransactions = enrichTransactions(
    formattedTransactions,
    accounts,
    categories,
  );

  const period = periodStats(
    enrichedTransactions,
    timeframe,
    accounts,
    exchangeRates,
  );

  // console.log(period);
  const incomeChangeStats = incomeChange(
    period.income,
    enrichedTransactions,
    timeframe,
    accounts,
    exchangeRates,
  );
  const expensesChangeStats = expensesChange(
    period.expenses,
    enrichedTransactions,
    timeframe,
    accounts,
    exchangeRates,
  );

  const periodIncomeComparison = periodIncomeChartData(
    transactions,
    timeframe,
    exchangeRates,
    accounts,
  );

  const periodExpensesComparison = periodExpenseChartData(
    transactions,
    timeframe,
    exchangeRates,
    accounts,
  );

  const periodSavingsComparison = periodSavingsChartData(
    transactions,
    accounts,
    timeframe,
    exchangeRates,
  );

  if (accountsLoading || transactionsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-background-200 dark:bg-background-700 rounded-full"></div>
          <p className="text-background-500 dark:text-background-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

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
              categories,
              accounts,
              exchangeRates,
            )}
            isLoading={categoriesLoading || transactionsLoading}
          />
        </div>
      </div>
    </div>
  );
}
