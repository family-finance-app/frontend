interface TransactionsFiltersProps {
  filterType: 'all' | 'INCOME' | 'EXPENSE' | 'TRANSFER';
  timeRange: 'week' | 'month' | 'quarter' | 'year' | 'all';
  onFilterTypeChange: (type: 'all' | 'INCOME' | 'EXPENSE' | 'TRANSFER') => void;
  onTimeRangeChange: (
    range: 'week' | 'month' | 'quarter' | 'year' | 'all'
  ) => void;
}

export default function TransactionsFilters({
  filterType,
  timeRange,
  onFilterTypeChange,
  onTimeRangeChange,
}: TransactionsFiltersProps) {
  return (
    <div className="bg-white dark:bg-stack-100  rounded-2xl shadow-financial border border-background-100 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-background-700">
            Filter by type:
          </span>
          <div className="flex bg-background-100 dark:bg-background-300 rounded-xl p-1">
            {(['all', 'INCOME', 'EXPENSE', 'TRANSFER'] as const).map((type) => (
              <button
                key={type}
                onClick={() => onFilterTypeChange(type)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  filterType === type
                    ? 'bg-white text-primary-800 dark:bg-background-50 shadow-sm'
                    : 'text-background-600 dark:text-stack-600 hover:text-stack-700'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-background-700">
            Time range:
          </span>
          <div className="flex bg-background-100 dark:bg-background-300 rounded-xl p-1">
            {(['all', 'week', 'month', 'quarter', 'year'] as const).map(
              (range) => (
                <button
                  key={range}
                  onClick={() => onTimeRangeChange(range)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    timeRange === range
                      ? 'bg-white text-primary-800 dark:bg-background-50 shadow-sm'
                      : 'text-background-600 dark:text-stack-600 hover:text-stack-700'
                  }`}
                >
                  {range === 'all'
                    ? 'All time'
                    : range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
