'use client';

import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import { useAccountsByUser } from '@/api/accounts/queries';
import { useCurrentUser } from '@/api/auth/queries';

export default function AccountsDashboard() {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const { data: accountsData, isLoading } = useAccountsByUser(
    currentUser?.id || 0
  );

  const accountsArray = Array.isArray(accountsData) ? accountsData : [];
  const accounts = accountsArray.map((item) => item.account);

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + account.balance, 0);
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      UAH: '₴',
    };
    return symbols[currency] || currency;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Accounts
          </h1>
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Accounts
          </h1>
        </div>
        <Button
          type="button"
          text="Manage Accounts"
          onClick={() => router.push('/settings/accounts')}
        />
      </div>

      {accounts.length > 0 && (
        <>
          {/* Total Balance Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
            <h2 className="text-lg font-semibold mb-2">Total Balance</h2>
            <p className="text-3xl font-bold">
              {getTotalBalance().toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </p>
            <p className="text-blue-200 mt-1">
              Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Accounts List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Accounts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {account.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {account.type}
                      </p>
                    </div>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {account.currency}
                    </span>
                  </div>
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {getCurrencySymbol(account.currency)}
                      {account.balance.toLocaleString('en-US', {
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

      {/* Empty State */}
      {accounts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏦</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No accounts yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first account to start tracking your finances
          </p>
        </div>
      )}
    </div>
  );
}
