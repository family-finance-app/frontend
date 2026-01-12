import { Account } from '../types';

interface AccountStatistics {
  totalCount: number;
  totalUAHBalance: number;
  totalEURBalance: number;
  totalUSDBalance: number;
  accounts: Account[];
  byType: Record<Account['type'], { count: number; balance: number }>;
}

// calculates aggregated statistics for accounts filtered by group (personal/family)
export default function calculateAccountStatsByGroup(
  accounts: Account[],
  group: 'personal' | 'family'
): AccountStatistics {
  const filteredAccountsByGroup =
    group === 'personal'
      ? accounts.filter((account) => !account.groupId)
      : accounts.filter((account) => !!account.groupId);

  const stats: AccountStatistics = {
    totalCount: filteredAccountsByGroup.length,
    totalUAHBalance: 0,
    totalEURBalance: 0,
    totalUSDBalance: 0,
    accounts: filteredAccountsByGroup,
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

  filteredAccountsByGroup.forEach((account) => {
    const type = account.type as Account['type'];
    const balance = parseFloat(String(account.balance)) || 0;

    if (account.currency === 'UAH') {
      stats.totalUAHBalance += balance;
    } else if (account.currency === 'EUR') {
      stats.totalEURBalance += balance;
    } else if (account.currency === 'USD') {
      stats.totalUSDBalance += balance;
    }

    stats.byType[type].count++;
    stats.byType[type].balance += balance;
  });

  return stats;
}
