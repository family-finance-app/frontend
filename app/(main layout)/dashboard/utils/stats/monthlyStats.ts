import { Transaction } from '@/(main layout)/transactions/types';
import { Account } from '@/(main layout)/accounts/types';
import { periodStats } from '..';

export default function calculateMonthlyStats(
  transactions: Transaction[],
  accounts: Account[]
) {
  return periodStats(transactions, 'month', accounts);
}
