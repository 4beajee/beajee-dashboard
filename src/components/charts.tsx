import type { SeriesPoint } from "@/lib/analytics/types";
import { number } from "@/lib/format";
import { EmptyState } from "./cards";

export function Sparkline({ data, label }: { data: SeriesPoint[]; label: string }) {
  if (data.length === 0) return <EmptyState label="No series for all-time range." />;

  const max = Math.max(...data.map((point) => point.value), 1);
  const width = 420;
  const height = 116;
  const step = data.length > 1 ? width / (data.length - 1) : width;
  const points = data
    .map((point, index) => {
      const x = index * step;
      const y = height - (point.value / max) * (height - 18) - 9;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <figure className="sparkline">
      <figcaption>{label}</figcaption>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
        <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <small>{number(data.reduce((sum, point) => sum + point.value, 0))} total</small>
    </figure>
  );
}

export function BarList<T>({
  rows,
  label,
  getName,
  getValue,
}: {
  rows: T[];
  label: string;
  getName: (row: T) => string;
  getValue: (row: T) => number;
}) {
  if (rows.length === 0) return <EmptyState />;
  const max = Math.max(...rows.map(getValue), 1);

  return (
    <div className="bar-list" aria-label={label}>
      {rows.map((row) => {
        const name = getName(row);
        const value = getValue(row);
        return (
          <div className="bar-row" key={name}>
            <span>{name}</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${Math.max(4, (value / max) * 100)}%` }} />
            </div>
            <strong>{number(value)}</strong>
          </div>
        );
      })}
    </div>
  );
}
