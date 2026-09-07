import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAccount } from '../api/accountsApi';
import type { UpdateAccountRequest } from '../types';
import { accountKeys } from './accountKeys';

type UpdateAccountVariables = {
  accountId: string;
  payload: UpdateAccountRequest;
};

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accountId, payload }: UpdateAccountVariables) => updateAccount(accountId, payload),
    onSuccess: (account) => {
      queryClient.setQueryData(accountKeys.detail(account.id), account);
      void queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
    },
  });
}
