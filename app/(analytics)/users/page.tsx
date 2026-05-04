import Link from "next/link";
import { fetchAnalytics, coerceRangeParams } from "@/lib/analytics/api";
import { date, number, text } from "@/lib/format";
import { readSearchParams, type PageSearchParams } from "@/lib/search";
import { MetricCard, MetricGrid } from "@/components/cards";
import { PageHeader, Section } from "@/components/page";
import { StatusPill } from "@/components/status-pill";
import { DataTable } from "@/components/table";

export default async function UsersPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const params = await readSearchParams(searchParams);
  const range = coerceRangeParams(params);
  const rawQuery = params.q;
  const query = (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery)?.trim().toLowerCase() ?? "";
  const data = await fetchAnalytics("users", range);
  const users = query
    ? data.users.filter((user) =>
        [user.name, user.email, user.countryCode, user.networkingGoal, user.agent?.currentWork]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query)),
      )
    : data.users;

  return (
    <>
      <PageHeader
        title="Users"
        description="Registered user directory with country, onboarding, agent status, match counts, chats, and reports."
        meta={data}
        range={range}
        pathname="/users"
        actions={
          <form action="/users">
            <input className="search-box" name="q" defaultValue={query} placeholder="Search users, country, goal" />
            {range.range ? <input type="hidden" name="range" value={range.range} /> : null}
          </form>
        }
      />
      <MetricGrid>
        <MetricCard label="Users" value={number(data.summary.totalUsers)} detail={`${number(users.length)} shown`} />
        <MetricCard label="Onboarded" value={number(data.summary.onboarded)} />
        <MetricCard label="Pending onboarding" value={number(data.summary.pendingOnboarding)} tone={data.summary.pendingOnboarding > 0 ? "warn" : "default"} />
      </MetricGrid>
      <Section title="Directory">
        <DataTable
          rows={users}
          getKey={(row) => row.ownerId}
          columns={[
            {
              key: "user",
              header: "User",
              render: (row) => (
                <>
                  <Link className="user-link" href={`/users/${row.ownerId}`}>{row.name}</Link>
                  <br />
                  <span className="muted">{row.email}</span>
                </>
              ),
            },
            { key: "country", header: "Country", render: (row) => text(row.countryCode) },
            { key: "onboarding", header: "Onboarding", render: (row) => <StatusPill value={row.onboarded ? "onboarded" : "pending"} /> },
            { key: "agent", header: "Agent", render: (row) => row.agent ? <StatusPill value={row.agent.isActive ? "active" : "inactive"} /> : <StatusPill value="missing" /> },
            { key: "goal", header: "Goal", render: (row) => text(row.networkingGoal) },
            { key: "matches", header: "Matches", render: (row) => `${number(row.matches.matched)} / ${number(row.matches.total)}`, align: "right" },
            { key: "chats", header: "Chats", render: (row) => number(row.chats), align: "right" },
            { key: "reports", header: "Reports", render: (row) => number(row.reportsSubmitted), align: "right" },
            { key: "created", header: "Created", render: (row) => date(row.createdAt) },
          ]}
        />
      </Section>
    </>
  );
}
