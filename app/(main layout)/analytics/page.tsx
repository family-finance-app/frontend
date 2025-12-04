'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useMyTransactions } from '@/api/transactions/queries';
import { useCategories } from '@/api/categories/queries';
import { useMyAccounts } from '@/api/accounts/queries';
import {
  calculateMonthlyIncomeAndExpenses,
  calculateIncomeByCategory,
  calculateExpensesByCategory,
  calculateSavingsStats,
} from '@/utils/financial';
import { formatCurrencyAmount } from '@/utils/formatters';
import { AreaChart } from '@/components/charts/AreaChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { roboto } from '@/assets/fonts/fonts';
import { BarChart } from '@/components/charts/BarChart';

export default function Analytics() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { data: transactions = [], isLoading } = useMyTransactions();
  const { data: categories = [] } = useCategories();
  const { data: accounts = [] } = useMyAccounts();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const update = () => setIsDarkMode(root.classList.contains('dark'));

    update();

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        montlyStats: [],
        totalIncomeCats: [],
        totalExpensesCats: [],
        monthlySavingsStats: [],
        totalSavingsAmount: 0,
      };
    }
    const savingsStats = calculateSavingsStats(transactions, accounts);

    return {
      montlyStats: calculateMonthlyIncomeAndExpenses(transactions),
      totalIncomeCats: calculateIncomeByCategory(transactions, categories),
      totalExpensesCats: calculateExpensesByCategory(transactions, categories),
      monthlySavingsStats: savingsStats.getSavingsStatsPerYear(),
      totalSavingsAmount: savingsStats.getTotalSavingsAmount(),
    };
  }, [transactions, categories, accounts]);

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-background-50 to-white dark:from-primary-700 dark:to-background-800 rounded-4xl p-6 md:p-8">
      <div className="mb-12">
        <h1
          className={`${roboto.variable} text-4xl md:text-5xl font-bold text-background-700 dark:text-background-100 mb-2 font-roboto`}
        >
          Explore Analytics
        </h1>
        <p className="text-background-600 dark:text-background-200 text-lg">
          With clear visual insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="">
            <div className="mb-6">
              <h3
                className={`${roboto.variable} text-2xl font-bold text-center text-background-600 dark:text-background-100 mb-2 font-roboto`}
              >
                Income Distribution
              </h3>
              <div className="pt-2">
                <p className="text-sm text-center text-background-700 dark:text-background-300 leading-relaxed">
                  <span className="font-semibold text-background-700 dark:text-background-200">
                    Breakdown of your total income of all time by source
                    categories by percentage
                  </span>{' '}
                </p>
              </div>
            </div>
            <div className="flex justify-center pt-6">
              {chartData.totalIncomeCats.length > 0 ? (
                <DonutChart
                  data={chartData.totalIncomeCats}
                  category="name"
                  value="rate"
                  valueFormatter={(number: number) => `${number}%`}
                  className="h-80 w-80"
                />
              ) : (
                <div className="text-center py-12 text-background-500 dark:text-background-400">
                  No income data available
                </div>
              )}
            </div>
          </div>

          <div className="">
            <div className="mb-6">
              <h3
                className={`${roboto.variable} text-2xl text-center font-bold text-background-600 dark:text-background-100 mb-2 font-roboto`}
              >
                Expenses Distribution
              </h3>
              <div className="pt-2">
                <p className="text-sm text-center text-background-700 dark:text-background-300 leading-relaxed">
                  <span className="font-semibold text-background-700 dark:text-background-200">
                    This donut chart displays how your spending is distributed
                    across different expense categories by percentage
                  </span>{' '}
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              {chartData.totalExpensesCats.length > 0 ? (
                <DonutChart
                  data={chartData.totalExpensesCats}
                  category="name"
                  value="rate"
                  valueFormatter={(number: number) => `${number}%`}
                  className="h-80 w-80"
                />
              ) : (
                <div className="text-center py-12 text-background-500 dark:text-background-400">
                  No expenses data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className=" rounded-2xl  p-8 mb-12  border-background-100 dark:border-background-700">
        <div className="mb-6">
          <h3
            className={`${roboto.variable} text-2xl font-bold text-background-600 dark:text-background-50 mb-2 font-roboto`}
          >
            Monthly Income & Expenses Overview for {new Date().getFullYear()}
          </h3>
        </div>
        {chartData.montlyStats.length > 0 ? (
          <AreaChart
            className="h-150 w-full text-sm  dark:bg-primary-700 p-3 dark:border dark:border-background-300 rounded-3xl"
            data={chartData.montlyStats}
            index="date"
            categories={['Income', 'Expenses']}
            valueFormatter={(number: number) =>
              `${formatCurrencyAmount(number)}`
            }
            onValueChange={(v) => console.log(v)}
            type="default"
            intervalType="preserveStartEnd"
            yAxisLabel="UAH"
            fill="gradient"
            colors={['moss', 'salmon', 'pink']}
            isDarkMode={isDarkMode}
          />
        ) : (
          <div className="text-center py-20 text-background-500 dark:text-background-400">
            No data available
          </div>
        )}
      </div>

      <div className=" rounded-2xl m-6 p-4">
        <div className="mb-12 ">
          <div className="relative">
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-600 rounded-full -ml-40 -mb-40 opacity-10"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-end justify-center gap-8 md:gap-16 min-h-48">
              <div className="flex-1 ">
                <h3
                  className={`${roboto.variable} text-2xl font-medium text-background-600 dark:text-background-100 mb-2 font-roboto`}
                >
                  Total Savings
                </h3>
                <h2
                  className={`${roboto.variable} text-6xl md:text-7xl font-bold font-roboto text-moss-400 dark:text-moss-100 leading-none`}
                >
                  {formatCurrencyAmount(chartData.totalSavingsAmount)} UAH
                </h2>
              </div>

              <div className="flex-1 pb-4">
                <p className="text-background-600 dark:text-background-200 text-right font-medium text-lg">
                  There is your monthly savings growth below — positive values
                  show money transferred to savings, negative values indicate
                  expenses from your savings accounts.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-12">
          <div className="rounded-2xl  opacity-80">
            <h3
              className={`${roboto.variable} text-2xl font-bold text-primary-800 dark:text-background-50 font-roboto`}
            >
              Monthly Savings Overview for {new Date().getFullYear()}
            </h3>
            {chartData.monthlySavingsStats.length > 0 ? (
              <BarChart
                className="h-72"
                data={chartData.monthlySavingsStats}
                index="date"
                categories={['Net savings amount per month']}
                yAxisWidth={80}
                valueFormatter={(number: number) =>
                  `${formatCurrencyAmount(number)}`
                }
                yAxisLabel="UAH"
                isDarkMode={isDarkMode}
              />
            ) : (
              <div className="text-center py-8 text-background-500 dark:text-background-400">
                No savings data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
