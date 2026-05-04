export function number(value: number | null | undefined, options?: Intl.NumberFormatOptions) {
  if (value === null || value === undefined || Number.isNaN(value)) return "n/a";
  return new Intl.NumberFormat("en-US", options).format(value);
}

export function percent(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return "n/a";
  return `${number(value * 100, { maximumFractionDigits: 1 })}%`;
}

export function usd(value: number | null | undefined) {
  return number(value, { style: "currency", currency: "USD", maximumFractionDigits: 4 });
}

export function date(value: string | null | undefined) {
  if (!value) return "n/a";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function dateTime(value: string | null | undefined) {
  if (!value) return "n/a";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function compactId(value: string) {
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function text(value: string | null | undefined) {
  return value && value.trim().length > 0 ? value : "n/a";
}
