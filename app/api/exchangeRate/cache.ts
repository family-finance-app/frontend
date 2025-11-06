const CACHE_KEY = 'exchange_rates_cache';

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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cacheDate = new Date(timestamp);
    cacheDate.setHours(0, 0, 0, 0);
    if (cacheDate.getTime() === today.getTime()) {
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
    console.warn('❌ Cache write error:', error);
  }
}

export const DEFAULT_RATES: ExchangeRate = {
  UAH: 1,
  USD: 42.0,
  EUR: 48.5,
};
