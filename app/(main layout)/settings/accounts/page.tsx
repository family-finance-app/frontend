'use client';

import { useState } from 'react';
import FinancialCard from '@/components/ui/FinancialCard';
import Button from '@/components/ui/Button_financial';
import { roboto, jetbrainsMono } from '@/assets/fonts/fonts';

// Mock data для аккаунтов
const mockAccounts = [
  {
    id: '1',
    name: 'Main Checking',
    type: 'BANK',
    balance: 8245.5,
    currency: 'USD',
    lastSync: '2025-10-29T10:30:00Z',
    isActive: true,
    isConnected: true,
    connectionStatus: 'healthy',
    institution: 'Chase Bank',
    accountNumber: '****1234',
    createdAt: '2024-01-15',
    lastTransaction: '2025-10-29',
    icon: '🏦',
  },
  {
    id: '2',
    name: 'High Yield Savings',
    type: 'DEPOSIT',
    balance: 15750.25,
    currency: 'USD',
    lastSync: '2025-10-29T09:15:00Z',
    isActive: true,
    isConnected: true,
    connectionStatus: 'healthy',
    institution: 'Marcus by Goldman Sachs',
    accountNumber: '****5678',
    createdAt: '2024-03-20',
    lastTransaction: '2025-10-28',
    icon: '💰',
  },
  {
    id: '3',
    name: 'Investment Portfolio',
    type: 'INVESTMENT',
    balance: 2850.75,
    currency: 'USD',
    lastSync: '2025-10-29T08:45:00Z',
    isActive: true,
    isConnected: true,
    connectionStatus: 'warning',
    institution: 'Fidelity',
    accountNumber: '****9012',
    createdAt: '2024-02-10',
    lastTransaction: '2025-10-27',
    icon: '📈',
  },
  {
    id: '4',
    name: 'Cash Wallet',
    type: 'CASH',
    balance: 320.0,
    currency: 'USD',
    lastSync: null,
    isActive: true,
    isConnected: false,
    connectionStatus: 'manual',
    institution: 'Manual Entry',
    accountNumber: 'N/A',
    createdAt: '2024-01-01',
    lastTransaction: '2025-10-26',
    icon: '💵',
  },
  {
    id: '5',
    name: 'Credit Card',
    type: 'CREDIT',
    balance: -1456.3,
    currency: 'USD',
    lastSync: '2025-10-29T11:00:00Z',
    isActive: true,
    isConnected: true,
    connectionStatus: 'error',
    institution: 'American Express',
    accountNumber: '****3456',
    createdAt: '2024-04-05',
    lastTransaction: '2025-10-29',
    icon: '💳',
  },
];

export default function AccountSettings() {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState<string | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-success-100 text-success-800';
      case 'warning':
        return 'bg-warning-100 text-warning-800';
      case 'error':
        return 'bg-danger-100 text-danger-800';
      case 'manual':
        return 'bg-background-100 text-background-800';
      default:
        return 'bg-background-100 text-background-800';
    }
  };

  const handleSync = (accountId: string) => {
    console.log('Syncing account:', accountId);
    // Here would be API call to sync account
  };

  const handleDeactivate = (accountId: string) => {
    console.log('Deactivating account:', accountId);
    setShowDeactivateModal(null);
    // Here would be API call to deactivate account
  };

  const handleDelete = (accountId: string) => {
    console.log('Deleting account:', accountId);
    setShowDeleteModal(null);
    // Here would be API call to delete account
  };

  const connectedAccounts = mockAccounts.filter(
    (acc) => acc.isConnected
  ).length;
  const healthyAccounts = mockAccounts.filter(
    (acc) => acc.connectionStatus === 'healthy'
  ).length;
  const accountsWithIssues = mockAccounts.filter((acc) =>
    ['warning', 'error'].includes(acc.connectionStatus)
  ).length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1
            className={`${roboto.className} text-3xl font-bold text-background-900 mb-2`}
          >
            Account Management
          </h1>
          <p className="text-background-600">
            Manage connections, sync settings, and account security
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

      {/* Management Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <FinancialCard
          title="Total Accounts"
          value={mockAccounts.length.toString()}
          description="All configured accounts"
          size="md"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          }
        />

        <FinancialCard
          title="Connected"
          value={connectedAccounts.toString()}
          description="Auto-sync enabled"
          size="md"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          }
        />

        <FinancialCard
          title="Healthy Status"
          value={healthyAccounts.toString()}
          description="Working properly"
          size="md"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />

        <FinancialCard
          title="Need Attention"
          value={accountsWithIssues.toString()}
          description="Connection issues"
          size="md"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          }
        />
      </div>

      {/* Accounts Management List */}
      <div className="bg-white rounded-2xl shadow-financial border border-background-100">
        <div className="p-6 border-b border-background-100">
          <h3
            className={`${roboto.className} text-lg font-semibold text-background-900`}
          >
            Account Configuration
          </h3>
          <p className="text-background-600 text-sm mt-1">
            Manage connection settings, sync preferences, and security options
          </p>
        </div>

        <div className="divide-y divide-background-100">
          {mockAccounts.map((account) => (
            <div
              key={account.id}
              className={`p-6 hover:bg-background-50 transition-colors ${
                selectedAccount === account.id
                  ? 'bg-primary-50 border-l-4 border-l-primary-500'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between">
                {/* Account Info */}
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">
                    {account.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4
                        className={`${roboto.className} font-semibold text-background-900`}
                      >
                        {account.name}
                      </h4>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          account.connectionStatus
                        )}`}
                      >
                        {account.connectionStatus}
                      </span>
                      {!account.isActive && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-background-100 text-background-600">
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-background-500">
                          Institution:
                        </span>
                        <span className="ml-2 text-background-900">
                          {account.institution}
                        </span>
                      </div>
                      <div>
                        <span className="text-background-500">Account:</span>
                        <span
                          className={`ml-2 ${jetbrainsMono.className} text-background-900`}
                        >
                          {account.accountNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-background-500">Balance:</span>
                        <span
                          className={`ml-2 ${
                            jetbrainsMono.className
                          } font-semibold ${
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-2">
                      <div>
                        <span className="text-background-500">Type:</span>
                        <span className="ml-2 text-background-900">
                          {account.type}
                        </span>
                      </div>
                      <div>
                        <span className="text-background-500">Created:</span>
                        <span className="ml-2 text-background-900">
                          {new Date(account.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-background-500">Last Sync:</span>
                        <span className="ml-2 text-background-900">
                          {account.lastSync
                            ? new Date(account.lastSync).toLocaleString()
                            : 'Manual entry'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() =>
                      setSelectedAccount(
                        selectedAccount === account.id ? null : account.id
                      )
                    }
                    className="p-2 text-background-600 hover:text-background-900 hover:bg-background-100 rounded-lg transition-colors"
                    title="Expand details"
                  >
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        selectedAccount === account.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {account.isConnected && (
                    <Button
                      text="Sync"
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleSync(account.id)}
                    />
                  )}

                  <Button
                    text="Edit"
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => console.log('Edit account:', account.id)}
                  />
                </div>
              </div>

              {/* Expanded Details */}
              {selectedAccount === account.id && (
                <div className="mt-6 pt-6 border-t border-background-100 animate-fade-in">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Connection Settings */}
                    <div className="bg-background-50 rounded-xl p-4">
                      <h5
                        className={`${roboto.className} font-semibold text-background-900 mb-3`}
                      >
                        Connection Settings
                      </h5>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-background-600">
                            Auto-sync enabled
                          </span>
                          <div
                            className={`w-12 h-6 bg-${
                              account.isConnected ? 'primary' : 'background'
                            }-200 rounded-full p-1 transition-colors`}
                          >
                            <div
                              className={`w-4 h-4 bg-white rounded-full transition-transform ${
                                account.isConnected
                                  ? 'translate-x-6'
                                  : 'translate-x-0'
                              }`}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-background-600">
                            Sync frequency
                          </span>
                          <span className="text-sm text-background-900">
                            Daily
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-background-600">
                            Last successful sync
                          </span>
                          <span className="text-sm text-background-900">
                            {account.lastSync
                              ? new Date(account.lastSync).toLocaleDateString()
                              : 'Never'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Account Actions */}
                    <div className="bg-background-50 rounded-xl p-4">
                      <h5
                        className={`${roboto.className} font-semibold text-background-900 mb-3`}
                      >
                        Account Actions
                      </h5>

                      <div className="space-y-2">
                        <Button
                          text="View Transaction History"
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            console.log('View transactions for:', account.id)
                          }
                          className="w-full justify-start"
                        />

                        <Button
                          text="Update Connection"
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            console.log('Update connection for:', account.id)
                          }
                          className="w-full justify-start"
                        />

                        <Button
                          text={
                            account.isActive
                              ? 'Deactivate Account'
                              : 'Activate Account'
                          }
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowDeactivateModal(account.id)}
                          className="w-full justify-start"
                        />

                        <Button
                          text="Delete Account"
                          type="button"
                          variant="brown"
                          size="sm"
                          onClick={() => setShowDeleteModal(account.id)}
                          className="w-full justify-start"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 animate-scale-in">
            <h3
              className={`${roboto.className} text-lg font-semibold text-background-900 mb-2`}
            >
              Deactivate Account
            </h3>
            <p className="text-background-600 mb-6">
              Are you sure you want to deactivate this account? You can
              reactivate it later, but it will stop syncing transactions.
            </p>
            <div className="flex items-center space-x-3">
              <Button
                text="Cancel"
                type="button"
                variant="outline"
                size="md"
                onClick={() => setShowDeactivateModal(null)}
                className="flex-1"
              />
              <Button
                text="Deactivate"
                type="button"
                variant="brown"
                size="md"
                onClick={() => handleDeactivate(showDeactivateModal)}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 animate-scale-in">
            <h3
              className={`${roboto.className} text-lg font-semibold text-brown-900 mb-2`}
            >
              Delete Account
            </h3>
            <p className="text-background-600 mb-6">
              <strong>Warning:</strong> This action cannot be undone. All
              transaction history for this account will be permanently deleted.
            </p>
            <div className="flex items-center space-x-3">
              <Button
                text="Cancel"
                type="button"
                variant="outline"
                size="md"
                onClick={() => setShowDeleteModal(null)}
                className="flex-1"
              />
              <Button
                text="Delete Forever"
                type="button"
                variant="brown"
                size="md"
                onClick={() => handleDelete(showDeleteModal)}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
