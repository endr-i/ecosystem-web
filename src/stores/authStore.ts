import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, TokenPair } from '../features/auth/types';

export type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  /**
   * The signed-in user, as returned by login. Kept here (not TanStack Query)
   * for now since there is no separate `/me` query driving the UI yet — the
   * login response is the only source of user data.
   */
  user: AuthUser | null;
  authenticated: boolean;
  /** True once the initial session restore attempt has finished. */
  initialized: boolean;
};

type AuthActions = {
  setSession: (session: TokenPair & { user: AuthUser }) => void;
  /** Updates only the token pair, e.g. after a refresh (no user in that response). */
  setTokens: (tokens: TokenPair) => void;
  clearSession: () => void;
  setInitialized: (initialized: boolean) => void;
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  authenticated: false,
  initialized: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,
      setSession: ({ accessToken, refreshToken, user }) =>
        set({ accessToken, refreshToken, user, authenticated: true }),
      setTokens: ({ accessToken, refreshToken }) => set({ accessToken, refreshToken, authenticated: true }),
      clearSession: () => set({ accessToken: null, refreshToken: null, user: null, authenticated: false }),
      setInitialized: (initialized) => set({ initialized }),
    }),
    {
      name: 'ecosystem.auth',
      // `initialized` is a runtime-only flag; it must not survive a reload.
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        authenticated: state.authenticated,
      }),
    },
  ),
);

/** Non-reactive accessors for use inside the API layer. */
export const authStoreApi = {
  getAccessToken: () => useAuthStore.getState().accessToken,
  getRefreshToken: () => useAuthStore.getState().refreshToken,
  setSession: (session: TokenPair & { user: AuthUser }) => useAuthStore.getState().setSession(session),
  setTokens: (tokens: TokenPair) => useAuthStore.getState().setTokens(tokens),
  clearSession: () => useAuthStore.getState().clearSession(),
};
