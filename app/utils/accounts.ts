import { Account } from '@/types/account';
import { formatCurrencyAmount } from './formatters';

export interface AccountStatistics {
  totalCount: number;
  totalBalance: number;
  byType: Record<Account['type'], { count: number; balance: number }>;
}

// filter account by type
export function filterAccountsByType(
  accounts: Account[],
  type: Account['type'] | 'all'
): Account[] {
  if (type === 'all') return accounts;
  return accounts.filter((account) => account.type === type);
}

// filter personal accounts (non-group accounts)
export function getPersonalAccounts(accounts: Account[]): Account[] {
  return accounts.filter((account) => !account.groupId);
}

// filter family accounts
export function getFamilyAccounts(accounts: Account[]): Account[] {
  return accounts.filter((account) => !!account.groupId);
}

// account statistics
export function calculateAccountStats(accounts: Account[]): AccountStatistics {
  const stats: AccountStatistics = {
    totalCount: accounts.length,
    totalBalance: 0,
    byType: {
      DEBIT: { count: 0, balance: 0 },
      CREDIT: { count: 0, balance: 0 },
      CASH: { count: 0, balance: 0 },
      BANK: { count: 0, balance: 0 },
      INVESTMENT: { count: 0, balance: 0 },
      DEPOSIT: { count: 0, balance: 0 },
      DIGITAL: { count: 0, balance: 0 },
      SAVINGS: { count: 0, balance: 0 },
    },
  };

  accounts.forEach((account) => {
    const type = account.type as Account['type'];
    stats.totalBalance += account.balance;
    stats.byType[type].count++;
    stats.byType[type].balance += account.balance;
  });

  return stats;
}

// account type display name
export function getAccountTypeName(type: Account['type']): string {
  const names: Record<Account['type'], string> = {
    DEBIT: 'Debit Card',
    CREDIT: 'Credit Card',
    CASH: 'Cash',
    BANK: 'Bank Account',
    INVESTMENT: 'Investment',
    DEPOSIT: 'Deposit',
    DIGITAL: 'Digital Wallet',
    SAVINGS: 'Savings',
  };
  return names[type] || type;
}

export function formatAccountsForWidget(accounts: Account[] | undefined) {
  if (!accounts) return [];

  return accounts.map((account) => ({
    id: account.id.toString(),
    name: account.name,
    type: getAccountTypeName(account.type),
    balance: formatCurrencyAmount(account.balance),
    currency: account.currency,
    change: 0,
  }));
}

// available account types
export const ACCOUNT_TYPES: Account['type'][] = [
  'DEBIT',
  'CREDIT',
  'CASH',
  'BANK',
  'INVESTMENT',
  'DEPOSIT',
  'DIGITAL',
  'SAVINGS',
];

// available currencies
export const CURRENCY_OPTIONS = ['USD', 'EUR', 'UAH'] as const;
