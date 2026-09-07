import { apiClient } from '../../../api/client';
import type {
  Account,
  AccountList,
  AccountListParams,
  AccountListResponse,
  AccountResponse,
  CreateAccountRequest,
  UpdateAccountRequest,
} from '../types';
import { normalizeItemResponse } from '../../../shared/utils/response.ts';

export const accountEndpoints = {
  list: '/api/accounts/v1/accounts',
  detail: (accountId: string) => `/api/accounts/v1/accounts/${encodeURIComponent(accountId)}`,
} as const;

export async function fetchAccounts(
  params: AccountListParams,
  signal?: AbortSignal,
): Promise<AccountList> {
  return apiClient.get<AccountListResponse>(accountEndpoints.list, {
    query: { offset: params.offset, limit: params.limit, search: params.search },
    signal,
  });
}

export async function fetchAccount(accountId: string, signal?: AbortSignal): Promise<Account> {
  const response = await apiClient.get<AccountResponse>(accountEndpoints.detail(accountId), { signal });

  return normalizeItemResponse(response);
}

export async function createAccount(payload: CreateAccountRequest): Promise<Account> {
  const response = await apiClient.post<AccountResponse>(accountEndpoints.list, payload);

  return normalizeItemResponse(response);
}

export async function updateAccount(accountId: string, payload: UpdateAccountRequest): Promise<Account> {
  const response = await apiClient.patch<AccountResponse>(accountEndpoints.detail(accountId), payload);

  return normalizeItemResponse(response);
}

export function deleteAccount(accountId: string): Promise<void> {
  return apiClient.delete<void>(accountEndpoints.detail(accountId));
}
