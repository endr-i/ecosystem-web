import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAccount } from '../api/accountsApi';
import { accountKeys } from './accountKeys';

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: string) => deleteAccount(accountId),
    onSuccess: (_data, accountId) => {
      queryClient.removeQueries({ queryKey: accountKeys.detail(accountId) });
      void queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
    },
  });
}
