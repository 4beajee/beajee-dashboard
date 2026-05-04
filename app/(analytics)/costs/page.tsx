import { fetchAnalytics, coerceRangeParams } from "@/lib/analytics/api";
import { number, percent, usd } from "@/lib/format";
import { readSearchParams, type PageSearchParams } from "@/lib/search";
import { MetricCard, MetricGrid, Note } from "@/components/cards";
import { PageHeader, Section } from "@/components/page";
import { DataTable } from "@/components/table";
import type { CostRow } from "@/lib/analytics/types";

const costColumns = (nameKey: "category" | "operation" | "event" | "tool") => [
  { key: "name", header: nameKey, render: (row: CostRow) => row[nameKey] ?? "unknown" },
  { key: "count", header: "Count", render: (row: CostRow) => number(row.count), align: "right" as const },
  { key: "usd", header: "USD", render: (row: CostRow) => usd(row.usd), align: "right" as const },
  { key: "in", header: "Input", render: (row: CostRow) => number(row.tokensInput), align: "right" as const },
  { key: "out", header: "Output", render: (row: CostRow) => number(row.tokensOutput), align: "right" as const },
];

export default async function CostsPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const range = coerceRangeParams(await readSearchParams(searchParams));
  const data = await fetchAnalytics("costs", range);

  return (
    <>
      <PageHeader title="Costs" description="Production compute ledger, demo responder spend, tokens, webhook health, and untracked activity references." meta={data} range={range} pathname="/costs" />
      <MetricGrid>
        <MetricCard label="Tracked spend" value={usd(data.tracked.totalUsd)} detail={`${number(data.tracked.totalTokens)} tokens`} />
        <MetricCard label="Production spend" value={usd(data.tracked.production.totalUsd)} detail={`${number(data.tracked.production.totalTokens)} tokens`} />
        <MetricCard label="Demo spend" value={usd(data.tracked.demo.totalUsd)} detail={`${number(data.tracked.demo.totalTokens)} tokens`} />
        <MetricCard label="USD / match" value={usd(data.tracked.usdPerSuccessfulMatch)} detail={`${number(data.tracked.tokensPerSuccessfulMatch)} tokens / match`} />
        <MetricCard label="Webhook health" value={percent(data.webhooks.successRate)} detail={`${number(data.webhooks.healthy)} healthy / ${number(data.webhooks.enabledAgents)} enabled`} />
        <MetricCard label="Webhook pings" value={number(data.webhooks.pingHistory.total)} detail={percent(data.webhooks.pingHistory.successRate)} />
      </MetricGrid>
      <Section title="Production By Category">
        <DataTable rows={data.tracked.production.byCategory} getKey={(row, index) => row.category ?? String(index)} columns={costColumns("category")} />
      </Section>
      <Section title="Production By Operation">
        <DataTable rows={data.tracked.production.byOperation} getKey={(row, index) => row.operation ?? String(index)} columns={costColumns("operation")} />
      </Section>
      <Section title="Demo Spend">
        <div className="grid-2">
          <DataTable rows={data.tracked.byEvent} getKey={(row, index) => row.event ?? String(index)} columns={costColumns("event")} />
          <DataTable rows={data.tracked.byTool} getKey={(row, index) => row.tool ?? String(index)} columns={costColumns("tool")} />
        </div>
        <Note>{data.tracked.note}</Note>
      </Section>
    </>
  );
}
