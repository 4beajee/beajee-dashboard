import Link from "next/link";
import { fetchUserDetail } from "@/lib/analytics/api";
import { compactId, dateTime, number, percent, text } from "@/lib/format";
import { MetricCard, MetricGrid, EmptyState } from "@/components/cards";
import { PageHeader, Section } from "@/components/page";
import { StatusPill } from "@/components/status-pill";
import { DataTable } from "@/components/table";

export default async function UserDetailPage({ params }: { params: Promise<{ ownerId: string }> }) {
  const { ownerId } = await params;
  const data = await fetchUserDetail(ownerId);
  const chats = data.matches.filter((match) => match.chat);
  const adviceSessions = chats.flatMap((match) => match.chat?.adviceSessions ?? []);

  return (
    <>
      <PageHeader
        title={data.owner.name}
        description={`${data.owner.email} · full owner, agent, match, chat, transcript, and advice drilldown.`}
        range={{ range: "all" }}
        pathname={`/users/${ownerId}`}
        actions={<Link className="range-button" href="/users">Back to users</Link>}
        hideRange
      />

      <MetricGrid>
        <MetricCard label="Country" value={text(data.owner.countryCode)} />
        <MetricCard label="Onboarding" value={<StatusPill value={data.owner.onboarded ? "onboarded" : "pending"} />} />
        <MetricCard label="Agent" value={<StatusPill value={data.agent?.isActive ? "active" : data.agent ? "inactive" : "missing"} />} />
        <MetricCard label="Matches" value={number(data.matches.length)} detail={`${number(chats.length)} chats`} />
        <MetricCard label="Advice sessions" value={number(adviceSessions.length)} />
        <MetricCard label="Reputation" value={number(data.agent?.reputationScore, { maximumFractionDigits: 2 })} />
      </MetricGrid>

      <div className="detail-grid">
        <aside className="panel">
          <h3>Profile</h3>
          <div className="kv">
            <Row label="Owner ID" value={<span className="mono">{compactId(data.owner.id)}</span>} />
            <Row label="Created" value={dateTime(data.owner.createdAt)} />
            <Row label="Country" value={text(data.owner.countryCode)} />
            <Row label="Goal" value={text(data.owner.networkingGoal)} />
            <Row label="Platform" value={text(data.owner.agentPlatform)} />
            <Row label="Privacy" value={<StatusPill value={data.owner.privacyConsent} />} />
            <Row label="Research" value={<StatusPill value={data.owner.researchConsent} />} />
            <Row label="Demo" value={<StatusPill value={data.owner.isDemo} />} />
          </div>
        </aside>
        <section className="panel">
          <h3>Agent Context</h3>
          {data.agent ? (
            <div className="kv">
              <Row label="Agent ID" value={data.agent.agentId} />
              <Row label="Display" value={data.agent.displayName} />
              <Row label="Last active" value={dateTime(data.agent.lastActiveAt)} />
              <Row label="Wake webhook" value={<StatusPill value={data.agent.wakeWebhookEnabled ? data.agent.wakeWebhookLastPingOk === false ? "unhealthy" : "enabled" : "disabled"} />} />
              <Row label="Freshness" value={<StatusPill value={data.agent.context?.freshnessState} />} />
              <Row label="Current work" value={text(data.agent.context?.currentWork)} />
              <Row label="Looking for" value={text(data.agent.context?.lookingFor)} />
              <Row label="Expertise" value={data.agent.context?.expertise.join(", ") || "n/a"} />
            </div>
          ) : (
            <EmptyState label="No agent has been created for this owner." />
          )}
        </section>
      </div>

      <Section title="Matches">
        <DataTable
          rows={data.matches}
          getKey={(row) => row.matchId}
          columns={[
            { key: "match", header: "Match", render: (row) => <span className="mono">{compactId(row.matchId)}</span> },
            { key: "status", header: "Status", render: (row) => <StatusPill value={row.status} /> },
            { key: "other", header: "Other person", render: (row) => <Link className="user-link" href={`/users/${row.otherPerson.ownerId}`}>{row.otherPerson.name}</Link> },
            { key: "source", header: "Source", render: (row) => row.discoverySource },
            { key: "similarity", header: "Similarity", render: (row) => percent(row.matchSimilarity), align: "right" },
            { key: "created", header: "Created", render: (row) => dateTime(row.createdAt) },
          ]}
        />
      </Section>

      <Section title="Chats And Full Transcripts">
        {chats.length === 0 ? <EmptyState label="No chats for this user." /> : null}
        <div className="transcript">
          {chats.map((match) => match.chat ? (
            <article className="panel" key={match.chat.chatId}>
              <h3>{match.otherPerson.name} · <span className="mono">{compactId(match.chat.chatId)}</span></h3>
              <p className="note">{match.overlapSummary}</p>
              {match.framingForMe ? <p className="note">{match.framingForMe}</p> : null}
              <div className="transcript">
                {match.chat.messages.map((message) => (
                  <div className="message" key={message.id}>
                    <div className="message-header">
                      <span>{message.kind} · {message.fromOwner ?? "system"}</span>
                      <span>{dateTime(message.createdAt)}</span>
                    </div>
                    <p>{message.content}</p>
                  </div>
                ))}
              </div>
            </article>
          ) : null)}
        </div>
      </Section>

      <Section title="Advice Sessions">
        <DataTable
          rows={adviceSessions}
          getKey={(row) => row.id}
          columns={[
            { key: "title", header: "Prompt", render: (row) => <><strong>{row.promptTitle}</strong><br /><span className="muted">{row.promptText}</span></> },
            { key: "status", header: "Status", render: (row) => <StatusPill value={row.status} /> },
            { key: "summary", header: "Summary", render: (row) => text(row.summary) },
            { key: "recommendation", header: "Recommendation", render: (row) => text(row.recommendation) },
            { key: "created", header: "Created", render: (row) => dateTime(row.createdAt) },
          ]}
        />
      </Section>
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="kv-row">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
