"use client";

export default function AnalyticsError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <section className="panel">
      <p className="eyebrow">Analytics error</p>
      <h1>Dashboard data is unavailable</h1>
      <p className="note">
        {error.message.includes("ANALYTICS_")
          ? error.message
          : "The backend analytics API did not return a successful response."}
      </p>
      <button className="retry-button" onClick={reset} type="button">
        Retry
      </button>
    </section>
  );
}
