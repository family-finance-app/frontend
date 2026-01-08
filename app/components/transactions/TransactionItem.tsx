import { useState, useMemo } from 'react';
import * as RemixIcon from '@remixicon/react';
import TransactionActionModal from '../transactions/TransactionActionModal';
import { Transaction } from '@/types/transaction';
import { formatCurrencyAmount } from '@/utils/formatters';
import { jetbrainsMono } from '../../assets/fonts/fonts';

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

export default function TransactionItem({
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
  const categoryIcon = transaction.category?.icon || category?.icon;

  const transactionTitle = transaction.description || categoryName;

  const IconComponent = useMemo(() => {
    if (!categoryIcon) return null;
    const pascalCase = categoryIcon
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
    return (RemixIcon as any)[pascalCase] || null;
  }, [categoryIcon]);

  const accountData =
    transaction.account ||
    accounts.find((acc) => acc.id === transaction.accountId);
  const accountTitle = (accountData as any)?.name || 'Account';

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
                <p className="text-background-500 dark:text-primary-300 font-medium">
                  {accountTitle}
                </p>
                <span className="text-background-300">•</span>
              </>
            )}
            <p className="text-background-500 dark:text-background-200">
              {categoryName}
            </p>
            <span className="text-background-300">•</span>
            <p className="text-background-500 dark:text-background-400">
              {new Date(transaction.date).toLocaleDateString('uk-UA', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 justify-between w-full sm:w-auto sm:justify-end">
        <div
          className={`${jetbrainsMono.className} font-mono ${
            compact ? 'text-sm' : 'text-base'
          } ${config.color} whitespace-nowrap text-right`}
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
