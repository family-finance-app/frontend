'use client';

import { RiGroupLine, RiUserLine } from '@remixicon/react';

import { roboto } from '@/assets/fonts/fonts';

import {
  CreateAccountForm,
  accountStatsByGroup,
  validateEditAccountForm,
} from './index';

import { CardGrid, FormField } from '@/components';

import { currencyList, SELECT_ACCOUNT_TYPES } from './types';

import { formatCurrencyAmount } from '@/utils';

import { useAccountsPageData } from './hooks/useAccountsPageData';
import AccountsHeader from './components/AccountsHeader';
import AccountsLists from './components/AccountsLists';
import AccountDetailsPanel from './components/AccountDetailsPanel';
import ModalsStack from './components/ModalsStack';
import GlobalAlerts from './components/GlobalAlerts';

export default function Accounts() {
  const data = useAccountsPageData();

  const personalAccounts = accountStatsByGroup(data.accounts, 'personal');
  const familyAccounts = accountStatsByGroup(data.accounts, 'family');

  const gridData = [
    {
      title: 'Personal Accounts',
      value: personalAccounts.totalCount.toString(),
      description: 'Your accounts',
      icon: <RiUserLine />,
      section: 'personal' as const,
    },
    {
      title: 'Family Accounts',
      value: familyAccounts.totalCount.toString(),
      description: 'Shared accounts',
      icon: <RiGroupLine />,
      section: 'family' as const,
    },
  ];

  const accountTypes = SELECT_ACCOUNT_TYPES;
  const currencies = currencyList;

  const accountFormFields: FormField[] = data.editingAccount
    ? [
        {
          name: 'name',
          label: 'Account Name',
          type: 'text',
          required: true,
          placeholder: 'Enter account name',
        },
        {
          name: 'type',
          label: 'Account Type',
          type: 'select',
          required: true,
          options: accountTypes,
        },
        {
          name: 'currency',
          label: 'Currency',
          type: 'select',
          required: true,
          options: currencies,
        },
      ]
    : [];

  return (
    <div className="space-y-12">
      <GlobalAlerts
        successMessage={data.successMessage}
        errorMessage={data.errorMessage}
      />

      <AccountsHeader
        showCreateForm={data.showCreateForm}
        setShowCreateForm={data.setShowCreateForm}
      />

      <CardGrid
        data={gridData}
        size="sm"
        onClickAction={data.handleSectionChange}
        classname="h-full cursor-pointer"
        activeSection={data.activeSection}
      />

      {data.showCreateForm && (
        <div className="bg-white dark:bg-background-100 rounded-2xl shadow-financial border border-background-100 p-6 animate-scale-in">
          <div className="flex justify-between">
            <h3
              className={`${roboto.className} text-lg font-semibold mb-6 text-primary-800`}
            >
              Create New Account
            </h3>
          </div>
          <CreateAccountForm
            onSuccess={data.showSuccessMessage}
            onError={data.showErrorMessage}
            onCancel={() => data.setShowCreateForm(false)}
          />
        </div>
      )}

      <AccountsLists
        accounts={data.accounts}
        activeSection={data.activeSection}
        onCreateClick={() => data.setShowCreateForm(true)}
        onSelectAccount={data.handleSelectAccount}
        onAccountAction={data.handleAccountAction}
        selectedAccountId={data.selectedAccountId}
      />

      <AccountDetailsPanel
        account={data.selectedAccount}
        transactions={data.transactions}
        categories={data.categories}
        onDelete={data.setDeletingAccountId}
        onSave={data.handleEditAccount}
        isLoading={data.isLoading}
      />

      <ModalsStack
        accounts={data.accounts}
        actionAccount={data.actionAccount}
        editingAccount={data.editingAccount}
        deletingAccount={data.accounts.find(
          (a: any) => a.id === data.deletingAccountId,
        )}
        editingAccountId={data.editingAccountId}
        actionAccountId={data.actionAccountId}
        deletingAccountId={data.deletingAccountId}
        onCloseAction={() => data.setActionAccountId(null)}
        onEdit={data.handleEditFromModal}
        onDeleteConfirm={data.handleDeleteAccount}
        onCloseEdit={() => data.setEditingAccountId(null)}
        onCloseDelete={() => data.setDeletingAccountId(null)}
        onSaveAccount={(payload) =>
          data.handleEditAccount(
            data.editingAccountId as number,
            payload as any,
          )
        }
        accountFormFields={accountFormFields}
        validateForm={validateEditAccountForm}
        isLoading={data.isLoading}
      />
    </div>
  );
}
