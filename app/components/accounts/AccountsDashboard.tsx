'use client';

import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import { useMyAccounts } from '@/api/accounts/queries';
import { AccountCard } from '@/(main layout)/accounts/components';
import { Account } from '@/(main layout)/accounts/types';

export default function AccountsDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const { data: accountsData, isLoading } = useMyAccounts();

  const accountsArray = Array.isArray(accountsData) ? accountsData : [];

  const accounts: Account[] = accountsArray
    .map((item) => {
      if (item && typeof item === 'object' && 'account' in item) {
        return (item as any).account as Account;
      }
      return item as Account;
    })
    .filter((account): account is Account => account != null);

  const getTotalBalance = () => {
    if (accounts.length === 0) return 0;
    return accounts.reduce(
      (total: number, account: Account) =>
        total + (Number(account.balance) || 0),
      0
    );
  };

  if (!mounted || isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Accounts
          </h1>
          <Button
            type="button"
            text="Manage Accounts"
            onClick={() => router.push('/settings/accounts')}
          />
        </div>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            Loading accounts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Accounts
        </h1>
        <Button
          type="button"
          text="Manage Accounts"
          onClick={() => router.push('/settings/accounts')}
        />
      </div>

      <div>
        {accounts.length > 0 && (
          <>
            <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
              <h2 className="text-lg font-semibold mb-2">Total Balance</h2>
              <p className="text-3xl font-bold">
                {getTotalBalance().toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-blue-200 mt-1">
                Across {accounts.length} account
                {accounts.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your Accounts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accounts.map((account, index) => (
                  <AccountCard
                    key={account.id || `account-${index}`}
                    account={account}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {accounts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No accounts yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first account to start tracking your finances
            </p>
            <Button
              type="button"
              text="Create Account"
              onClick={() => router.push('/settings/accounts')}
            />
          </div>
        )}
      </div>
    </div>
  );
}
