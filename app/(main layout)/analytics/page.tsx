'use client';

import { useMemo } from 'react';
import { useTransactions } from '@/api/transactions/queries';
import { useCategories } from '@/api/categories/queries';
import { useMyAccounts } from '@/api/accounts/queries';
import { useExchangeRates } from '@/api/exchangeRate/queries';
import { formatCurrencyAmount } from '@/utils';
import {
  calculateMonthlyIncomeAndExpenses,
  calculateSavingsStats,
  calculateExpensesByCategory,
  calculateIncomeByCategory,
} from './index';
import { AreaChart } from '@/components/charts/AreaChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { roboto } from '@/assets/fonts/fonts';
import { BarChart } from '@/components/charts/BarChart';
import { useColorTheme } from '@/hooks';

export default function Analytics() {
  const { transactions, isLoading: transactionsLoading } = useTransactions();
  const { categories } = useCategories();
  const { accounts } = useMyAccounts();
  const { exchangeRates } = useExchangeRates();
  const exchangeRatesMemoized = useMemo(
    () => exchangeRates || {},
    [exchangeRates],
  );

  const colorTheme = useColorTheme();
  const isDarkMode = colorTheme === 'dark';

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
    const savingsStats = calculateSavingsStats(
      transactions,
      accounts,
      exchangeRates,
    );

    return {
      montlyStats: calculateMonthlyIncomeAndExpenses(
        transactions,
        accounts,
        exchangeRates,
      ),
      totalIncomeCats: calculateIncomeByCategory(
        transactions,
        categories,
        accounts,
        exchangeRates,
      ),
      totalExpensesCats: calculateExpensesByCategory(
        transactions,
        categories,
        accounts,
        exchangeRates,
      ),
      monthlySavingsStats: savingsStats.getSavingsStatsPerYear(),
      totalSavingsAmount: savingsStats.getTotalSavingsAmount(),
    };
  }, [transactions, categories, accounts, exchangeRates]);

  const totalIncomeAllTime = chartData.montlyStats.reduce(
    (sum, item) => sum + (item?.Income ?? 0),
    0,
  );
  const totalExpensesAllTime = chartData.montlyStats.reduce(
    (sum, item) => sum + (item?.Expenses ?? 0),
    0,
  );
  const netSavingsAllTime = totalIncomeAllTime - totalExpensesAllTime;
  const summaryCards = [
    {
      label: 'Total Income (all time)',
      value: formatCurrencyAmount(totalIncomeAllTime),
    },
    {
      label: 'Total Expenses (all time)',
      value: formatCurrencyAmount(totalExpensesAllTime),
    },
    {
      label: 'Net Savings',
      value: formatCurrencyAmount(netSavingsAllTime),
    },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-linear-to-br from-background-50 to-white dark:from-primary-700 dark:to-background-800 rounded-4xl px-2 text-xs md:text-[16px] py-6 sm:px-6 md:py-8 lg:px-10 lg:py-12">
      <div className="flex flex-col gap-6 sm:gap-8 lg:gap-12">
        <section className="border-b border-background-100 dark:border-background-700 pb-6 sm:pb-8 lg:pb-10">
          <div className="space-y-2 sm:space-y-3">
            <h1
              className={`${roboto.variable} text-2xl sm:text-3xl lg:text-4xl font-bold text-background-700 dark:text-background-100 font-roboto`}
            >
              Explore Analytics
            </h1>
            <p className="text-background-600 dark:text-background-200 text-base sm:text-lg lg:text-xl">
              With clear visual insights
            </p>
          </div>
        </section>

        <section className="border-b border-background-100 dark:border-background-700 pb-6 sm:pb-8 lg:pb-10">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
            {[
              {
                title: 'Income Distribution',
                description:
                  'Breakdown of your income of all time by categories by percentage',
                data: chartData.totalIncomeCats,
              },
              {
                title: 'Expenses Distribution',
                description:
                  'Breakdown of your spending of all time by categories by percentage',
                data: chartData.totalExpensesCats,
              },
            ].map(({ title, description, data }) => (
              <div
                key={title}
                className="flex flex-col items-center gap-4 text-center"
              >
                <div className="space-y-2">
                  <h3
                    className={`${roboto.variable} text-xl sm:text-2xl font-bold text-background-600 dark:text-background-100 font-roboto`}
                  >
                    {title}
                  </h3>
                  <p className="text-sm text-background-700 dark:text-background-300 leading-relaxed">
                    <span className="font-semibold text-background-700 dark:text-background-200">
                      {description}
                    </span>
                  </p>
                </div>
                <div className="flex w-full justify-center pt-4 sm:pt-6">
                  {data.length > 0 ? (
                    <DonutChart
                      data={data}
                      category="name"
                      value="rate"
                      valueFormatter={(number: number) => `${number}%`}
                      className="h-60 w-full max-w-xs sm:h-64 sm:max-w-sm md:h-72 md:max-w-md"
                    />
                  ) : (
                    <div className="py-10 text-center text-background-500 dark:text-background-400">
                      No data available
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl pt-4 pb-4 lg:p-8 space-y-4">
          <h3
            className={`${roboto.variable} text-base md:text-xl lg:text-2xl font-bold text-background-600 dark:text-background-50 text-center font-roboto`}
          >
            Monthly Income & Expenses Overview for {new Date().getFullYear()}
          </h3>
          {chartData.montlyStats.length > 0 ? (
            <AreaChart
              className="w-full min-h-[300px] md:min-h-[360px] rounded-3xl border border-transparent lg:dark:border-background-300 md:dark:border-background-300 bg-white/40 md:p-3 lg:p-3 dark:bg-primary-700"
              data={chartData.montlyStats}
              index="date"
              categories={['Income', 'Expenses']}
              // valueFormatter={(number: number) =>
              //   `${formatCurrencyAmount(number)}`
              // }
              onValueChange={(v) => console.log(v)}
              type="default"
              intervalType="preserveStartEnd"
              yAxisLabel="UAH"
              fill="gradient"
              colors={['moss', 'salmon', 'pink']}
              isDarkMode={isDarkMode}
            />
          ) : (
            <div className="py-12 text-center text-background-500 dark:text-background-400">
              No data available
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-background-100 dark:border-background-700 bg-white/80 dark:bg-primary-700/40 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          <div className="relative overflow-hidden rounded-2xl bg-white/60 dark:bg-primary-700/30 p-6 sm:p-8">
            <div className="absolute bottom-0 left-0 h-72 w-72 -translate-x-1/3 translate-y-1/3 rounded-full bg-primary-600/20" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between text-center lg:text-left">
              <div className="flex-1 space-y-2">
                <h3
                  className={`${roboto.variable} text-xl sm:text-2xl font-medium text-background-600 dark:text-background-100 font-roboto`}
                >
                  Total Savings
                </h3>
                <h2
                  className={`${roboto.variable} text-5xl sm:text-6xl md:text-7xl font-bold font-roboto text-moss-400 dark:text-moss-100 leading-none`}
                >
                  {formatCurrencyAmount(chartData.totalSavingsAmount)} UAH
                </h2>
              </div>
              <div className="flex-1">
                <p className="text-base sm:text-lg text-background-600 dark:text-background-200 font-medium">
                  There is your monthly savings growth below — positive values
                  show money transferred to savings, negative values indicate
                  expenses from your savings accounts.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3
              className={`${roboto.variable} text-xl sm:text-2xl font-bold text-primary-800 dark:text-background-50 font-roboto`}
            >
              Monthly Savings Overview for {new Date().getFullYear()}
            </h3>
            {chartData.monthlySavingsStats.length > 0 ? (
              <BarChart
                className="h-72 w-full"
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
              <div className="py-8 text-center text-background-500 dark:text-background-400">
                No savings data available
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
