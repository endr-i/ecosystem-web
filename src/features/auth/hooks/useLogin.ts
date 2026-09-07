import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../api/authApi';
import type { LoginRequest } from '../types';
import { authKeys } from './authKeys';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}
