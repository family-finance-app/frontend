import { useState, useEffect } from 'react';

import { useMyAccounts } from '@/api/accounts/queries';
import { useTransactions } from '@/api/transactions/queries';
import { useUpdateAccount, useDeleteAccount } from '@/api/accounts/mutations';
import { useCategories } from '@/api/categories/queries';

import { Account, CreateAccountFormData } from '../types';
import { ApiError } from '@/api/types';
import {
  registerGlobalAlerts,
  clearGlobalAlertsRegistration,
} from '@/lib/global-alerts';

export function useAccountsPageData() {
  const { accounts } = useMyAccounts();
  const { transactions } = useTransactions();
  const { categories } = useCategories();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [lastCreatedAccount, setLastCreatedAccount] = useState<string | null>(
    null,
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'personal' | 'family'>(
    'personal',
  );
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null,
  );
  const [deletingAccountId, setDeletingAccountId] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionAccountId, setActionAccountId] = useState<number | null>(null);
  const [editingAccountId, setEditingAccountId] = useState<number | null>(null);

  const selectedAccount = accounts.find(
    (a: Account) => a.id === selectedAccountId,
  );
  const actionAccount = accounts.find((a: Account) => a.id === actionAccountId);
  const editingAccount = accounts.find(
    (a: Account) => a.id === editingAccountId,
  );

  const showSuccessMessage = (accountName: string) => {
    setShowCreateForm(false);
    setLastCreatedAccount(accountName);
    setSuccessMessage(`Account \"${accountName}\" successfully created!`);
    setErrorMessage(null);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const showErrorMessage = (error: string) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  useEffect(() => {
    registerGlobalAlerts({
      onSuccess: (msg: string) => showSuccessMessage(msg),
      onError: (msg: string) => showErrorMessage(msg),
    });

    return () => clearGlobalAlertsRegistration();
  }, []);

  const handleSelectAccount = (accountId: number) => {
    if (selectedAccountId === accountId) {
      setSelectedAccountId(null);
    } else {
      setSelectedAccountId(accountId);
    }
    setShowCreateForm(false);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section as 'personal' | 'family');
    setSelectedAccountId(null);
  };

  const handleAccountAction = (accountId: number, event?: React.MouseEvent) => {
    event?.stopPropagation();
    setActionAccountId(accountId);
  };

  const handleEditFromModal = (account: Account) => {
    setEditingAccountId(account.id);
  };

  const handleDeleteFromModal = (accountId: number) => {
    setActionAccountId(null);
    setDeletingAccountId(accountId);
  };

  const handleEditAccount = async (
    accountId: number,
    formData: Partial<CreateAccountFormData>,
  ) => {
    setIsLoading(true);
    try {
      await updateAccount.mutateAsync(
        {
          id: accountId,
          data: {
            name: formData.name,
            type: formData.type as any,
            currency: formData.currency as any,
          },
        },
        {
          onSuccess: (response) => {
            setEditingAccountId(null);
            setActionAccountId(null);

            setSuccessMessage(response.message);
            setErrorMessage(null);
            setTimeout(() => setSuccessMessage(null), 5000);
          },
          onError: (err: ApiError) => {
            setEditingAccountId(null);
            setActionAccountId(null);
            setErrorMessage(
              err?.message || 'Failed to update account. Please try again.',
            );
            setSuccessMessage(null);
            setTimeout(() => setErrorMessage(null), 5000);
          },
        },
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async (accountId: number) => {
    setIsLoading(true);
    try {
      const response = await deleteAccount.mutateAsync({ id: accountId });
      setDeletingAccountId(null);
      setSelectedAccountId(null);
      // show success message
      if (response && (response as any).message) {
        setSuccessMessage((response as any).message);
        setErrorMessage(null);
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
      const message =
        (error as any)?.message ||
        'Failed to delete account. Please try again.';
      setErrorMessage(message);
      setSuccessMessage(null);
      setDeletingAccountId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedAccountId(null);
  };

  return {
    // data
    accounts,
    transactions,
    categories,
    // state
    showCreateForm,
    lastCreatedAccount,
    successMessage,
    errorMessage,
    activeSection,
    selectedAccountId,
    deletingAccountId,
    isLoading,
    searchQuery,
    actionAccountId,
    editingAccountId,
    selectedAccount,
    actionAccount,
    editingAccount,
    // handlers
    setShowCreateForm,
    setDeletingAccountId,
    setActionAccountId,
    setEditingAccountId,
    setSearchQuery,
    showSuccessMessage,
    showErrorMessage,
    handleSelectAccount,
    handleSectionChange,
    handleAccountAction,
    handleEditFromModal,
    handleDeleteFromModal,
    handleEditAccount,
    handleDeleteAccount,
    handleCloseDetails,
  } as const;
}

export type UseAccountsPageDataReturn = ReturnType<typeof useAccountsPageData>;
