'use client';

import { Account } from '@/types/account';
import { roboto, jetbrainsMono } from '@/assets/fonts/fonts';
import Button from '@/components/ui/Button_financial';

interface AccountsListProps {
  accounts: Account[];
  selectedAccountId: number | null;
  onSelectAccount: (accountId: number) => void;
  onDelete: (accountId: number) => void;
}

export function AccountsList({
  accounts,
  selectedAccountId,
  onSelectAccount,
  onDelete,
}: AccountsListProps) {
  return (
    <div className="bg-white rounded-2xl shadow-financial border border-background-100">
      <div className="divide-y divide-background-100">
        {accounts.map((account) => (
          <div
            key={account.id}
            className={`p-6 transition-colors cursor-pointer hover:bg-background-50 ${
              selectedAccountId === account.id
                ? 'bg-primary-50 border-l-4 border-l-primary-500'
                : ''
            }`}
            onClick={() => onSelectAccount(account.id)}
          >
            <div className="flex items-start justify-between">
              {/* Account Info */}
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-2">
                  {/* Column 1 */}
                  <div className="space-y-3">
                    <div>
                      <h4
                        className={`${roboto.className} font-semibold text-background-900`}
                      >
                        {account.name}
                      </h4>
                    </div>
                    <div>
                      <span className="text-sm text-background-500">Type:</span>
                      <span className="ml-2 text-sm text-background-900 font-medium">
                        {account.type}
                      </span>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-background-500">
                        Balance:
                      </span>
                      <span
                        className={`ml-2 ${
                          jetbrainsMono.className
                        } font-semibold text-sm ${
                          account.balance >= 0
                            ? 'text-success-600'
                            : 'text-danger-600'
                        }`}
                      >
                        {account.balance >= 0 ? '$' : '-$'}
                        {Math.abs(account.balance).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-background-500">
                        Created:
                      </span>
                      <span className="ml-2 text-sm text-background-900">
                        {account.createdAt
                          ? new Date(account.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  text="Delete"
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(account.id)}
                />
              </div>
            </div>

            {/* Description if exists */}
            {account.description && (
              <div className="mt-4 pt-4 border-t border-background-100">
                <p className="text-sm text-background-600">
                  <span className="font-medium text-background-700">
                    Description:
                  </span>{' '}
                  {account.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
