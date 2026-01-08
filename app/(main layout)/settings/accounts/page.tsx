'use client';

import { useEffect, useState } from 'react';
import { roboto, jetbrainsMono } from '@/assets/fonts/fonts';
import { useMyAccounts } from '@/api/accounts/queries';
import { useMyTransactions } from '@/api/transactions/queries';
import { useUpdateAccount, useDeleteAccount } from '@/api/accounts/mutations';
import { useCategories } from '@/api/categories/queries';
import { getAccountTypeName } from '@/utils/accounts';
import { formatCurrencyAmount } from '@/utils/formatters';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTotalBalanceInUAH } from '@/hooks';
import {
  AccountDetails,
  AccountsList,
  DeleteAccountModal,
} from '@/components/settings/accounts';
import { Account, EditAccountFormData } from '@/types/account';
import { gridClassname } from '@/assets/globalClassnames';
import SearchInput from '@/components/ui/SearchInput';

export default function AccountSettings() {
  const router = useRouter();
  const { data: accounts = [] } = useMyAccounts();
  const { data: transactions = [] } = useMyTransactions();
  const { data: categories = [] } = useCategories();
  const searchParams = useSearchParams();
  const { totalBalance } = useTotalBalanceInUAH(accounts);
  const accountIdParam = searchParams.get('accountId');

  const updateMutation = useUpdateAccount();
  const deleteAccount = useDeleteAccount();

  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null
  );
  const [deletingAccountId, setDeletingAccountId] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSelected, setIsSelected] = useState(false);

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

  const filteredAccounts = accounts.filter(
    (account) =>
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getAccountTypeName(account.type)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!accountIdParam) return;

    const parsedId = Number(accountIdParam);
    if (!Number.isNaN(parsedId) && parsedId !== selectedAccountId) {
      setSelectedAccountId(parsedId);
    }
  }, [accountIdParam, selectedAccountId]);

  const handleSelectAccount = (accountId: number) => {
    setSelectedAccountId(accountId);
    setIsSelected(true);
    router.push(`/settings/accounts?accountId=${accountId}`, { scroll: false });
  };

  const handleEditAccount = async (
    accountId: number,
    formData: EditAccountFormData
  ) => {
    setIsLoading(true);
    try {
      await updateMutation.mutateAsync({
        id: accountId,
        data: {
          name: formData.name,
          type: formData.type as Account['type'],
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

  const handleDeleteAccount = async (accountId: number) => {
    setIsLoading(true);
    try {
      await deleteAccount.mutateAsync(accountId);
      setDeletingAccountId(null);
      setSelectedAccountId(null);
      router.push('/settings/accounts', { scroll: false });
    } catch (error) {
      console.error('Failed to delete account:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const statsGridData = [
    {
      title: 'Total Accounts',
      value: accounts.length,
    },
    {
      title: 'Total Balance',
      value: `${formatCurrencyAmount(totalBalance)} UAH`,
    },
    {
      title: 'Family',
      value: 0,
    },
    {
      title: 'Transactions',
      value: transactions.length,
    },
  ];

  const deletingAccount = accounts.find((a) => a.id === deletingAccountId);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1
          className={`${roboto.className} text-3xl font-bold text-primary-800 mb-2`}
        >
          Account Settings
        </h1>
        <p className="text-primary-800">
          Manage, edit and configure your financial accounts
        </p>
      </div>

      <div>
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {statsGridData.map((gridItem) => (
            <div key={gridItem.title} className={`${gridClassname}`}>
              <p className="text-primary-200 text-xs uppercase tracking-wide mb-1">
                {gridItem.title}
              </p>
              <p className={`${jetbrainsMono.className} text-2xl font-bold`}>
                {gridItem.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Accounts List  */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="bg-white dark:bg-background-50 rounded-2xl shadow-lg border border-background-100 overflow-hidden sticky top-6">
            <SearchInput value={searchQuery} setValue={setSearchQuery} />

            <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
              {filteredAccounts.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-background-100 rounded-full flex items-center justify-center mx-auto mb-4"></div>
                  <p className="text-background-500 text-sm">
                    No accounts found
                  </p>
                </div>
              ) : (
                <AccountsList
                  accounts={filteredAccounts}
                  transactions={transactions}
                  selectedAccountId={selectedAccountId}
                  onSelectAccount={handleSelectAccount}
                />
              )}
            </div>
            <div className="p-4 bg-background-50 border-t dark:bg-background-100 border-background-100">
              <p className="text-xs text-background-500 text-center">
                {filteredAccounts.length} of {accounts.length} accounts
              </p>
            </div>
          </div>
        </div>

        {/* Account Details Panel */}
        <div className="lg:col-span-8 xl:col-span-9">
          {selectedAccount ? (
            <AccountDetails
              account={selectedAccount}
              transactions={transactions}
              categories={categories}
              onDelete={setDeletingAccountId}
              onSave={handleEditAccount}
              isLoading={isLoading}
            />
          ) : (
            <div className="bg-white dark:bg-background-50 rounded-2xl shadow-lg border border-background-100 p-12">
              <div className="text-center max-w-md mx-auto">
                <div className="w-20 h-20 bg-linear-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3
                  className={`${roboto.className} text-xl font-bold text-background-900 mb-2`}
                >
                  Select an Account
                </h3>
                <p className="text-background-500 mb-6">
                  Choose an account from the list to view its details, edit
                  settings, or manage transactions.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {accounts.slice(0, 3).map((account) => (
                    <button
                      key={account.id}
                      onClick={() => handleSelectAccount(account.id)}
                      className="px-4 py-2 bg-background-100 hover:bg-primary-100 hover:text-primary-700 rounded-lg text-sm font-medium transition-all"
                    >
                      {account.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
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
