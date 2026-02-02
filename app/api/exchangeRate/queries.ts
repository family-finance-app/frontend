'use client';

import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/components/guards/AuthContext';
import { queryKeys } from '@/lib/query-client';
import { ApiSuccess } from '../types';
import { ApiError } from 'next/dist/server/api-utils';

export interface ExchangeRateMap {
  [code: string]: number;
}

export interface ExchangeRatesResponse {
  rates: ExchangeRateMap;
  fetchedAt: string;
}

// get exchange rates from backend; also supplies defaults
export const useExchangeRates = () => {
  const { token } = useAuth();

  const query = useQuery<ApiSuccess<ExchangeRatesResponse>, ApiError>({
    queryKey: queryKeys.exchangeRate.all,

    queryFn: async () => {
      const response =
        await apiClient.get<ApiSuccess<ExchangeRatesResponse>>('/currency');
      return response;
    },
    enabled: !!token,
  });

  return {
    exchangeRates: query.data?.data.rates,
    lastUpdated: query.data?.data.fetchedAt,
    ...query,
  };
};
