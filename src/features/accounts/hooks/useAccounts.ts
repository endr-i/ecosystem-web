import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchAccounts } from '../api/accountsApi';
import type { AccountListParams } from '../types';
import { accountKeys } from './accountKeys';

export function useAccounts(params: AccountListParams) {
  return useQuery({
    queryKey: accountKeys.list(params),
    queryFn: ({ signal }) => fetchAccounts(params, signal),
    placeholderData: keepPreviousData,
  });
}
