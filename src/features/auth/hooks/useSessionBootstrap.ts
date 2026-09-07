import { useEffect } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { restoreSession } from '../api/authApi';

/**
 * Attempts to restore the session from the refresh cookie exactly once,
 * before the router renders any protected route.
 */
export function useSessionBootstrap(): boolean {
  const initialized = useAuthStore((state) => state.initialized);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    if (useAuthStore.getState().initialized) return;

    let active = true;
    void restoreSession().finally(() => {
      if (active) setInitialized(true);
    });

    return () => {
      active = false;
    };
  }, [setInitialized]);

  return initialized;
}
