'use client';

import { Account } from '@/types/account';
import { getCurrencySymbol } from '@/utils/currency';

interface AccountListRowProps {
  account: Account;
  isDeleting: boolean;
  onDelete: (id: number, name: string) => void;
  onEdit?: (account: Account) => void;
}

export function AccountListRow({
  account,
  isDeleting,
  onDelete,
  onEdit,
}: AccountListRowProps) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {account.name}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {account.type || '-'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-semibold text-gray-900 dark:text-white">
          {getCurrencySymbol(account.currency)}
          {Number(account.balance).toLocaleString('en-US', {
            minimumFractionDigits: 2,
          })}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
          {account.currency}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              if (onEdit) {
                onEdit(account);
              } else {
                alert('Edit functionality coming soon!');
              }
            }}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(account.id, account.name)}
            disabled={isDeleting}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-brown-700 bg-brown-100 hover:bg-brown-200 dark:bg-brown-900/30 dark:text-brown-400 dark:hover:bg-brown-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </td>
    </tr>
  );
}
