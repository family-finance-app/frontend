'use client';

import { useRouter } from 'next/navigation';
import { Account } from '@/types/account';
import { getCurrencySymbol } from '@/utils/currency';

interface AccountCardProps {
  account: Account;
  index: number;
}

export function AccountCard({ account, index }: AccountCardProps) {
  const router = useRouter();

  return (
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
  );
}
