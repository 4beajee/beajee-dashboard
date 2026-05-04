import { MetricCard, MetricGrid } from "@/components/cards";

export default function Loading() {
  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Internal analytics</p>
          <h1>Loading</h1>
          <p>Fetching the latest dashboard snapshot.</p>
        </div>
      </header>
      <MetricGrid>
        <MetricCard label="Loading" value="..." />
        <MetricCard label="Loading" value="..." />
        <MetricCard label="Loading" value="..." />
        <MetricCard label="Loading" value="..." />
      </MetricGrid>
    </>
  );
}
