import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resetConfirm } from '../api/authApi';
import type { ResetConfirmRequest } from '../types';
import { authKeys } from './authKeys';

export function useResetConfirm() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ResetConfirmRequest) => resetConfirm(payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: authKeys.all });
        },
    });
}
