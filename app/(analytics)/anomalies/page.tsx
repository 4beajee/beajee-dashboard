import { fetchAnalytics, coerceRangeParams } from "@/lib/analytics/api";
import { number, percent } from "@/lib/format";
import { readSearchParams, type PageSearchParams } from "@/lib/search";
import { MetricCard, MetricGrid } from "@/components/cards";
import { PageHeader, Section } from "@/components/page";
import { StatusPill } from "@/components/status-pill";
import { DataTable } from "@/components/table";

export default async function AnomaliesPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const range = coerceRangeParams(await readSearchParams(searchParams));
  const data = await fetchAnalytics("anomalies", range);
  const critical = data.anomalies.filter((item) => item.severity === "critical").length;
  const warn = data.anomalies.filter((item) => item.severity === "warn").length;

  return (
    <>
      <PageHeader title="Anomalies" description="A compact feed of operational signals assembled from trust, beacon, advice, agent, cost, and overview metrics." meta={data} range={range} pathname="/anomalies" />
      <MetricGrid>
        <MetricCard label="Anomalies" value={number(data.anomalies.length)} />
        <MetricCard label="Critical" value={number(critical)} tone={critical > 0 ? "critical" : "default"} />
        <MetricCard label="Warnings" value={number(warn)} tone={warn > 0 ? "warn" : "default"} />
      </MetricGrid>
      <Section title="Feed">
        <DataTable
          rows={data.anomalies}
          getKey={(row) => row.key}
          columns={[
            { key: "severity", header: "Severity", render: (row) => <StatusPill value={row.severity} /> },
            { key: "title", header: "Title", render: (row) => <strong>{row.title}</strong> },
            { key: "summary", header: "Summary", render: (row) => row.summary },
            { key: "metric", header: "Metric", render: (row) => row.metric !== null && row.metric <= 1 ? percent(row.metric) : number(row.metric), align: "right" },
          ]}
        />
      </Section>
    </>
  );
}
