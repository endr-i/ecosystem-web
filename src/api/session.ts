import { authStoreApi } from '../stores/authStore';
import type { TokenPair, TokenPairResponse } from '../features/auth/types';

/**
 * Session renewal is a cross-cutting concern: it is implemented once here and
 * used by the API client, so no feature or component duplicates refresh logic.
 */
export const SESSION_ENDPOINTS = {
  refresh: '/api/auth/v1/refresh',
} as const;

/** Maps the backend's snake_case token pair into the app's `TokenPair`. */
export function toTokenPair(response: TokenPairResponse): TokenPair {
  return { accessToken: response.access_token, refreshToken: response.refresh_token };
}

let refreshRequest: Promise<string | null> | null = null;

async function requestRefresh(): Promise<string | null> {
  const refreshToken = authStoreApi.getRefreshToken();
  if (!refreshToken) {
    authStoreApi.clearSession();
    return null;
  }

  try {
    // ecosystem-auth refresh tokens are single-use (rotated): the presented
    // token is revoked and a brand new pair is issued in the response.
    const response = await fetch(SESSION_ENDPOINTS.refresh, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      authStoreApi.clearSession();
      return null;
    }

    const body = (await response.json().catch(() => null)) as TokenPairResponse | null;
    if (!body?.access_token || !body.refresh_token) {
      authStoreApi.clearSession();
      return null;
    }

    const tokens = toTokenPair(body);
    authStoreApi.setTokens(tokens);
    return tokens.accessToken;
  } catch {
    authStoreApi.clearSession();
    return null;
  }
}

/**
 * Renews the access token using the stored refresh token.
 * Concurrent callers share a single in-flight request, since the backend
 * invalidates the refresh token as soon as it is used once.
 */
export function refreshAccessToken(): Promise<string | null> {
  refreshRequest ??= requestRefresh().finally(() => {
    refreshRequest = null;
  });
  return refreshRequest;
}
