import { apiClient } from '../../../api/client';
import { refreshAccessToken, toTokenPair } from '../../../api/session';
import { authStoreApi } from '../../../stores/authStore';
import type {
  AuthUser,
  AuthUserResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '../types';

export const authEndpoints = {
  login: '/api/auth/v1/login',
  register: '/api/auth/v1/register',
  logout: '/api/auth/v1/logout',
  me: '/api/auth/v1/me',
} as const;

function toAuthUser(response: AuthUserResponse): AuthUser {
  return {
    id: response.id,
    email: response.email,
    phone: response.phone ?? null,
    phoneVerified: Boolean(response.phone_verified),
    mfaEnabled: Boolean(response.mfa_enabled),
    createdAt: response.created_at ?? null,
  };
}

export async function login(payload: LoginRequest): Promise<AuthUser> {
  const response = await apiClient.post<LoginResponse>(authEndpoints.login, payload, { auth: false });
  const user = toAuthUser(response.user);
  authStoreApi.setSession({ ...toTokenPair(response.tokens), user });
  return user;
}

export async function register(payload: RegisterRequest): Promise<string | null> {
  const { phone, ...rest } = payload;
  const requestBody: RegisterRequest = phone?.trim() ? { ...rest, phone: phone.trim() } : rest;

  // ecosystem-auth only creates the account here — it never returns a token
  // pair, so registration always ends with a "please sign in" redirect.
  await apiClient.post<AuthUserResponse>(authEndpoints.register, requestBody, { auth: false });
  return null;
}

export async function logout(): Promise<void> {
  const refreshToken = authStoreApi.getRefreshToken();
  try {
    if (refreshToken) {
      await apiClient.post<unknown>(authEndpoints.logout, { refresh_token: refreshToken });
    }
  } finally {
    authStoreApi.clearSession();
  }
}

export function fetchCurrentUser(signal?: AbortSignal): Promise<AuthUserResponse> {
  return apiClient.get<AuthUserResponse>(authEndpoints.me, { signal });
}

/** Restores a session from the stored refresh token on application start. */
export function restoreSession(): Promise<string | null> {
  return refreshAccessToken();
}
