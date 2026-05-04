import { fetchAnalytics, coerceRangeParams } from "@/lib/analytics/api";
import { number } from "@/lib/format";
import { readSearchParams, type PageSearchParams } from "@/lib/search";
import { MetricCard, MetricGrid, Note } from "@/components/cards";
import { BarList } from "@/components/charts";
import { PageHeader, Section } from "@/components/page";
import { DataTable } from "@/components/table";

export default async function NetworkPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const range = coerceRangeParams(await readSearchParams(searchParams));
  const data = await fetchAnalytics("network", range);

  return (
    <>
      <PageHeader title="Supply & Demand" description="Current context supply, demand approximations, shortages, oversupply, and freshness drift." meta={data} range={range} pathname="/network" />
      <MetricGrid>
        <MetricCard label="Published contexts" value={number(data.contextVolume.totalPublishedContexts)} detail={`${number(data.contextVolume.realContexts)} real · ${number(data.contextVolume.demoContexts)} demo`} />
        <MetricCard label="Median freshness" value={`${number(data.freshness.medianDaysSinceSignificantUpdate)}d`} detail={`p90 ${number(data.freshness.p90DaysSinceSignificantUpdate)}d`} />
        <MetricCard label="Significant publishes" value={number(data.embeddingDrift.significantPublishesInRange as number)} detail={`${number(data.embeddingDrift.trackedIntervals as number)} intervals`} />
        <MetricCard label="Active contexts" value={number(data.freshness.states.ACTIVE)} detail={`Stale ${number(data.freshness.states.STALE)} · inactive ${number(data.freshness.states.INACTIVE)}`} />
      </MetricGrid>
      <Section title="Tag Market">
        <div className="grid-2">
          <BarList label="Top supply" rows={data.supplyDemand.topSupply} getName={(row) => row.tag} getValue={(row) => row.count} />
          <BarList label="Top demand" rows={data.supplyDemand.topDemand} getName={(row) => row.tag} getValue={(row) => row.count} />
        </div>
        <Note>{data.supplyDemand.methodology}</Note>
      </Section>
      <Section title="Gaps">
        <DataTable
          rows={data.supplyDemand.biggestShortages}
          getKey={(row) => row.tag}
          columns={[
            { key: "tag", header: "Shortage", render: (row) => row.tag },
            { key: "supply", header: "Supply", render: (row) => number(row.supply), align: "right" },
            { key: "demand", header: "Demand", render: (row) => number(row.demand), align: "right" },
            { key: "gap", header: "Gap", render: (row) => number(row.gap), align: "right" },
          ]}
        />
      </Section>
      <Section title="Looking For Phrases">
        <BarList label="Top looking for phrases" rows={data.contextVolume.topLookingForPhrases} getName={(row) => row.phrase} getValue={(row) => row.count} />
      </Section>
    </>
  );
}
