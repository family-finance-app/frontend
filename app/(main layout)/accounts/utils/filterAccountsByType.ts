import { Account } from '../types';

export default function filterAccountsByType(
  accounts: Account[],
  type: Account['type'] | 'all'
): Account[] {
  if (type === 'all') return accounts;
  return accounts.filter((account) => account.type === type);
}
