'use client';

import { roboto } from '@/assets/fonts/fonts';
import { getAccountTypeName, ACCOUNT_TYPES } from '@/utils/accounts';
import { Account } from '@/types/account';

interface AccountsFilterProps {
  filterType: Account['type'] | 'all';
  onFilterChange: (type: Account['type'] | 'all') => void;
  accountsCount: number;
  totalCount: number;
}

export function AccountsFilter({
  filterType,
  onFilterChange,
  accountsCount,
  totalCount,
}: AccountsFilterProps) {
  return (
    <div className="bg-white rounded-2xl shadow-financial border border-background-100 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h3
            className={`${roboto.className} text-lg font-semibold text-background-900 mb-2`}
          >
            Accounts
          </h3>
          <p className="text-background-600 text-sm">
            {accountsCount} of {totalCount} accounts shown
          </p>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <span className="text-sm font-medium text-background-700 whitespace-nowrap">
            Filter by type:
          </span>
          <div className="flex bg-background-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => onFilterChange('all')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-background-600 hover:text-background-900'
              }`}
            >
              All
            </button>
            {ACCOUNT_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => onFilterChange(type)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                  filterType === type
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-background-600 hover:text-background-900'
                }`}
              >
                {getAccountTypeName(type)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
