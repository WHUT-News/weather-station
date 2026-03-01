import apiClient from './client';
import type { WeatherResponse, HistoryResponse } from './types';

export const getLatestForecast = async (
  city: string,
  language?: string,
  includeExpired?: boolean
): Promise<WeatherResponse> => {
  const params: Record<string, string | boolean> = {};
  if (language) params.language = language;
  if (includeExpired) params.include_expired = includeExpired;
  const response = await apiClient.get<WeatherResponse>(`/weather/${city}`, {
    params,
  });
  return response.data;
};

export const getForecastHistory = async (
  city: string,
  limit: number = 10,
  includeExpired: boolean = false,
  language?: string,
  offset?: number
): Promise<HistoryResponse> => {
  const params: Record<string, string | number | boolean> = {
    limit,
    include_expired: includeExpired,
  };
  if (language) params.language = language;
  if (offset !== undefined) params.offset = offset;
  const response = await apiClient.get<HistoryResponse>(
    `/weather/${city}/history`,
    { params }
  );
  return response.data;
};
