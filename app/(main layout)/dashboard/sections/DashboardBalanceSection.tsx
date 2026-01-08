'use client';

import BalanceWidget from '../widgets/BalanceWidget';
import { formatCurrencyAmount } from '@/utils/formatters';

interface DashboardBalanceSectionProps {
  totalBalance: number;
  formattedAccounts: any[];
  isLoading: boolean;
}

export default function DashboardBalanceSection({
  totalBalance,
  formattedAccounts,
  isLoading,
}: DashboardBalanceSectionProps) {
  if (isLoading) {
    return (
      <div className="h-full bg-white rounded-2xl border border-background-200 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
          <p className="text-background-600 text-sm">Loading accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <BalanceWidget
      totalBalance={formatCurrencyAmount(totalBalance)}
      accounts={formattedAccounts}
      className="h-auto"
    />
  );
}
