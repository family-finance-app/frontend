'use client';

import { useState } from 'react';
import { Account } from '@/types/account';
import { roboto, jetbrainsMono } from '@/assets/fonts/fonts';
import { formatCurrencyAmount } from '@/utils/formatters';
import { AccountCard } from './AccountCard';
import { AccountsFilter } from './AccountsFilter';
import {
  filterAccountsByType,
  calculateAccountStats,
  type AccountType,
} from '@/utils/accounts';

interface PersonalAccountsSectionProps {
  accounts: Account[];
}

export function PersonalAccountsSection({
  accounts,
}: PersonalAccountsSectionProps) {
  const [filterType, setFilterType] = useState<AccountType | 'all'>('all');

  const filteredAccounts = filterAccountsByType(accounts, filterType);
  const stats = calculateAccountStats(accounts);
  const positiveAccounts = accounts.filter((account) => account.balance >= 0);

  const statsSummary = [
    { label: 'Total accounts', value: stats.totalCount.toString() },
    { label: 'Total balance', value: formatCurrencyAmount(stats.totalBalance) },
    { label: 'Positive balances', value: `${positiveAccounts.length}` },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statsSummary.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-background-100 bg-white dark:bg-primary-800 p-4"
          >
            <p className="text-sm text-background-500 dark:text-background-300">
              {item.label}
            </p>
            <p
              className={`${jetbrainsMono.className} text-2xl font-semibold text-background-900 dark:text-background-50`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <AccountsFilter
        filterType={filterType}
        onFilterChange={setFilterType}
        accountsCount={filteredAccounts.length}
        totalCount={accounts.length}
      />

      {filteredAccounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAccounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-background-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-background-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3
            className={`${roboto.className} text-lg font-semibold text-background-900 mb-2`}
          >
            No accounts found
          </h3>
          <p className="text-background-600 mb-4">
            No accounts match the selected filter. Try changing the filter.
          </p>
        </div>
      )}
    </div>
  );
}
