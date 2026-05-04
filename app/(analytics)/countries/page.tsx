import { fetchAnalytics, coerceRangeParams } from "@/lib/analytics/api";
import { number, percent } from "@/lib/format";
import { readSearchParams, type PageSearchParams } from "@/lib/search";
import { MetricCard, MetricGrid } from "@/components/cards";
import { BarList } from "@/components/charts";
import { PageHeader, Section } from "@/components/page";
import { DataTable } from "@/components/table";

export default async function CountriesPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const range = coerceRangeParams(await readSearchParams(searchParams));
  const data = await fetchAnalytics("countries", range);

  return (
    <>
      <PageHeader title="Countries" description="Registered users by country with onboarding and demo split." meta={data} range={range} pathname="/countries" />
      <MetricGrid>
        <MetricCard label="Registered users" value={number(data.summary.registeredUsers)} />
        <MetricCard label="With country" value={number(data.summary.withCountry)} />
        <MetricCard label="Missing country" value={number(data.summary.withoutCountry)} tone={data.summary.withoutCountry > 0 ? "warn" : "default"} />
      </MetricGrid>
      <Section title="Distribution">
        <BarList label="Country distribution" rows={data.countries.slice(0, 18)} getName={(row) => row.countryCode} getValue={(row) => row.total} />
      </Section>
      <Section title="Country Table">
        <DataTable
          rows={data.countries}
          getKey={(row) => row.countryCode}
          columns={[
            { key: "country", header: "Country", render: (row) => row.countryCode },
            { key: "total", header: "Total", render: (row) => number(row.total), align: "right" },
            { key: "onboarded", header: "Onboarded", render: (row) => number(row.onboarded), align: "right" },
            { key: "pending", header: "Pending", render: (row) => number(row.pending), align: "right" },
            { key: "rate", header: "Rate", render: (row) => percent(row.onboardingRate), align: "right" },
            { key: "real", header: "Real", render: (row) => number(row.real), align: "right" },
            { key: "demo", header: "Demo", render: (row) => number(row.demo), align: "right" },
          ]}
        />
      </Section>
    </>
  );
}
