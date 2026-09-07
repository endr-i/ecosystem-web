import { authStoreApi } from '../stores/authStore';
import { normalizeErrorResponse, networkError } from './errors';
import { refreshAccessToken, SESSION_ENDPOINTS } from './session';

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: QueryParams;
  /** Attach the access token and retry once after a refresh on 401. Defaults to true. */
  auth?: boolean;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

function buildUrl(path: string, query?: QueryParams): string {
  // Requests are relative to the current origin; the dev server (or a
  // reverse proxy in production) routes /api/* to the right backend service.
  const url = new URL(path, window.location.origin);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null || value === '') continue;
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204 || response.headers.get('content-length') === '0') return null;
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json().catch(() => null);
  }
  const text = await response.text().catch(() => '');
  return text || null;
}

class ApiClient {
  async request<TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> {
    const { auth = true } = options;
    const response = await this.send(path, options, auth ? authStoreApi.getAccessToken() : null);

    if (response.status === 401 && auth && path !== SESSION_ENDPOINTS.refresh) {
      const token = await refreshAccessToken();
      if (token) {
        return this.handle<TResponse>(await this.send(path, options, token));
      }
    }

    return this.handle<TResponse>(response);
  }

  get<TResponse>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<TResponse>(path, { ...options, method: 'GET' });
  }

  post<TResponse>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<TResponse>(path, { ...options, method: 'POST', body });
  }

  patch<TResponse>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<TResponse>(path, { ...options, method: 'PATCH', body });
  }

  put<TResponse>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<TResponse>(path, { ...options, method: 'PUT', body });
  }

  delete<TResponse>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<TResponse>(path, { ...options, method: 'DELETE' });
  }

  private async send(path: string, options: RequestOptions, token: string | null): Promise<Response> {
    const headers: Record<string, string> = { Accept: 'application/json', ...options.headers };
    if (options.body !== undefined) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = `Bearer ${token}`;

    try {
      return await fetch(buildUrl(path, options.query), {
        method: options.method ?? 'GET',
        headers,
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        signal: options.signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') throw error;
      throw networkError();
    }
  }

  private async handle<TResponse>(response: Response): Promise<TResponse> {
    const body = await parseBody(response);
    if (!response.ok) throw normalizeErrorResponse(response.status, body);
    return body as TResponse;
  }
}

/**
 * A single client shared by every feature. Requests are relative paths (e.g.
 * `/api/auth/login`, `/api/accounts`) routed to the right backend by the dev
 * server proxy or production reverse proxy — no base URLs are configured here.
 */
export const apiClient = new ApiClient();
