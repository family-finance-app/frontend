'use client';

import { useState } from 'react';
import { Account, AccountType } from '../types';
import { AccountCard, AccountsFilter } from './index';
import { filterAccountsByType } from '../utils';

import NotFoundAction from '@/components/ui/NotFoundAction';

interface AccountsGridSectionProps {
  accounts: Account[];
  onClick: () => void;
}

export default function AccountsGridSection({
  accounts,
  onClick,
}: AccountsGridSectionProps) {
  const [filterType, setFilterType] = useState<AccountType>('all');
  const filteredAccounts = filterAccountsByType(accounts, filterType);

  return (
    <div className="space-y-6">
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
        <NotFoundAction
          header="No accounts found"
          text="No accounts match the selected filter."
          actionElement="button"
          action={{ fn: onClick, label: 'Add new account here' }}
        />
      )}
    </div>
  );
}
