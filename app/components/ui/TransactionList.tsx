'use client';

import { ReactNode, useState } from 'react';
import { jetbrainsMono } from '../../assets/fonts/fonts';
import { Transaction } from '@/types/transaction';
import TransactionActionModal from './TransactionActionModal';
import { formatCurrencyAmount } from '@/utils/formatters';

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
}

interface TransactionListProps {
  transactions: Transaction[];
  title?: string;
  showHeader?: boolean;
  maxItems?: number;
  emptyMessage?: string;
  showAccount?: boolean;
  compact?: boolean;
  actions?: ReactNode;
  accounts?: Array<{
    id: number;
    name: string;
    type: string;
    currency: string;
  }>;
  categories?: Array<{
    id: number;
    name: string;
    type: string;
    icon?: string;
    color?: string;
  }>;
  onEditTransaction?: (transaction: Transaction) => void;
}

function TransactionItem({
  transaction,
  showAccount = false,
  compact = false,
  categories = [],
  accounts = [],
  onEdit,
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
  const categoryName = transaction.category?.name || category?.name || 'Other';

  const transactionTitle = transaction.description || categoryName;

  const accountData =
    transaction.account ||
    accounts.find((acc) => acc.id === transaction.accountId);
  const accountTitle =
    (accountData as any)?.title || (accountData as any)?.name || 'Account';

  return (
    <div
      className={`flex items-center justify-between ${
        compact ? 'py-2' : 'py-3'
      } border-b border-background-100 last:border-b-0  transition-colors duration-200`}
    >
      <div className="flex items-center space-x-3 flex-1">
        <div
          className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center text-sm`}
        >
          {config.icon}
        </div>

        <div className="flex-1">
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
          <div className="flex items-center space-x-3 mt-1">
            {accountData && (
              <>
                <p
                  className={`text-background-500 dark:text-primary-300 font-medium ${
                    compact ? 'text-xs' : 'text-sm'
                  }`}
                >
                  {accountTitle}
                </p>
                <span className="text-background-300 ">•</span>
              </>
            )}
            <p
              className={`text-background-500 dark:text-background-200 ${
                compact ? 'text-xs' : 'text-sm'
              }`}
            >
              {categoryName}
            </p>
            <span className="text-background-300">•</span>
            <p
              className={`text-background-500 dark:text-background-400 ${
                compact ? 'text-xs' : 'text-sm'
              }`}
            >
              {new Date(transaction.date).toLocaleDateString('uk-UA', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div
          className={`${jetbrainsMono.className} font-mono ${
            compact ? 'text-sm' : 'text-base'
          } ${config.color} whitespace-nowrap`}
        >
          {config.prefix}
          {`${formatCurrencyAmount(transaction.amount)} `}
          {transaction.account?.currency || 'UAH'}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 hover:bg-background-100 dark:hover:bg-background-600 rounded-lg transition-colors duration-200"
          title="Edit or delete transaction"
        >
          <span className="dark:text-background-100">⋯</span>
        </button>
      </div>

      {/* Modal */}
      <TransactionActionModal
        transaction={transaction}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEdit={onEdit}
      />
    </div>
  );
}

export default function TransactionList({
  transactions,
  title = 'Recent Transactions',
  showHeader = true,
  maxItems,
  emptyMessage = 'No transactions found',
  showAccount = false,
  compact = false,
  actions,
  accounts = [],
  categories = [],
  onEditTransaction,
}: TransactionListProps) {
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    if (dateA === dateB) {
      return b.id - a.id;
    }

    return dateB - dateA;
  });

  const displayTransactions = maxItems
    ? sortedTransactions.slice(0, maxItems)
    : sortedTransactions;

  return (
    <div className="bg-white dark:bg-primary-800 rounded-2xl shadow-financial border border-background-100 dark:border-background-700">
      {showHeader && (
        <div className="flex items-center justify-between p-6 border-b border-background-100">
          <h3 className="text-lg font-semibold text-background-900 dark:text-stack-100">
            {title}
          </h3>
          {actions}
        </div>
      )}

      <div className={showHeader ? 'p-6' : 'p-4'}>
        {displayTransactions.length === 0 ? (
          <div className="text-center py-8 text-background-500 dark:text-stack-100">
            <div className="text-4xl mb-2"></div>
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-0">
            {displayTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                showAccount={showAccount}
                compact={compact}
                categories={categories}
                accounts={accounts}
                onEdit={onEditTransaction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export { TransactionItem };
