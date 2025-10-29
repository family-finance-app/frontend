'use client';

import { useMyTransactions } from '@/api/transactions/queries';
import { useMyAccounts } from '@/api/accounts/queries';
import { useCategories } from '@/api/categories/queries';
import type { Transaction } from '@/types/transaction';

export default function RecentTransactions() {
  const { data: transactions, isLoading: txLoading } = useMyTransactions();
  const { data: accounts, isLoading: accLoading } = useMyAccounts();
  const { data: categories, isLoading: catLoading } = useCategories();

  const isLoading = txLoading || accLoading || catLoading;

  const accountsMap = new Map(
    (accounts || []).map((a) => [a.id, { name: a.name, currency: a.currency }])
  );
  const categoriesMap = new Map((categories || []).map((c) => [c.id, c.name]));

  const sortedRecent: Transaction[] = [...(transactions || [])]
    .sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return db - da;
    })
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="rounded-lg border p-4">
        <div className="h-5 w-40 animate-pulse rounded bg-gray-200 mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="h-4 w-48 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!sortedRecent.length) {
    return (
      <div className="rounded-lg border p-4">
        <h3 className="text-sm font-medium text-gray-600 mb-2">
          Последние транзакции
        </h3>
        <p className="text-sm text-gray-500">Пока нет транзакций</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-sm font-medium text-gray-600 mb-2">
        Recent trasactions
      </h3>
      <ul className="divide-y">
        {sortedRecent.map((tx) => {
          const account = accountsMap.get(tx.accountId);
          const accountName = account?.name ?? tx.account?.title ?? '—';
          const currency = account?.currency ?? tx.account?.currency ?? '';
          const categoryName =
            categoriesMap.get(tx.categoryId) ??
            tx.category?.name ??
            'Без категории';
          const isIncome = tx.type === 'INCOME';
          const sign = isIncome ? '+' : tx.type === 'EXPENSE' ? '-' : '';
          const amount = Number(tx.amount).toFixed(2);
          return (
            <li key={tx.id} className="flex items-center justify-between py-2">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-gray-900">
                  {categoryName}
                </div>
                <div className="truncate text-xs text-gray-500">
                  {accountName}
                </div>
              </div>
              <div
                className={
                  'ml-4 shrink-0 text-sm font-semibold ' +
                  (isIncome
                    ? 'text-emerald-600'
                    : tx.type === 'EXPENSE'
                    ? 'text-rose-600'
                    : 'text-gray-700')
                }
              >
                {sign}
                {amount}
                {currency ? ` ${currency}` : ''}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
