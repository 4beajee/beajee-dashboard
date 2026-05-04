import type { ReactNode } from "react";

export function MetricGrid({ children }: { children: ReactNode }) {
  return <div className="metric-grid">{children}</div>;
}

export function MetricCard({
  label,
  value,
  detail,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  tone?: "default" | "good" | "warn" | "critical";
}) {
  return (
    <article className={`metric-card tone-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {detail ? <small>{detail}</small> : null}
    </article>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <p className="note">{children}</p>;
}

export function EmptyState({ label = "No rows for this range." }: { label?: string }) {
  return <div className="empty-state">{label}</div>;
}
