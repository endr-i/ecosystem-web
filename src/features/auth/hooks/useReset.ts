import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reset } from '../api/authApi';
import type { ResetRequest } from '../types';
import { authKeys } from './authKeys';

export function useReset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ResetRequest) => reset(payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: authKeys.all });
        },
    });
}
