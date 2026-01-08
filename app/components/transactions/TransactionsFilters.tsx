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
    <div className="bg-white dark:bg-stack-100 rounded-2xl shadow-financial border border-background-100 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full">
          <span className="text-sm font-medium text-background-700">
            Filter by type:
          </span>

          <div className="sm:hidden w-full">
            <label htmlFor="transactions-type" className="sr-only">
              Transaction type
            </label>
            <select
              id="transactions-type"
              className="w-full rounded-xl border border-background-200 bg-white px-4 py-2 text-sm font-medium text-background-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={filterType}
              onChange={(event) =>
                onFilterTypeChange(
                  event.target.value as
                    | 'all'
                    | 'INCOME'
                    | 'EXPENSE'
                    | 'TRANSFER'
                )
              }
            >
              {(['all', 'INCOME', 'EXPENSE', 'TRANSFER'] as const).map(
                (type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="hidden sm:flex bg-background-100 dark:bg-background-300 rounded-xl p-1 flex-wrap gap-2 overflow-x-auto sm:overflow-visible">
            {(['all', 'INCOME', 'EXPENSE', 'TRANSFER'] as const).map((type) => (
              <button
                key={type}
                onClick={() => onFilterTypeChange(type)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex-shrink-0 ${
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

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full">
          <span className="text-sm font-medium text-background-700">
            Time range:
          </span>

          <div className="sm:hidden w-full">
            <label htmlFor="transactions-range" className="sr-only">
              Time range
            </label>
            <select
              id="transactions-range"
              className="w-full rounded-xl border border-background-200 bg-white px-4 py-2 text-sm font-medium text-background-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={timeRange}
              onChange={(event) =>
                onTimeRangeChange(
                  event.target.value as
                    | 'week'
                    | 'month'
                    | 'quarter'
                    | 'year'
                    | 'all'
                )
              }
            >
              {(['all', 'week', 'month', 'quarter', 'year'] as const).map(
                (range) => (
                  <option key={range} value={range}>
                    {range === 'all'
                      ? 'All time'
                      : range.charAt(0).toUpperCase() + range.slice(1)}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="hidden sm:flex bg-background-100 dark:bg-background-300 rounded-xl p-1 flex-wrap gap-2 overflow-x-auto sm:overflow-visible">
            {(['all', 'week', 'month', 'quarter', 'year'] as const).map(
              (range) => (
                <button
                  key={range}
                  onClick={() => onTimeRangeChange(range)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex-shrink-0 ${
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
