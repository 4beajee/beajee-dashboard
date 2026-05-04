import { fetchAnalytics, coerceRangeParams } from "@/lib/analytics/api";
import { number, percent } from "@/lib/format";
import { readSearchParams, type PageSearchParams } from "@/lib/search";
import { MetricCard, MetricGrid } from "@/components/cards";
import { Sparkline } from "@/components/charts";
import { PageHeader, Section } from "@/components/page";

export default async function OverviewPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const range = coerceRangeParams(await readSearchParams(searchParams));
  const data = await fetchAnalytics("overview", range);

  return (
    <>
      <PageHeader
        title="Overview"
        description="Top-level health for owners, agents, matches, beacons, country capture, and time to first value."
        meta={data}
        range={range}
        pathname="/overview"
      />

      <MetricGrid>
        <MetricCard label="Owners" value={number(data.summary.owners.total)} detail={`${number(data.summary.owners.onboarded)} onboarded · ${number(data.summary.owners.real)} real`} />
        <MetricCard label="Agents active" value={number(data.summary.agents.active)} detail={`${number(data.summary.agents.total)} total · ${percent(data.summary.agents.wakeWebhooks.successRate)} wake health`} tone="good" />
        <MetricCard label="Matched" value={number(data.summary.matches.matched)} detail={`${number(data.summary.matches.proposed)} proposed · ${number(data.summary.matches.negotiating)} negotiating`} />
        <MetricCard label="Network vitality" value={number(data.summary.networkVitality.value, { maximumFractionDigits: 2 })} detail={`${number(data.summary.networkVitality.activeBeacons)} beacons / ${number(data.summary.networkVitality.uniqueExpertiseTags)} tags`} />
        <MetricCard label="First proposal p90" value={`${number(data.ttfv.firstProposed.p90Hours)}h`} detail={`${number(data.ttfv.firstProposed.waitingOver48h)} waiting over 48h`} tone={data.ttfv.firstProposed.waitingOver48h > 0 ? "warn" : "default"} />
        <MetricCard label="First match p90" value={`${number(data.ttfv.firstMatched.p90Hours)}h`} detail={`${number(data.ttfv.firstMatched.waitingNow)} waiting now`} />
        <MetricCard label="Published contexts" value={number(data.summary.contexts.published)} detail={`Active ${number(data.summary.contexts.freshness.ACTIVE)} · stale ${number(data.summary.contexts.freshness.STALE)}`} />
        <MetricCard label="Countries captured" value={number(data.summary.countries.captured)} detail={`${number(data.summary.countries.missing)} missing`} />
      </MetricGrid>

      <Section title="Activity">
        <div className="grid-2">
          <Sparkline label="Owners created" data={data.series.ownersCreated} />
          <Sparkline label="Proposals" data={data.series.proposals} />
          <Sparkline label="Matches" data={data.series.matched} />
          <Sparkline label="Advice requests" data={data.series.adviceRequested} />
        </div>
      </Section>

      <Section title="Funnel">
        <div className="grid-3">
          {Object.entries(data.funnel).map(([label, value]) => (
            <MetricCard key={label} label={label.replaceAll(/([A-Z])/g, " $1")} value={number(value)} />
          ))}
        </div>
      </Section>
    </>
  );
}
