/**
 * Application-friendly error shape. Everything thrown by the API layer is
 * normalized into this type so components never touch raw HTTP responses.
 */
export type ApiError = {
  status: number;
  code?: string;
  message: string;
  /** Field name -> validation message, used to fill Ant Design form errors. */
  fields?: Record<string, string>;
};

const API_ERROR_BRAND = '__ecosystemApiError';

type BrandedApiError = ApiError & { readonly [API_ERROR_BRAND]: true };

export function createApiError(error: ApiError): ApiError {
  const branded: BrandedApiError = { ...error, [API_ERROR_BRAND]: true };
  return branded;
}

export function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && API_ERROR_BRAND in error;
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (isApiError(error)) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/**
 * Backend error payloads are not finalized yet, so the shapes we tolerate are
 * isolated here instead of leaking into features.
 */
type UnknownErrorBody = {
  message?: unknown;
  error?: unknown;
  detail?: unknown;
  code?: unknown;
  errors?: unknown;
  fields?: unknown;
  violations?: unknown;
};

const STATUS_FALLBACK_MESSAGES: Record<number, string> = {
  400: 'The request was invalid.',
  401: 'Your session has expired. Please sign in again.',
  403: 'You do not have access to this resource.',
  404: 'The requested resource was not found.',
  409: 'The request conflicts with the current state.',
  422: 'Some of the submitted values are invalid.',
  500: 'The server encountered an unexpected error.',
};

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function readFieldErrors(body: UnknownErrorBody): Record<string, string> | undefined {
  const source = body.fields ?? body.errors ?? body.violations;
  const fields: Record<string, string> = {};

  if (Array.isArray(source)) {
    for (const item of source) {
      if (typeof item !== 'object' || item === null) continue;
      const entry = item as Record<string, unknown>;
      const field = readString(entry.field) ?? readString(entry.name) ?? readString(entry.property);
      const message = readString(entry.message) ?? readString(entry.error);
      if (field && message) fields[field] = message;
    }
  } else if (typeof source === 'object' && source !== null) {
    for (const [field, value] of Object.entries(source as Record<string, unknown>)) {
      const message = Array.isArray(value) ? readString(value[0]) : readString(value);
      if (message) fields[field] = message;
    }
  }

  return Object.keys(fields).length > 0 ? fields : undefined;
}

export function normalizeErrorResponse(status: number, body: unknown): ApiError {
  const payload: UnknownErrorBody = typeof body === 'object' && body !== null ? body : {};
  const message =
    readString(payload.message) ??
    readString(payload.error) ??
    readString(payload.detail) ??
    readString(body) ??
    STATUS_FALLBACK_MESSAGES[status] ??
    `Request failed with status ${status}.`;

  return createApiError({
    status,
    code: readString(payload.code),
    message,
    fields: readFieldErrors(payload),
  });
}

export function networkError(message = 'Unable to reach the server. Check your connection.'): ApiError {
  return createApiError({ status: 0, code: 'NETWORK_ERROR', message });
}
