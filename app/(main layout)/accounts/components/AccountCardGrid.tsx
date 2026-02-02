'use client';

import { useState } from 'react';

import { Account, AccountType } from '../types';
import { AccountCard, AccountsFilter, filterAccountsByType } from '../index';

import { NotFoundAction } from '@/components';

interface AccountCardGridProps {
  accounts: Account[];
  onClick: () => void;
  onSelectAccount?: (accountId: number) => void;
  onAccountAction?: (accountId: number, event: React.MouseEvent) => void;
  selectedAccountId?: number | null;
}

export default function AccountCardGrid({
  accounts,
  onClick,
  onSelectAccount,
  onAccountAction,
  selectedAccountId,
}: AccountCardGridProps) {
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
            <AccountCard
              key={account.id}
              account={account}
              onClick={onSelectAccount}
              onActionClick={onAccountAction}
              isSelected={selectedAccountId === account.id}
            />
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
