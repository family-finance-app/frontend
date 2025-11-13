'use client';

import { useState } from 'react';
import { roboto } from '@/assets/fonts/fonts';
import Button from '@/components/ui/Button_financial';
import { useMyAccounts } from '@/api/accounts/queries';
import { useMyTransactions } from '@/api/transactions/queries';
import { useUpdateAccount, useDeleteAccount } from '@/api/accounts/mutations';
import { useCategories } from '@/api/categories/queries';
import { getAccountTypeName, type AccountType } from '@/utils/accounts';
import {
  AccountsList,
  AccountDetails,
  EditAccountForm,
  DeleteAccountModal,
  type EditAccountFormData,
} from '@/components/settings/accounts';

export default function AccountSettings() {
  const { data: accounts = [] } = useMyAccounts();
  const { data: transactions = [] } = useMyTransactions();
  const { data: categories = [] } = useCategories();

  const createMutation = useUpdateAccount();
  const deleteAccount = useDeleteAccount();

  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null
  );
  const [deletingAccountId, setDeletingAccountId] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

  const handleEditAccount = async (
    accountId: number,
    formData: EditAccountFormData
  ) => {
    setIsLoading(true);
    try {
      await createMutation.mutateAsync({
        id: accountId,
        data: {
          name: formData.name,
          type: formData.type,
          currency: formData.currency as 'UAH' | 'USD' | 'EUR',
        },
      });
    } catch (error) {
      console.error('Failed to update account:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete account
  const handleDeleteAccount = async (accountId: number) => {
    setIsLoading(true);
    try {
      await deleteAccount.mutateAsync(accountId);
      setDeletingAccountId(null);
      setSelectedAccountId(null);
    } catch (error) {
      console.error('Failed to delete account:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deletingAccount = accounts.find((a) => a.id === deletingAccountId);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1
            className={`${roboto.className} text-3xl font-bold text-background-900 mb-2`}
          >
            Account Configuration
          </h1>
          <p className="text-background-600">
            Manage your financial accounts, configure settings, and review
            transaction history
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button
            text="← Back to Accounts"
            type="button"
            variant="outline"
            size="md"
            onClick={() => (window.location.href = '/accounts')}
          />
          <Button
            text="Add New Account"
            type="button"
            variant="primary"
            size="md"
            onClick={() => (window.location.href = '/accounts')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Account Selector */}
        <div>
          <h2
            className={`${roboto.className} text-lg font-bold text-background-900 mb-4`}
          >
            Select Account
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {accounts.map((account) => (
              <button
                key={account.id}
                onClick={() => setSelectedAccountId(account.id)}
                className={`p-2.5 rounded-lg border transition-all text-left ${
                  selectedAccountId === account.id
                    ? 'border-primary-500 bg-primary-50 shadow-md'
                    : 'border-background-200 hover:border-primary-400 bg-white hover:shadow-md'
                }`}
              >
                <p className="font-medium text-sm text-background-900 truncate">
                  {account.name}
                </p>
                <p className="text-xs text-background-500 truncate mt-0.5">
                  {getAccountTypeName(account.type as AccountType)}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Account Details - Shown only when account is selected */}
        {selectedAccount && (
          <div>
            <AccountDetails
              account={selectedAccount}
              transactions={transactions}
              categories={categories}
              onDelete={setDeletingAccountId}
              onSave={handleEditAccount}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Empty State - shown when no account selected */}
        {!selectedAccount && (
          <div className="bg-white rounded-2xl shadow-financial border border-background-100 p-12">
            <div className="text-center">
              <p className="text-background-500 text-lg">
                Select an account to view details
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteAccountModal
        accountName={deletingAccount?.name || null}
        isOpen={!!deletingAccountId}
        isLoading={isLoading}
        onClose={() => setDeletingAccountId(null)}
        onConfirm={() =>
          deletingAccountId && handleDeleteAccount(deletingAccountId)
        }
      />
    </div>
  );
}
