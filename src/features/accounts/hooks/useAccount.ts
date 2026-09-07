import { useQuery } from '@tanstack/react-query';
import { fetchAccount } from '../api/accountsApi';
import { accountKeys } from './accountKeys';

export function useAccount(accountId: string | undefined) {
  return useQuery({
    queryKey: accountKeys.detail(accountId ?? ''),
    queryFn: ({ signal }) => fetchAccount(accountId as string, signal),
    enabled: Boolean(accountId),
  });
}
