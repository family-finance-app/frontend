import type { Account } from '@/types/account';
import type { ExchangeRate } from '@/api/exchangeRate/cache';
import { DEFAULT_RATES } from '@/api/exchangeRate/cache';

// converts amount from one currency to UAH
export function convertToUAH(
  amount: number,
  fromCurrency: string,
  rates: ExchangeRate
): number {
  const currency = fromCurrency.toUpperCase();

  if (currency === 'UAH') {
    return amount;
  }

  const rate = rates[currency];
  if (!rate) {
    console.warn(
      `⚠️ Exchange rate for ${currency} not found, using default rates`
    );
    const defaultRate = DEFAULT_RATES[currency] || 1;
    const converted = amount * defaultRate;
    return converted;
  }

  const converted = amount * rate;
  return converted;
}

// calculate total balance in UAH from accounts with different currencies, uses provided rates from useExchangeRates hook
export function calculateTotalBalanceInUAH(
  accounts: Account[] | undefined,
  rates: ExchangeRate
): number {
  if (!accounts || accounts.length === 0) {
    return 0;
  }

  let totalInUAH = 0;

  accounts.forEach((account) => {
    const balance = Number(account.balance) || 0;
    const currency = account.currency || 'UAH';
    const balanceInUAH = convertToUAH(balance, currency, rates);
    totalInUAH += balanceInUAH;
  });
  return totalInUAH;
}

// calculate total balance without currency conversion (only use if all accounts are in same currency)
export function calculateSimpleTotalBalance(
  accounts: Account[] | undefined
): number {
  return (
    accounts?.reduce((sum, account) => {
      const balance = Number(account.balance) || 0;
      return sum + balance;
    }, 0) || 0
  );
}
