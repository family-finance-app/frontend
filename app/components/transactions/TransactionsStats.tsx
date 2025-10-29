import FinancialCard from '@/components/ui/FinancialCard';

interface TransactionsStatsProps {
  totalIncome: number;
  totalExpenses: number;
  netFlow: number;
}

export default function TransactionsStats({
  totalIncome,
  totalExpenses,
  netFlow,
}: TransactionsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FinancialCard
        title="Total Income"
        value={`$${totalIncome.toLocaleString()}`}
        change={{
          value: '+12.5%',
          type: 'positive',
        }}
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 11l5-5m0 0l5 5m-5-5v12"
            />
          </svg>
        }
      />
      <FinancialCard
        title="Total Expenses"
        value={`$${totalExpenses.toLocaleString()}`}
        change={{
          value: '-3.2%',
          type: 'negative',
        }}
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 13l-5 5m0 0l-5-5m5 5V6"
            />
          </svg>
        }
      />
      <FinancialCard
        title="Net Flow"
        value={`$${netFlow.toLocaleString()}`}
        change={{
          value: netFlow >= 0 ? '+8.7%' : '-8.7%',
          type: netFlow >= 0 ? 'positive' : 'negative',
        }}
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        }
      />
    </div>
  );
}
