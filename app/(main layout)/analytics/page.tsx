'use client';

import React, { useMemo } from 'react';
import { useMyTransactions } from '@/api/transactions/queries';
import { useCategories } from '@/api/categories/queries';
import {
  calculateMonthlyIncomeAndExpenses,
  calculateIncomeByCategory,
  calculateExpensesByCategory,
} from '@/utils/financial';
import { formatCurrencyAmount } from '@/utils/formatters';
import { AreaChart } from '@/components/charts/AreaChart';
import { DonutChart } from '@/components/charts/DonutChart';

export default function Analytics() {
  const { data: transactions = [], isLoading } = useMyTransactions();
  const { data: categories = [] } = useCategories();

  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        montlyStats: [],
        totalIncomeCats: [],
        totalExpensesCats: [],
      };
    }
    return {
      montlyStats: calculateMonthlyIncomeAndExpenses(transactions),
      totalIncomeCats: calculateIncomeByCategory(transactions, categories),
      totalExpensesCats: calculateExpensesByCategory(transactions, categories),
    };
  }, [transactions, categories]);

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-50">
        Analytics
      </h1>

      <div className="flex flex-row items-center justify-center gap-4">
        <DonutChart
          data={chartData.totalIncomeCats}
          category="name"
          value="rate"
          valueFormatter={(number: number) => `${number}%`}
        />

        <DonutChart
          data={chartData.totalExpensesCats}
          category="name"
          value="rate"
          valueFormatter={(number: number) => `${number}%`}
        />
      </div>

      <div className="rounded-lg shadow p-6">
        <AreaChart
          className="h-180 w-full text-xs"
          data={chartData.montlyStats}
          index="date"
          categories={['Income', 'Expenses']}
          valueFormatter={(number: number) => `${formatCurrencyAmount(number)}`}
          onValueChange={(v) => console.log(v)}
          type="default"
          intervalType="preserveStartEnd"
          yAxisLabel="UAH"
          fill="gradient"
        />
      </div>
    </div>
  );
}
