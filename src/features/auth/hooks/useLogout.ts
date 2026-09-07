import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../api/authApi';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSettled: () => {
      // Drop every cached server entity that belonged to the previous session.
      queryClient.clear();
    },
  });
}
