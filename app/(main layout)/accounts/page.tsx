'use client';

import { useState } from 'react';
import CreateAccountForm from '@/components/accounts/CreateAccountForm';
import FinancialCard from '@/components/ui/FinancialCard';
import Button from '@/components/ui/Button_financial';
import { roboto, jetbrainsMono } from '@/assets/fonts/fonts';

// Mock data для аккаунтов - в реальном приложении это будет из API
const mockAccounts = [
  {
    id: '1',
    name: 'Main Checking',
    type: 'BANK',
    balance: 8245.5,
    currency: 'USD',
    change: 2.3,
    lastTransaction: '2025-10-29',
    isActive: true,
    icon: '🏦',
    description: 'Primary bank account',
  },
  {
    id: '2',
    name: 'High Yield Savings',
    type: 'DEPOSIT',
    balance: 15750.25,
    currency: 'USD',
    change: 1.8,
    lastTransaction: '2025-10-28',
    isActive: true,
    icon: '💰',
    description: 'Emergency fund savings',
  },
  {
    id: '3',
    name: 'Investment Portfolio',
    type: 'INVESTMENT',
    balance: 2850.75,
    currency: 'USD',
    change: -0.5,
    lastTransaction: '2025-10-27',
    isActive: true,
    icon: '📈',
    description: 'Stock and bond investments',
  },
  {
    id: '4',
    name: 'Cash Wallet',
    type: 'CASH',
    balance: 320.0,
    currency: 'USD',
    change: 0.0,
    lastTransaction: '2025-10-26',
    isActive: true,
    icon: '💵',
    description: 'Physical cash on hand',
  },
  {
    id: '5',
    name: 'Credit Card',
    type: 'CREDIT',
    balance: -1456.3,
    currency: 'USD',
    change: -12.5,
    lastTransaction: '2025-10-29',
    isActive: true,
    icon: '💳',
    description: 'Visa credit card',
  },
];

export default function Accounts() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [lastCreatedAccount, setLastCreatedAccount] = useState<string | null>(
    null
  );
  const [filterType, setFilterType] = useState<
    'all' | 'BANK' | 'CREDIT' | 'CASH' | 'INVESTMENT' | 'DEPOSIT'
  >('all');

  const showSuccessMessage = (accountName: string) => {
    setShowCreateForm(false);
    setLastCreatedAccount(accountName);
    setTimeout(() => setLastCreatedAccount(null), 3000);
  };

  // Фильтрация аккаунтов
  const filteredAccounts = mockAccounts.filter((account) => {
    if (filterType === 'all') return true;
    return account.type === filterType;
  });

  // Подсчет статистики
  const totalBalance = mockAccounts.reduce((sum, account) => {
    return account.type === 'CREDIT'
      ? sum + account.balance
      : sum + account.balance;
  }, 0);

  const assetsTotal = mockAccounts
    .filter((account) => account.type !== 'CREDIT')
    .reduce((sum, account) => sum + account.balance, 0);

  const liabilitiesTotal = mockAccounts
    .filter((account) => account.type === 'CREDIT')
    .reduce((sum, account) => sum + Math.abs(account.balance), 0);

  const activeAccounts = mockAccounts.filter(
    (account) => account.isActive
  ).length;

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {lastCreatedAccount && (
        <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-xl animate-fade-in">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">
              Account "{lastCreatedAccount}" successfully created!
            </span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1
            className={`${roboto.className} text-3xl font-bold text-background-900 mb-2`}
          >
            Financial Accounts
          </h1>
          <p className="text-background-600">
            Manage your bank accounts, cards, and investment portfolios
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button
            text="Manage Accounts"
            type="button"
            variant="outline"
            size="md"
            onClick={() => (window.location.href = '/settings/accounts')}
          />
          <Button
            text={showCreateForm ? 'Cancel' : '+ Add Account'}
            type="button"
            variant={showCreateForm ? 'outline' : 'primary'}
            size="md"
            onClick={() => setShowCreateForm(!showCreateForm)}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <FinancialCard
          title="Net Worth"
          value={totalBalance}
          change={{
            value: 1234.5,
            type: 'positive',
            period: 'this month',
          }}
          description="Assets - Liabilities"
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
        />

        <FinancialCard
          title="Total Assets"
          value={assetsTotal}
          change={{
            value: 890.25,
            type: 'positive',
            period: 'this month',
          }}
          description="All positive balances"
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
                d="M7 11l5-5m0 0l5 5m-5-5v12"
              />
            </svg>
          }
        />

        <FinancialCard
          title="Total Liabilities"
          value={liabilitiesTotal}
          change={{
            value: 156.3,
            type: 'negative',
            period: 'this month',
          }}
          description="Credit card debt"
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
                d="M17 13l-5 5m0 0l-5-5m5 5V6"
              />
            </svg>
          }
        />

        <FinancialCard
          title="Active Accounts"
          value={activeAccounts.toString()}
          change={{
            value: '1',
            type: 'positive',
            period: 'this month',
          }}
          description="Connected accounts"
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
      </div>

      {/* Create Account Form */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl shadow-financial border border-background-100 p-6 animate-scale-in">
          <h3
            className={`${roboto.className} text-lg font-semibold mb-6 text-background-900`}
          >
            Create New Account
          </h3>
          <CreateAccountForm
            onSuccess={showSuccessMessage}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {/* Account Type Filter */}
      <div className="bg-white rounded-2xl shadow-financial border border-background-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h3
              className={`${roboto.className} text-lg font-semibold text-background-900 mb-2`}
            >
              Your Accounts
            </h3>
            <p className="text-background-600 text-sm">
              {filteredAccounts.length} of {mockAccounts.length} accounts shown
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-background-700">
              Filter by type:
            </span>
            <div className="flex bg-background-100 rounded-xl p-1">
              {(
                [
                  'all',
                  'BANK',
                  'CREDIT',
                  'CASH',
                  'INVESTMENT',
                  'DEPOSIT',
                ] as const
              ).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    filterType === type
                      ? 'bg-white text-primary-700 shadow-sm'
                      : 'text-background-600 hover:text-background-900'
                  }`}
                >
                  {type === 'all' ? 'All' : type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccounts.map((account) => (
          <div
            key={account.id}
            className="bg-white rounded-2xl shadow-financial border border-background-100 p-6 hover:shadow-lg transition-all duration-200 hover:scale-105 group"
          >
            {/* Account Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-primary-200 transition-colors">
                  {account.icon}
                </div>
                <div>
                  <h4
                    className={`${roboto.className} font-semibold text-background-900`}
                  >
                    {account.name}
                  </h4>
                  <p className="text-sm text-background-600">{account.type}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    account.isActive
                      ? 'bg-success-100 text-success-800'
                      : 'bg-background-100 text-background-800'
                  }`}
                >
                  {account.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Balance */}
            <div className="mb-4">
              <div className="flex items-baseline space-x-2">
                <span
                  className={`${jetbrainsMono.className} text-2xl font-bold ${
                    account.balance >= 0
                      ? 'text-background-900'
                      : 'text-danger-600'
                  }`}
                >
                  {account.balance >= 0 ? '$' : '-$'}
                  {Math.abs(account.balance).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </span>
                <span className="text-sm text-background-500">
                  {account.currency}
                </span>
              </div>

              {account.change !== 0 && (
                <div
                  className={`flex items-center space-x-1 mt-2 ${
                    account.change > 0 ? 'text-success-600' : 'text-danger-600'
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {account.change > 0 ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 11l5-5m0 0l5 5m-5-5v12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 13l-5 5m0 0l-5-5m5 5V6"
                      />
                    )}
                  </svg>
                  <span className="text-sm font-medium">
                    {Math.abs(account.change)}% this month
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-background-600 mb-4">
              {account.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-background-100">
              <span className="text-xs text-background-500">
                Last transaction:{' '}
                {new Date(account.lastTransaction).toLocaleDateString()}
              </span>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}

        {/* Add New Account Card */}
        <div
          onClick={() => setShowCreateForm(true)}
          className="bg-background-50 border-2 border-dashed border-background-300 rounded-2xl p-6 hover:bg-background-100 hover:border-primary-400 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[280px] group"
        >
          <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
            <svg
              className="w-8 h-8 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <h4
            className={`${roboto.className} text-lg font-semibold text-background-900 mb-2`}
          >
            Add New Account
          </h4>
          <p className="text-sm text-background-600 text-center">
            Connect a bank account, credit card, or other financial account
          </p>
        </div>
      </div>

      {/* Empty State */}
      {filteredAccounts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-background-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-background-400"
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
          </div>
          <h3
            className={`${roboto.className} text-lg font-semibold text-background-900 mb-2`}
          >
            No accounts found
          </h3>
          <p className="text-background-600 mb-4">
            No accounts match the selected filter. Try changing the filter or
            create a new account.
          </p>
          <Button
            text="Create Account"
            type="button"
            variant="primary"
            size="md"
            onClick={() => setShowCreateForm(true)}
          />
        </div>
      )}
    </div>
  );
}
