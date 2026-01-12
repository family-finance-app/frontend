'use client';

import { Account } from '../types';
import { roboto, jetbrainsMono } from '@/assets/fonts/fonts';
import { accountTypeName } from '../utils';
import { formatCurrencyAmount } from '@/utils/formatters';
import getCardColorStyles from '@/(main layout)/accounts/utils/cardColorStyles';
import Link from 'next/link';

interface AccountCardProps {
  account: Account;
}

export default function AccountCard({ account }: AccountCardProps) {
  const colors = getCardColorStyles(account.type);

  return (
    <Link
      href={`/settings/accounts?accountId=${account.id}`}
      className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-primary-900"
      aria-label={`View ${account.name} account details`}
    >
      <article className="rounded-2xl border border-background-100 bg-white dark:bg-primary-800 shadow-financial transition-all duration-200 md:hover:scale-[1.02] hover:shadow-financial-lg p-5 sm:p-6">
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

          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-background-50 text-background-600 dark:bg-primary-700/50 dark:text-background-100">
            {account.currency}
          </span>
        </div>

        <div className="flex items-baseline space-x-2">
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
    </Link>
  );
}
