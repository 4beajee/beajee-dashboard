import Link from "next/link";
import type { RangeParams } from "@/lib/analytics/types";

const ranges = [
  ["7d", "7D"],
  ["30d", "30D"],
  ["90d", "90D"],
  ["365d", "1Y"],
  ["all", "All"],
] as const;

export function RangeSelector({ current, pathname }: { current: RangeParams; pathname: string }) {
  const selected = current.from ? "custom" : current.range ?? "30d";

  return (
    <div className="range-control" aria-label="Range filter">
      {ranges.map(([value, label]) => (
        <Link
          key={value}
          className="range-button"
          aria-current={selected === value ? "true" : undefined}
          href={`${pathname}?range=${value}`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
