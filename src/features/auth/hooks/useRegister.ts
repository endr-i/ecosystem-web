import { useMutation, useQueryClient } from '@tanstack/react-query';
import { register } from '../api/authApi';
import type { RegisterRequest } from '../types';
import { authKeys } from './authKeys';

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterRequest) => register(payload),
    onSuccess: (accessToken) => {
      if (accessToken) void queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}
