// backend/services/microcmsService.ts
import dayjs from 'dayjs';

import { MICROCMS_ENDPOINT, MICROCMS_API_KEY_TRACKING } from '../config/microcmsConfig.ts';

type SearchStat = {
  totalYearly: number;
  totalMonthly: number;
  daily: Record<string, number>;
  locations: Record<string, number>;
};

type SearchRecord = {
  searchStats?: SearchStat;
  searchCount?: number;
};

type UpsertResponse = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};

export const fetchSearchRecord = async (jan: string): Promise<SearchRecord | null> => {
  const res = await fetch(`${MICROCMS_ENDPOINT}/${jan}`, {
    headers: { 'X-API-KEY': MICROCMS_API_KEY_TRACKING },
  });
  return res.ok ? await res.json() : null;
};



export const upsertSearchRecord = async (
  jan: string,
  baseItemId: string,
  productName: string,
  location: string
): Promise<UpsertResponse> => {
  const existing = await fetchSearchRecord(jan);
  const now = dayjs();
  const day = now.format('YYYY-MM-DD');
  const month = now.format('YYYY-MM');
  const year = now.format('YYYY');

  let stats: SearchStat = existing?.searchStats ?? {
    totalYearly: 0,
    totalMonthly: 0,
    daily: {},
    locations: {},
  };

  stats.totalYearly++;
  stats.totalMonthly++;
  stats.daily[day] = (stats.daily[day] ?? 0) + 1;
  stats.locations[location] = (stats.locations[location] || 0) + 1;

  const payload = {
    id: jan,
    jan,
    baseItemId,
    name: productName,
    searchCount: (existing?.searchCount ?? 0) + 1,
    lastSearchedAt: new Date(Date.now()).toISOString(),
    searchStats: stats,
  };

  const method = existing ? 'PUT' : 'POST';
  const url = existing ? `${MICROCMS_ENDPOINT}/${jan}` : MICROCMS_ENDPOINT;

  const res = await fetch(url, {
    method,
    headers: {
      'X-API-KEY': MICROCMS_API_KEY_TRACKING,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`検索レコードのアップサートに失敗しました: ${errorText}`);
  }

  return await res.json();
};