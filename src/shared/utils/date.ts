const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
});

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

function parse(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: string | null | undefined, fallback = '—'): string {
  const date = parse(value);
  return date ? dateFormatter.format(date) : fallback;
}

export function formatDateTime(value: string | null | undefined, fallback = '—'): string {
  const date = parse(value);
  return date ? dateTimeFormatter.format(date) : fallback;
}
