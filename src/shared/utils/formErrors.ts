import type { FormInstance } from 'antd';
import { getErrorMessage, isApiError } from '../../api/errors';

/**
 * Pushes backend field errors into an Ant Design form and returns the message
 * that should be surfaced as a generic error, or null when everything was
 * displayed inside the form.
 */
export function applyFormErrors<TValues extends object>(
  form: FormInstance<TValues>,
  error: unknown,
): string | null {
  // Errors are keyed by plain field names, so work with a loosely typed form.
  const target = form as unknown as FormInstance<Record<string, unknown>>;
  if (!isApiError(error) || !error.fields) return getErrorMessage(error);

  const formFields = target.getFieldsValue(true);
  const entries = Object.entries(error.fields);
  const matched = entries.filter(([field]) => field in formFields);

  if (matched.length === 0) return error.message;

  target.setFields(matched.map(([name, message]) => ({ name, errors: [message] })));

  return matched.length === entries.length ? null : error.message;
}
