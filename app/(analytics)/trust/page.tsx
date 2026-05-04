import { fetchAnalytics, coerceRangeParams } from "@/lib/analytics/api";
import { compactId, number, percent } from "@/lib/format";
import { readSearchParams, type PageSearchParams } from "@/lib/search";
import { MetricCard, MetricGrid, Note } from "@/components/cards";
import { PageHeader, Section } from "@/components/page";
import { DataTable } from "@/components/table";

export default async function TrustPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const range = coerceRangeParams(await readSearchParams(searchParams));
  const data = await fetchAnalytics("trust", range);

  return (
    <>
      <PageHeader
        title="Trust"
        description="Measures whether agent agreement becomes human trust, and where negotiations stall."
        meta={data}
        range={range}
        pathname="/trust"
      />
      <MetricGrid>
        <MetricCard label="Mutual agreements" value={number(data.trustGap.mutualAgreementCount as number)} detail={`Matched ${percent(data.trustGap.matchedRate as number | null)}`} />
        <MetricCard label="Dormant after agreement" value={number(data.trustGap.dormantAfterAgreement as number)} detail={percent(data.trustGap.dormantRate as number | null)} tone="warn" />
        <MetricCard label="Ghosted negotiations" value={number(data.ghosting.ghostedOver24h)} detail={`${percent(data.ghosting.ghostedRate)} over 24h`} tone={data.ghosting.ghostedOver24h > 0 ? "warn" : "default"} />
        <MetricCard label="Human conversion" value={percent(data.humanConversion.proposedToMatchedRate)} detail={`${number(data.humanConversion.matched)} matched / ${number(data.humanConversion.proposedCohort)}`} />
        <MetricCard label="Avg similarity" value={number(data.matchPrecision.avgSimilarity, { maximumFractionDigits: 2 })} detail={`${number(data.matchPrecision.confirmedMatchesWithSimilarity)} confirmed rows`} />
        <MetricCard label="Agent success" value={percent(data.negotiationEfficiency.avgNegotiationSuccessRate)} detail={`${number(data.negotiationEfficiency.agentsTracked)} agents tracked`} />
      </MetricGrid>
      <Section title="Oldest Ghosted Negotiations">
        <DataTable
          rows={data.ghosting.oldest}
          getKey={(row) => row.matchId}
          columns={[
            { key: "match", header: "Match", render: (row) => <span className="mono">{compactId(row.matchId)}</span> },
            { key: "age", header: "Age", render: (row) => `${number(row.ageHours)}h`, align: "right" },
            { key: "a", header: "Agent A", render: (row) => row.agentA.agentId },
            { key: "b", header: "Agent B", render: (row) => row.agentB.agentId },
          ]}
        />
        <Note>{String(data.trustGap.note)}</Note>
      </Section>
    </>
  );
}
