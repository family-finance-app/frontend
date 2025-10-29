'use client';

import StatsCard from '@/components/ui/StatsCard';

interface DashboardExpensesSectionProps {
  expensesByCategory: Array<{ label: string; value: number }>;
  isLoading: boolean;
}

export function DashboardExpensesSection({
  expensesByCategory,
  isLoading,
}: DashboardExpensesSectionProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-background-200 p-6 h-80">
        <div className="animate-pulse">
          <div className="h-6 bg-background-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 bg-background-200 rounded w-1/3"></div>
                <div className="h-6 bg-background-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (expensesByCategory.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-background-200 p-6 h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-background-900 mb-2">
            No expenses this month
          </h3>
          <p className="text-background-600 text-sm">
            Start tracking your expenses to see spending patterns
          </p>
        </div>
      </div>
    );
  }

  return (
    <StatsCard
      title="Spending by Category"
      data={expensesByCategory}
      type="bar"
      height="h-80"
    />
  );
}
