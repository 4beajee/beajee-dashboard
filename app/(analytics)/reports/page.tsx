import Link from "next/link";
import { fetchAnalytics, coerceRangeParams } from "@/lib/analytics/api";
import { compactId, dateTime, number } from "@/lib/format";
import { readSearchParams, type PageSearchParams } from "@/lib/search";
import { MetricCard, MetricGrid, Note } from "@/components/cards";
import { BarList } from "@/components/charts";
import { PageHeader, Section } from "@/components/page";
import { StatusPill } from "@/components/status-pill";
import { DataTable } from "@/components/table";

export default async function ReportsPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const range = coerceRangeParams(await readSearchParams(searchParams));
  const data = await fetchAnalytics("reports", range);

  return (
    <>
      <PageHeader title="Reports" description="Manual review queue for raw chat reports, reasons, reporters, participants, and associated matches." meta={data} range={range} pathname="/reports" />
      <MetricGrid>
        <MetricCard label="Reports" value={number(data.summary.totalReports)} tone={data.summary.totalReports > 0 ? "warn" : "default"} />
        <MetricCard label="Chats reported" value={number(data.summary.uniqueChatsReported)} />
        <MetricCard label="Reporters" value={number(data.summary.uniqueReporters)} />
      </MetricGrid>
      <Section title="Top Reasons">
        <BarList label="Top report reasons" rows={data.topReasons} getName={(row) => row.reason} getValue={(row) => row.count} />
      </Section>
      <Section title="Recent Reports">
        <DataTable
          rows={data.recentReports}
          getKey={(row) => row.reportId}
          columns={[
            { key: "time", header: "Time", render: (row) => dateTime(row.createdAt) },
            { key: "reason", header: "Reason", render: (row) => row.reason },
            { key: "reporter", header: "Reporter", render: (row) => <Link className="user-link" href={`/users/${row.reporter.id}`}>{row.reporter.name}</Link> },
            { key: "match", header: "Match", render: (row) => <span className="mono">{compactId(row.match.id)}</span> },
            { key: "status", header: "Status", render: (row) => <StatusPill value={row.match.status} /> },
            { key: "participants", header: "Participants", render: (row) => row.participants.map((participant) => participant.ownerName).join(" / ") },
          ]}
        />
        <Note>{data.summary.note}</Note>
      </Section>
    </>
  );
}
