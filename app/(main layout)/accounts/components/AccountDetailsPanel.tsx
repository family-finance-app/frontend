import React from 'react';

import { AccountTransactionsSection } from '../index';
import { Account } from '../types';

export const AccountDetailsPanel: React.FC<{
  account?: Account | null;
  transactions: any[];
  categories: any[];
  onDelete: (id: number) => void;
  onSave: (id: number, data: any) => Promise<void>;
  isLoading?: boolean;
}> = ({ account, transactions, categories, onDelete, onSave, isLoading }) => {
  if (!account) return null;
  return (
    <AccountTransactionsSection
      account={account}
      transactions={transactions}
      categories={categories}
      onDelete={onDelete}
      onSave={onSave}
      isLoading={isLoading}
    />
  );
};

export default AccountDetailsPanel;
