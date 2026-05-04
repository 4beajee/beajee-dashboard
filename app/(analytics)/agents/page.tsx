import { fetchAnalytics, coerceRangeParams } from "@/lib/analytics/api";
import { number, percent } from "@/lib/format";
import { readSearchParams, type PageSearchParams } from "@/lib/search";
import { MetricCard, MetricGrid, Note } from "@/components/cards";
import { PageHeader, Section } from "@/components/page";
import { StatusPill } from "@/components/status-pill";
import { DataTable } from "@/components/table";
import type { AgentQualityRow } from "@/lib/analytics/types";

const columns = [
  { key: "agent", header: "Agent", render: (row: AgentQualityRow) => <><strong>{row.ownerName}</strong><br /><span className="muted mono">{row.agentId}</span></> },
  { key: "fresh", header: "Context", render: (row: AgentQualityRow) => <StatusPill value={row.freshnessState} /> },
  { key: "spam", header: "Spammy", render: (row: AgentQualityRow) => number(row.spammyIndex, { maximumFractionDigits: 2 }), align: "right" as const },
  { key: "initiated", header: "Initiated", render: (row: AgentQualityRow) => number(row.totalInitiatedNegotiations), align: "right" as const },
  { key: "completed", header: "Completed", render: (row: AgentQualityRow) => number(row.completedMatches), align: "right" as const },
  { key: "ownerRate", header: "Owner accept", render: (row: AgentQualityRow) => percent(row.ownerAcceptanceRate), align: "right" as const },
  { key: "negative", header: "Negative", render: (row: AgentQualityRow) => number(row.negativeFeedback), align: "right" as const },
];

export default async function AgentsPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const range = coerceRangeParams(await readSearchParams(searchParams));
  const data = await fetchAnalytics("agents", range);

  return (
    <>
      <PageHeader title="Agent Quality" description="Agent reputation, spammy initiation patterns, public dislikes, and report pressure." meta={data} range={range} pathname="/agents" />
      <MetricGrid>
        <MetricCard label="Agents tracked" value={number(data.integrity.agentsTracked)} />
        <MetricCard label="With reports" value={number(data.integrity.agentsWithReports)} tone={data.integrity.agentsWithReports > 0 ? "warn" : "default"} />
        <MetricCard label="With public dislikes" value={number(data.integrity.agentsWithPublicDislikes)} />
      </MetricGrid>
      <Section title="Spammy Agent Index">
        <DataTable rows={data.topSpammy} getKey={(row) => row.internalId} columns={columns} />
      </Section>
      <Section title="Negative Feedback">
        <DataTable rows={data.topNegativeFeedback} getKey={(row) => row.internalId} columns={columns} />
        <Note>{data.integrity.note}</Note>
      </Section>
    </>
  );
}
