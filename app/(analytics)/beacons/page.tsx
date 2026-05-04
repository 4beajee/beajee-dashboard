import { fetchAnalytics, coerceRangeParams } from "@/lib/analytics/api";
import { number, percent } from "@/lib/format";
import { readSearchParams, type PageSearchParams } from "@/lib/search";
import { MetricCard, MetricGrid, Note } from "@/components/cards";
import { BarList } from "@/components/charts";
import { PageHeader, Section } from "@/components/page";

export default async function BeaconsPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const range = coerceRangeParams(await readSearchParams(searchParams));
  const data = await fetchAnalytics("beacons", range);

  return (
    <>
      <PageHeader title="Beacons" description="Beacon liquidity, trigger latency, long waits, and false-positive signals." meta={data} range={range} pathname="/beacons" />
      <MetricGrid>
        <MetricCard label="Created" value={number(data.liquidity.createdInRange)} detail={`${number(data.liquidity.activeNow)} active now`} />
        <MetricCard label="Triggered" value={number(data.liquidity.triggeredInRange)} detail={percent(data.liquidity.triggerRate)} tone="good" />
        <MetricCard label="Median time to trigger" value={`${number(data.liquidity.timeToTriggerHours.median)}h`} detail={`p90 ${number(data.liquidity.timeToTriggerHours.p90)}h`} />
        <MetricCard label="Waiting 14d+" value={number(data.liquidity.waitingLongerThan14d)} tone={data.liquidity.waitingLongerThan14d > 0 ? "warn" : "default"} />
        <MetricCard label="Linked declines" value={number(data.falsePositives.exactLinkedDeclines as number)} detail={percent(data.falsePositives.exactLinkedDeclineRate as number | null)} tone="warn" />
        <MetricCard label="No negotiation" value={number(data.falsePositives.triggeredWithoutNegotiation as number)} detail="Triggered without linked negotiation" />
      </MetricGrid>
      <Section title="Top Beacon Queries">
        <BarList label="Top beacon queries" rows={data.topQueries} getName={(row) => row.query} getValue={(row) => row.count} />
        <Note>{String(data.falsePositives.note)}</Note>
      </Section>
    </>
  );
}
