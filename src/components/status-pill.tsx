export function StatusPill({ value }: { value: string | boolean | null | undefined }) {
  const label = value === true ? "yes" : value === false ? "no" : value ?? "n/a";
  const normalized = String(label).toLowerCase();
  const tone =
    normalized.includes("critical") || normalized.includes("failed") || normalized.includes("declined")
      ? "critical"
      : normalized.includes("warn") || normalized.includes("pending") || normalized.includes("aging")
        ? "warn"
        : normalized.includes("active") || normalized.includes("matched") || normalized === "yes"
          ? "good"
          : "default";

  return <span className={`pill pill-${tone}`}>{label}</span>;
}
