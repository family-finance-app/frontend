'use client';

import { useState, useEffect } from 'react';
import { useMyAccounts } from '@/api/accounts/queries';
import { useDeleteAccount } from '@/api/accounts/mutations';
import { AccountListRow } from './AccountListRow';
import { Account } from '@/(main layout)/accounts/types';

export default function AccountsList() {
  const { data: accountsData, isLoading } = useMyAccounts();
  const deleteAccount = useDeleteAccount();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const accountsArray = Array.isArray(accountsData) ? accountsData : [];
  const accounts = accountsArray.filter((account) => account != null);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete account "${name}"?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteAccount.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (account: Account) => {
    alert(`Edit functionality for "${account.name}" coming soon!`);
  };

  if (!mounted || isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">Loading accounts...</p>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">No accounts found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Account Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Type
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Balance
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Currency
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {accounts.map((account, index) => (
            <AccountListRow
              key={account.id || `account-${index}`}
              account={account}
              isDeleting={deletingId === account.id}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
