import { Account } from '@/types/account';

export type AccountType =
  | 'DEBIT'
  | 'CREDIT'
  | 'CASH'
  | 'BANK'
  | 'INVESTMENT'
  | 'DEPOSIT'
  | 'DIGITAL'
  | 'SAVINGS';

export interface AccountStatistics {
  totalCount: number;
  totalBalance: number;
  byType: Record<AccountType, { count: number; balance: number }>;
}

/**
 * Filter accounts by type
 */
export function filterAccountsByType(
  accounts: Account[],
  type: AccountType | 'all'
): Account[] {
  if (type === 'all') return accounts;
  return accounts.filter((account) => account.type === type);
}

/**
 * Filter personal accounts (non-group accounts)
 */
export function getPersonalAccounts(accounts: Account[]): Account[] {
  return accounts.filter((account) => !account.groupId);
}

/**
 * Filter family accounts (group accounts)
 */
export function getFamilyAccounts(accounts: Account[]): Account[] {
  return accounts.filter((account) => !!account.groupId);
}

/**
 * Calculate account statistics
 */
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
    const type = account.type as AccountType;
    stats.totalBalance += account.balance;
    stats.byType[type].count++;
    stats.byType[type].balance += account.balance;
  });

  return stats;
}

/**
 * Get account type display name
 */
export function getAccountTypeName(type: AccountType): string {
  const names: Record<AccountType, string> = {
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

// Define available account types
export const ACCOUNT_TYPES: AccountType[] = [
  'DEBIT',
  'CREDIT',
  'CASH',
  'BANK',
  'INVESTMENT',
  'DEPOSIT',
  'DIGITAL',
  'SAVINGS',
];

// Define available currencies
export const CURRENCY_OPTIONS = ['USD', 'EUR', 'UAH'] as const;
