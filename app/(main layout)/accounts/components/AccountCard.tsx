'use client';

import { Account } from '../types';
import { accountTypeName } from '../utils';
import { cardColorStyles } from '../utils';

import { formatCurrencyAmount } from '@/utils/formatters';

import { roboto, jetbrainsMono } from '@/assets/fonts/fonts';

interface AccountCardProps {
  account: Account;
  onClick?: (accountId: number) => void;
  onActionClick?: (accountId: number, event: React.MouseEvent) => void;
  isSelected?: boolean;
}

export default function AccountCard({
  account,
  onClick,
  onActionClick,
  isSelected = false,
}: AccountCardProps) {
  const colors = cardColorStyles(account.type);

  const handleClick = () => {
    onClick?.(account.id);
  };

  const handleActionClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onActionClick?.(account.id, event);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.(account.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={`block w-full h-full text-left rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-primary-900 transition-all cursor-pointer ${
        isSelected
          ? 'ring-3 ring-primary-500 dark:ring-background-200'
          : 'hover:ring-2 hover:ring-primary-200 dark:hover:ring-primary-600'
      }`}
      aria-label={`View ${account.name} account details`}
    >
      <article className="rounded-2xl h-full flex flex-col bg-white dark:bg-primary-800 shadow-financial transition-all duration-200 md:hover:scale-[1.02] hover:shadow-financial-lg p-5 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4
              className={`${roboto.className} font-semibold text-background-900 dark:text-background-50`}
            >
              {account.name}
            </h4>

            <p className={`text-sm font-medium ${colors.accent}`}>
              {accountTypeName(account.type)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-background-50 text-background-600 dark:bg-primary-700/50 dark:text-background-100">
              {account.currency}
            </span>
            <button
              onClick={handleActionClick}
              className="p-2 hover:bg-background-100 dark:hover:bg-background-600 rounded-lg transition-colors duration-200"
              title="Edit or delete account"
            >
              <span className="dark:text-background-100 text-lg leading-none">
                ⋯
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-baseline space-x-2 mt-auto">
          <span
            className={`${jetbrainsMono.className} text-2xl font-bold text-background-900 dark:text-background-50`}
          >
            {formatCurrencyAmount(account.balance)}
          </span>
          <span className="text-sm text-background-500 dark:text-background-200">
            {account.balance >= 0 ? 'available' : 'overdraft'}
          </span>
        </div>
      </article>
    </div>
  );
}
