'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import {
  getCachedRates,
  setCachedRates,
  ExchangeRate,
  DEFAULT_RATES,
} from '@/api/exchangeRate/cache';

export interface CurrencyRateResponse {
  currencyCodeA: number;
  currencyCodeB: number;
  date: number;
  rateSell: number;
  rateBuy: number;
  rateCross: number;
}

const MONO_EXCHANGE_API_URL = process.env.NEXT_PUBLIC_MONO_EXCHANGE_API_URL;

async function fetchExchangeRates(
  cachedRates: ExchangeRate | null
): Promise<ExchangeRate> {
  try {
    const data = await apiClient.externalGet<CurrencyRateResponse[]>(
      MONO_EXCHANGE_API_URL || 'https://api.monobank.ua/bank/currency'
    );

    const rates: ExchangeRate = { UAH: 1 };

    data.forEach((item) => {
      if (item.currencyCodeA === 840 && item.currencyCodeB === 980) {
        rates.USD = item.rateCross || item.rateSell;
      } else if (item.currencyCodeA === 978 && item.currencyCodeB === 980) {
        rates.EUR = item.rateCross || item.rateSell;
      }
    });

    return rates;
  } catch (error) {
    if (cachedRates) {
      console.warn('API request failed, using cached exchange rates');
      return cachedRates;
    }
    console.warn(
      'Using fallback exchange rates (API unavailable and no cache)'
    );
    return DEFAULT_RATES;
  }
}

export const useExchangeRates = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['exchange-rates'],
    queryFn: async (): Promise<ExchangeRate> => {
      const cached = getCachedRates();
      if (cached) {
        return cached;
      }
      const rates = await fetchExchangeRates(cached);
      setCachedRates(rates);
      return rates;
    },
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    function scheduleNext() {
      const ms = 2 * 60 * 60 * 1000;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(async () => {
        try {
          await queryClient.invalidateQueries({ queryKey: ['exchange-rates'] });
        } catch (e) {
          console.warn('Failed to invalidate exchange-rates query', e);
        }
        scheduleNext();
      }, ms);
    }

    scheduleNext();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [queryClient]);

  return query;
};
