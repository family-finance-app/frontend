'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import {
  getTimeUntilNextUpdate,
  isNearUpdateTime,
} from '@/api/exchangeRate/scheduler';
import {
  getCachedRates,
  setCachedRates,
  ExchangeRate,
  DEFAULT_RATES,
} from '@/api/exchangeRate/cache';

export interface CurrencyRateResponse {
  r030: number;
  txt: string;
  rate: number;
  cc: string;
  exchangedate: string;
}

const NBU_API_URL = process.env.NEXT_PUBLIC_NBU_API_URL;

async function fetchExchangeRates(): Promise<ExchangeRate> {
  try {
    // use central api client for third-party requests
    const data = await apiClient.externalGet<CurrencyRateResponse[]>(
      NBU_API_URL ||
        'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json'
    );

    const rates: ExchangeRate = { UAH: 1 };

    // parse currencies (USD, EUR, etc.)
    data.forEach((item) => {
      const cc = (item.cc || '').toUpperCase();
      if (cc === 'USD') {
        rates.USD = item.rate;
      } else if (cc === 'EUR') {
        rates.EUR = item.rate;
      }
    });

    return rates;
  } catch (error) {
    console.warn('⚠️ Using fallback exchange rates (API unavailable)');
    return DEFAULT_RATES;
  }
}

// React Query hook for exchange rates, fetches on mount and refetches according to schedule (8 AM and 3 PM), caches results to minimize API calls
export const useExchangeRates = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['exchange-rates'],
    queryFn: async (): Promise<ExchangeRate> => {
      // return cached rates if available and not near scheduled update
      const cached = getCachedRates();
      if (cached && !isNearUpdateTime()) {
        return cached;
      }

      const rates = await fetchExchangeRates();
      setCachedRates(rates);
      return rates;
    },
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // schedule precise invalidation at next target times (8:00, 15:00)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    function scheduleNext() {
      const ms = getTimeUntilNextUpdate();
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
