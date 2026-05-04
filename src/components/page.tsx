import type { ReactNode } from "react";
import { dateTime } from "@/lib/format";
import type { AnalyticsMeta, RangeParams } from "@/lib/analytics/types";
import { RangeSelector } from "./range-selector";

export function PageHeader({
  title,
  description,
  meta,
  range,
  pathname,
  actions,
  hideRange = false,
}: {
  title: string;
  description: string;
  meta?: AnalyticsMeta;
  range: RangeParams;
  pathname: string;
  actions?: ReactNode;
  hideRange?: boolean;
}) {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">Internal analytics</p>
        <h1>{title}</h1>
        <p>{description}</p>
        {meta ? <small>Generated {dateTime(meta.generatedAt)} · {meta.range.label}</small> : null}
      </div>
      <div className="header-actions">
        {actions}
        {hideRange ? null : <RangeSelector current={range} pathname={pathname} />}
      </div>
    </header>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
