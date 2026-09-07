/**
 * Auth DTOs are intentionally isolated here: the backend contracts for
 * `ecosystem-auth` are not final yet, so only this file (and the matching API
 * module) needs to change when they are.
 */

/** Body of `POST /api/auth/v1/login`. */
export type LoginRequest = {
  /** Email or username, depending on what the backend accepts. */
  email: string;
  password: string;
};

/** Body of `POST /api/auth/v1/register`. */
export type RegisterRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  /** Optional; omitted entirely from the request when left blank. */
  phone?: string;
};

/**
 * User as returned by `ecosystem-auth`'s login/`/me` responses. Field names
 * mirror the backend's JSON exactly (snake_case) since this is parsed
 * straight from the wire.
 */
export type AuthUserResponse = {
  id: string;
  email: string;
  phone?: string | null;
  phone_verified?: boolean;
  mfa_enabled?: boolean;
  created_at?: string;
};

/** Token pair as returned in `login`'s `tokens` field and by `/refresh`. */
export type TokenPairResponse = {
  access_token: string;
  refresh_token: string;
  token_type?: string;
  expires_in?: number;
};

/** Response body of `POST /api/auth/v1/login`. */
export type LoginResponse = {
  user: AuthUserResponse;
  tokens: TokenPairResponse;
};

/** UI/session model for the signed-in user. */
export type AuthUser = {
  id: string;
  email: string;
  phone: string | null;
  phoneVerified: boolean;
  mfaEnabled: boolean;
  createdAt: string | null;
};

/** Access/refresh token pair kept in the auth store. */
export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};
