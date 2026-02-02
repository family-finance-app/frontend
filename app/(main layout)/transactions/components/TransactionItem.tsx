import { useState, useMemo } from 'react';
import * as RemixIcon from '@remixicon/react';

import { Transaction } from '../types';

import { formatCurrencyAmount, transactionFormatters } from '@/utils';

import { ActionModal } from '@/components';

import { jetbrainsMono } from '../../../assets/fonts/fonts';

interface TransactionItemProps {
  transaction: Transaction;
  showAccount?: boolean;
  compact?: boolean;
  categories?: Array<{
    id: number;
    name: string;
    type: string;
    icon?: string;
    color?: string;
  }>;
  accounts?: Array<{
    id: number;
    name: string;
    type: string;
    currency: string;
  }>;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: number) => void;
}

export default function TransactionItem({
  transaction,
  showAccount = false,
  compact = false,
  categories = [],
  accounts = [],
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const typeConfig = {
    INCOME: {
      color: 'text-success-700 dark:text-primary-200',
      bgColor: 'bg-success-50',
      icon: '↗',
      prefix: '+',
    },
    EXPENSE: {
      color: 'text-danger-700 dark:text-danger-300',
      bgColor: 'bg-danger-50',
      icon: '↙',
      prefix: '-',
    },
    TRANSFER: {
      color: 'text-kashmir-500 dark:text-stack-200',
      bgColor: 'bg-primary-50',
      icon: '⇄',
      prefix: '',
    },
  } as const;

  const config =
    typeConfig[transaction.type as keyof typeof typeConfig] ||
    typeConfig.EXPENSE;

  const category = categories.find((cat) => cat.id === transaction.categoryId);
  const categoryName = transaction.categoryName || category?.name || 'Other';
  const categoryIcon = category?.icon;

  const transactionTitle = transaction.description || categoryName;

  const IconComponent = useMemo(() => {
    if (!categoryIcon) return null;
    const pascalCase = categoryIcon
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
    return (RemixIcon as any)[pascalCase] || null;
  }, [categoryIcon]);

  const accountData = accounts.find((acc) => acc.id === transaction.accountId);
  const accountTitle = accountData?.name || 'Account';

  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${
        compact ? 'py-2' : 'py-3'
      } border-b border-background-100 last:border-b-0 transition-colors duration-200`}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div
          className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center text-sm`}
        >
          {IconComponent ? <IconComponent className="w-5 h-5" /> : config.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p
              className={`font-medium ${
                compact ? 'text-sm' : 'text-base'
              } text-background-900 dark:text-background-50`}
            >
              {transactionTitle !== 'Other'
                ? transactionTitle
                : transaction.type === 'INCOME'
                  ? 'Income'
                  : transaction.type === 'EXPENSE'
                    ? 'Expense'
                    : transaction.type === 'TRANSFER'
                      ? 'Transfer'
                      : 'Transaction'}
            </p>
          </div>
          <div
            className={`mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 ${
              compact ? 'text-xs' : 'text-sm'
            }`}
          >
            {accountData && (
              <>
                <div
                  className="flex justify-between items-start w-full lg:hidden md:hidden"
                  id="mobile"
                >
                  <div className="flex flex-col">
                    <p className="text-background-500 dark:text-primary-300 font-medium text-sm">
                      {accountTitle}
                    </p>
                    <p className="text-background-500 dark:text-background-400 text-xs mt-0.5">
                      {new Date(transaction.date).toLocaleDateString('uk-UA', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="flex flex-col items-end">
                    <p
                      className={`${jetbrainsMono.className} font-mono ${config.color} text-sm whitespace-nowrap`}
                    >
                      {config.prefix}
                      {formatCurrencyAmount(transaction.amount)}{' '}
                      {transaction.currency || 'UAH'}
                    </p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="p-1 mt-0.5 hover:bg-background-100 dark:hover:bg-background-600 rounded-lg transition-colors duration-200"
                      title="Edit or delete transaction"
                    >
                      <span className="dark:text-background-100 text-base">
                        ⋯
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
            <p className="hidden md:block text-background-500 dark:text-primary-300 font-medium text-sm">
              {accountTitle}
            </p>
            <span className="hidden md:block text-background-300">•</span>
            <p className="hidden md:block text-background-500 dark:text-background-200">
              {categoryName}
            </p>
            <span className="hidden md:block text-background-300">•</span>
            <p className="hidden md:block text-background-500 dark:text-background-400">
              {new Date(transaction.date).toLocaleDateString('uk-UA', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3 justify-between w-full sm:w-auto sm:justify-end">
        <div
          className={`${jetbrainsMono.className} font-mono ${
            compact ? 'text-sm' : 'text-base'
          } ${config.color} whitespace-nowrap text-right`}
        >
          {config.prefix}
          {`${formatCurrencyAmount(transaction.amount)} `}
          {transaction.currency || 'UAH'}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 hover:bg-background-100 dark:hover:bg-background-600 rounded-lg transition-colors duration-200"
          title="Edit or delete transaction"
        >
          <span className="dark:text-background-100">⋯</span>
        </button>
      </div>

      <ActionModal
        modalTitle="Transaction Actions"
        data={
          <>
            <div className="rounded-xl  bg-background-50 dark:bg-stack-200">
              <div className="flex">
                <h3 className="text-lg font-semibold text-primary-700 mr-1.5">
                  {transaction.type === 'EXPENSE' && (
                    <span className="text-danger-700">
                      -{formatCurrencyAmount(transaction.amount)}{' '}
                      {transaction.currency || 'UAH'}{' '}
                    </span>
                  )}
                  {transaction.type === 'INCOME' && (
                    <span className="text-success-700">
                      +{formatCurrencyAmount(transaction.amount)}{' '}
                      {transaction.currency || 'UAH'}{' '}
                    </span>
                  )}
                  {transaction.type === 'TRANSFER' && (
                    <span className="text-primary-00">
                      {formatCurrencyAmount(transaction.amount)}{' '}
                      {transaction.currency || 'UAH'}{' '}
                    </span>
                  )}
                </h3>
                <p className="text-sm text-background-500 dark:text-primary-700 mt-1">
                  {accountTitle || 'Account'}
                </p>
              </div>

              <h4 className="text-background-600">
                {transaction.description ||
                  transactionFormatters.typeLabel(transaction.type)}
              </h4>
            </div>
          </>
        }
        actionButtons={[
          {
            text: 'Edit Transaction',
            type: 'button',
            variant: 'primary',
            action: () => {
              setIsModalOpen(false);
              onEdit?.(transaction);
            },
          },
          {
            text: 'Delete Transaction',
            type: 'button',
            variant: 'danger',
            action: () => {
              setIsModalOpen(false);
              onDelete?.(transaction.id);
            },
          },
        ]}
        onClose={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
      />
    </div>
  );
}
