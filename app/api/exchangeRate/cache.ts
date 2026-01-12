const CACHE_KEY = 'exchange_rates_cache';
const CACHE_DURATION_MS = 2 * 60 * 60 * 1000;

export interface ExchangeRate {
  [key: string]: number;
}

export function getCachedRates(): ExchangeRate | null {
  try {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) {
      return null;
    }

    const { rates, timestamp } = JSON.parse(cached);
    const now = Date.now();

    if (now - timestamp < CACHE_DURATION_MS) {
      return rates;
    }

    return null;
  } catch (error) {
    return null;
  }
}

export function setCachedRates(rates: ExchangeRate): void {
  try {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        rates,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.warn('Cache write error:', error);
  }
}

export const DEFAULT_RATES: ExchangeRate = {
  UAH: 1,
  USD: 42.0,
  EUR: 48.5,
};
