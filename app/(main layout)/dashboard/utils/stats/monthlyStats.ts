import { Transaction } from '@/types/transaction';
import { Account } from '@/types/account';
import calculatePeriodStats from './periodStats';

export default function calculateMonthlyStats(
  transactions: Transaction[],
  accounts: Account[]
) {
  return calculatePeriodStats(transactions, 'month', accounts);
}
