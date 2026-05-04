import { fetchAnalytics, coerceRangeParams } from "@/lib/analytics/api";
import { compactId, number, percent } from "@/lib/format";
import { readSearchParams, type PageSearchParams } from "@/lib/search";
import { MetricCard, MetricGrid, Note } from "@/components/cards";
import { BarList } from "@/components/charts";
import { PageHeader, Section } from "@/components/page";
import { DataTable } from "@/components/table";

export default async function AdvicePage({ searchParams }: { searchParams?: PageSearchParams }) {
  const range = coerceRangeParams(await readSearchParams(searchParams));
  const data = await fetchAnalytics("advice", range);
  const statusRows = Object.entries(data.sessions.byStatus).map(([status, count]) => ({ status, count }));

  return (
    <>
      <PageHeader title="Model Advice" description="Advice request volume, approval/completion timing, action conversion, and dissonance signals." meta={data} range={range} pathname="/advice" />
      <MetricGrid>
        <MetricCard label="Sessions" value={number(data.sessions.total)} detail={`${number(data.sessions.byStatus.COMPLETED ?? 0)} completed`} />
        <MetricCard label="Avg approval" value={`${number(data.sessions.avgHoursToApproval)}h`} />
        <MetricCard label="Avg completion" value={`${number(data.sessions.avgHoursToCompletion)}h`} />
        <MetricCard label="Advice conversion" value={percent(data.conversion.adviceConversionRate)} detail={`${number(data.conversion.chatsWithContactExchange)} chats with contact exchange`} tone="good" />
        <MetricCard label="Severe dissonance" value={number(data.dissonance.severe)} detail={percent(data.dissonance.severeRate)} tone={data.dissonance.severe > 0 ? "warn" : "default"} />
        <MetricCard label="Mild dissonance" value={number(data.dissonance.mild)} />
      </MetricGrid>
      <Section title="Session Status">
        <BarList label="Advice sessions by status" rows={statusRows} getName={(row) => row.status} getValue={(row) => row.count} />
      </Section>
      <Section title="Contact Signal Examples">
        <DataTable
          rows={data.conversion.examples}
          getKey={(row) => row.chatId}
          columns={[
            { key: "chat", header: "Chat", render: (row) => <span className="mono">{compactId(row.chatId)}</span> },
            { key: "signals", header: "Signals", render: (row) => row.signals.join(", ") || "n/a" },
          ]}
        />
        <Note>{data.conversion.note}</Note>
      </Section>
      <Section title="Verdicts">
        <BarList label="Advice verdicts" rows={data.dissonance.verdicts} getName={(row) => row.verdict} getValue={(row) => row.count} />
        <Note>{data.dissonance.note}</Note>
      </Section>
    </>
  );
}
