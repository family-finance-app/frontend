'use client';

import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import { useMyAccounts } from '@/api/accounts/queries';

export default function AccountsDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const { data: accountsData, isLoading } = useMyAccounts();
  useEffect(() => {
    setMounted(true);
  }, []);

  type Account = {
    id?: string | number;
    name?: string;
    balance?: number | string;
    currency?: string;
    type?: string;
    [key: string]: any;
  };

  const accountsArray = Array.isArray(accountsData)
    ? (accountsData as Account[])
    : [];

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

  const getCurrencySymbol = (currency?: string) => {
    if (!currency) return '';
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      UAH: '₴',
    };
    return symbols[currency] || currency;
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
      {/* Header */}
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
        {/* Accounts Content */}
        {accounts.length > 0 && (
          <>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
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
                  <div
                    key={account.id || `account-${index}`}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {account.name}
                        </h4>
                        {account.type && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {account.type}
                          </p>
                        )}
                      </div>
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {account.currency}
                      </span>
                    </div>
                    <div className="mb-4">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {getCurrencySymbol(account.currency)}
                        {Number(account.balance).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/settings/accounts`)}
                        className="flex-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-2 rounded text-sm transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => router.push(`/settings/accounts`)}
                        className="flex-1 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 px-3 py-2 rounded text-sm transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
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
