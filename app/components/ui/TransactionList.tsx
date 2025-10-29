'use client';

import { ReactNode, useState } from 'react';
import { jetbrainsMono } from '../../assets/fonts/fonts';
import { Transaction } from '@/types/transaction';
import { useCategories } from '@/api/categories/queries';
import TransactionActionModal from './TransactionActionModal';

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
  onEditTransaction?: (transaction: Transaction) => void;
}

function TransactionItem({
  transaction,
  showAccount = false,
  compact = false,
  categories = [],
  onEdit,
}: TransactionItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const typeConfig = {
    INCOME: {
      color: 'text-success-600',
      bgColor: 'bg-success-50',
      icon: '↗',
      prefix: '+',
    },
    EXPENSE: {
      color: 'text-danger-600',
      bgColor: 'bg-danger-50',
      icon: '↙',
      prefix: '-',
    },
    TRANSFER: {
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      icon: '⇄',
      prefix: '',
    },
  } as const;

  const config =
    typeConfig[transaction.type as keyof typeof typeConfig] ||
    typeConfig.EXPENSE;

  // Find category by ID
  const category = categories.find((cat) => cat.id === transaction.categoryId);
  const categoryName = transaction.category?.name || category?.name || 'Other';

  return (
    <div
      className={`flex items-center justify-between ${
        compact ? 'py-2' : 'py-3'
      } border-b border-background-100 last:border-b-0 hover:bg-background-50 transition-colors duration-200`}
    >
      <div className="flex items-center space-x-3 flex-1">
        {/* Type Icon */}
        <div
          className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center text-sm`}
        >
          {config.icon}
        </div>

        {/* Transaction Details */}
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <p
              className={`font-medium ${
                compact ? 'text-sm' : 'text-base'
              } text-background-900`}
            >
              {categoryName !== 'Other'
                ? categoryName
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
            {/* Show category info */}
            <p
              className={`text-background-500 ${
                compact ? 'text-xs' : 'text-sm'
              }`}
            >
              {categoryName}
            </p>
            {showAccount && transaction.account && (
              <>
                <span className="text-background-300">•</span>
                <p
                  className={`text-background-500 ${
                    compact ? 'text-xs' : 'text-sm'
                  }`}
                >
                  {transaction.account.title || 'Account'}
                </p>
              </>
            )}
            <span className="text-background-300">•</span>
            <p
              className={`text-background-500 ${
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

      {/* Amount and Action Button */}
      <div className="flex items-center space-x-3">
        <div
          className={`${jetbrainsMono.className} font-semibold ${
            compact ? 'text-sm' : 'text-base'
          } ${config.color} whitespace-nowrap`}
        >
          {config.prefix}
          {Math.abs(transaction.amount).toLocaleString()}{' '}
          {transaction.account?.currency || 'UAH'}
        </div>

        {/* Edit Menu Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 hover:bg-background-100 rounded-lg transition-colors duration-200"
          title="Edit or delete transaction"
        >
          ⋯
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
  onEditTransaction,
}: TransactionListProps) {
  const { data: categories = [] } = useCategories();

  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = (a.date || a.createdAt || '').toString();
    const dateB = (b.date || b.createdAt || '').toString();
    return dateB.localeCompare(dateA);
  });

  const displayTransactions = maxItems
    ? sortedTransactions.slice(0, maxItems)
    : sortedTransactions;

  return (
    <div className="bg-white rounded-2xl shadow-financial border border-background-100">
      {showHeader && (
        <div className="flex items-center justify-between p-6 border-b border-background-100">
          <h3 className="text-lg font-semibold text-background-900">{title}</h3>
          {actions}
        </div>
      )}

      <div className={showHeader ? 'p-6' : 'p-4'}>
        {displayTransactions.length === 0 ? (
          <div className="text-center py-8 text-background-500">
            <div className="text-4xl mb-2">💸</div>
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
                onEdit={onEditTransaction}
              />
            ))}
          </div>
        )}

        {maxItems && transactions.length > maxItems && (
          <div className="mt-4 pt-4 border-t border-background-100">
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all {transactions.length} transactions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export { TransactionItem };
