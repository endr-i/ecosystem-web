import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAccount } from '../api/accountsApi';
import type { CreateAccountRequest } from '../types';
import { accountKeys } from './accountKeys';

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAccountRequest) => createAccount(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
    },
  });
}
