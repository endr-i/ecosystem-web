import type { ItemResponse, ListResponse } from '../../../shared/types';

export type AccountStatus = 'active' | 'inactive' | 'suspended' | 'pending';

/** Single account as returned by the backend. */
export type AccountResponse = ItemResponse<Account>;

export type AccountListResponse = ListResponse<Account>;

export type Account = {
  id: string;
  name: string;
  slug: string;
  status: AccountStatus;
  description?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};

export type AccountListParams = {
  offset: number;
  limit: number;
  search?: string;
};

export type AccountList = AccountListResponse;

export type CreateAccountRequest = {
  name: string;
  slug: string;
  description?: string;
};

export type UpdateAccountRequest = Partial<CreateAccountRequest> & {
  status?: AccountStatus;
};
