import React from 'react';

import { AccountCardGrid } from '../index';
import { accountStatsByGroup } from '../index';
import { Account } from '../types';

export const AccountsLists: React.FC<{
  accounts: Account[];
  activeSection: 'personal' | 'family';
  onCreateClick: () => void;
  onSelectAccount: (id: number) => void;
  onAccountAction: (id: number, e: React.MouseEvent) => void;
  selectedAccountId?: number | null;
}> = ({
  accounts,
  activeSection,
  onCreateClick,
  onSelectAccount,
  onAccountAction,
  selectedAccountId,
}) => {
  const personalAccounts = accountStatsByGroup(accounts, 'personal');
  const familyAccounts = accountStatsByGroup(accounts, 'family');

  const filteredAccounts =
    activeSection === 'personal'
      ? personalAccounts.accounts
      : familyAccounts.accounts;

  return (
    <div className="space-y-4">
      {personalAccounts.totalCount > 0 && activeSection === 'personal' && (
        <section aria-labelledby="personal-accounts">
          <h2 id="personal-accounts" className="sr-only">
            Personal Accounts
          </h2>
          <AccountCardGrid
            accounts={filteredAccounts}
            onClick={onCreateClick}
            onSelectAccount={onSelectAccount}
            onAccountAction={onAccountAction}
            selectedAccountId={selectedAccountId}
          />
        </section>
      )}

      {familyAccounts.totalCount > 0 && activeSection === 'family' && (
        <section aria-labelledby="family-accounts">
          <h2 id="family-accounts" className="sr-only">
            Family Accounts
          </h2>
          <AccountCardGrid
            accounts={filteredAccounts}
            onClick={onCreateClick}
            onSelectAccount={onSelectAccount}
            onAccountAction={onAccountAction}
            selectedAccountId={selectedAccountId}
          />
        </section>
      )}
    </div>
  );
};

export default AccountsLists;
