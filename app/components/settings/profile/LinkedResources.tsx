'use client';

import { Account } from '@/types/account';
import { roboto } from '@/assets/fonts/fonts';
import { getAccountTypeName } from '@/utils/accounts';

interface LinkedResourcesProps {
  familyGroups?: Array<{
    id: number;
    name: string;
    membersCount?: number;
  }>;
  accounts?: Account[];
}

export function LinkedResources({
  familyGroups = [],
  accounts = [],
}: LinkedResourcesProps) {
  return (
    <div className="space-y-6">
      {familyGroups && familyGroups.length > 0 && (
        <div className="bg-white rounded-2xl shadow-financial border border-background-100 p-6">
          <h2
            className={`${roboto.className} text-lg font-bold text-background-900 mb-4`}
          >
            Family Groups (Coming Soon)
          </h2>

          <div className="space-y-3">
            {familyGroups.map((group) => (
              <div
                key={group.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background-50 border border-background-100 hover:border-primary-300 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-background-900">
                    {group.name}
                  </p>
                  <p className="text-xs text-background-500 mt-1">
                    {group.membersCount || 0} member
                    {group.membersCount !== 1 ? 's' : ''}
                  </p>
                </div>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {false && accounts && accounts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-financial border border-background-100 p-6">
          <h2
            className={`${roboto.className} text-lg font-bold text-background-900 mb-4`}
          >
            Your Accounts ({accounts.length})
          </h2>

          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background-50 border border-background-100 hover:border-primary-300 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-background-900 truncate">
                    {account.name}
                  </p>
                  <p className="text-xs text-background-500 mt-1">
                    {getAccountTypeName(account.type as Account['type'])}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="font-semibold text-background-900">
                    {account.balance.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-background-500">
                    {account.currency}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!familyGroups || familyGroups.length === 0) &&
        (!accounts || accounts.length === 0) && (
          <div className="bg-white rounded-2xl shadow-financial border border-background-100 p-6">
            <div className="text-center">
              <p className="text-background-500">
                No family groups or accounts yet
              </p>
            </div>
          </div>
        )}
    </div>
  );
}
