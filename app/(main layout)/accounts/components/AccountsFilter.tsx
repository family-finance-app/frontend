'use client';

import { accountTypeName } from '../index';

import { Account, ACCOUNT_TYPES } from '../types';

interface AccountsFilterProps {
  filterType: Account['type'] | 'all';
  onFilterChange: (type: Account['type'] | 'all') => void;
  accountsCount: number;
  totalCount: number;
}

export default function AccountsFilter({
  filterType,
  onFilterChange,
  accountsCount,
  totalCount,
}: AccountsFilterProps) {
  return (
    <div className="p-2">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div></div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <span className="text-sm font-medium text-background-700">
            Filter by type:
          </span>

          <div className="lg:hidden w-full sm:w-1/3">
            <label htmlFor="accounts-type" className="sr-only">
              Account type
            </label>
            <select
              id="accounts-type"
              className="w-full rounded-xl border border-background-200 bg-white dark:bg-background-100 px-4 py-2 text-sm font-medium text-background-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={filterType}
              onChange={(event) =>
                onFilterChange(event.target.value as Account['type'] | 'all')
              }
            >
              <option value="all">All</option>
              {ACCOUNT_TYPES.map((type: Account['type']) => (
                <option key={type} value={type}>
                  {accountTypeName(type)}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden lg:flex flex-wrap gap-2 bg-background-100 dark:bg-background-300 rounded-xl p-2 sm:p-1">
            <button
              onClick={() => onFilterChange('all')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                filterType === 'all'
                  ? 'bg-white text-primary-800 dark:bg-background-50 shadow-sm'
                  : 'text-background-600 hover:text-stack-700'
              }`}
            >
              All
            </button>
            {ACCOUNT_TYPES.map((type: Account['type']) => (
              <button
                key={type}
                onClick={() => onFilterChange(type)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  filterType === type
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-background-600 dark:text-stack-600 hover:text-background-900'
                }`}
              >
                {accountTypeName(type)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
