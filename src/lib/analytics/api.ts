import "server-only";

import type {
  AdviceAnalytics,
  AgentAnalytics,
  AnomalyAnalytics,
  BeaconAnalytics,
  CostAnalytics,
  CountryAnalytics,
  NetworkAnalytics,
  OverviewAnalytics,
  RangeParams,
  ReportAnalytics,
  TrustAnalytics,
  UserDetail,
  UsersAnalytics,
} from "./types";

export type AnalyticsEndpoint =
  | "overview"
  | "trust"
  | "network"
  | "beacons"
  | "advice"
  | "agents"
  | "countries"
  | "users"
  | "costs"
  | "anomalies"
  | "reports";

export interface EndpointMap {
  overview: OverviewAnalytics;
  trust: TrustAnalytics;
  network: NetworkAnalytics;
  beacons: BeaconAnalytics;
  advice: AdviceAnalytics;
  agents: AgentAnalytics;
  countries: CountryAnalytics;
  users: UsersAnalytics;
  costs: CostAnalytics;
  anomalies: AnomalyAnalytics;
  reports: ReportAnalytics;
}

const DEFAULT_RANGE = "30d";

function getConfig() {
  const baseUrl = process.env.ANALYTICS_API_BASE_URL ?? process.env.GENNETY_API_BASE_URL;
  const secret = process.env.ANALYTICS_ADMIN_SECRET;

  if (!baseUrl) {
    throw new Error("Missing ANALYTICS_API_BASE_URL. Set it to the Gennety backend origin.");
  }

  if (!secret) {
    throw new Error("Missing ANALYTICS_ADMIN_SECRET. This value must stay server-side.");
  }

  return {
    baseUrl: baseUrl.replace(/\/$/, ""),
    secret,
  };
}

function appendRange(url: URL, params?: RangeParams) {
  const range = params?.range ?? DEFAULT_RANGE;
  if (params?.from) url.searchParams.set("from", params.from);
  if (params?.to) url.searchParams.set("to", params.to);
  if (!params?.from) url.searchParams.set("range", range);
}

export async function fetchAnalytics<T extends AnalyticsEndpoint>(
  endpoint: T,
  params?: RangeParams,
): Promise<EndpointMap[T]> {
  const { baseUrl, secret } = getConfig();
  const url = new URL(`/api/admin/analytics/${endpoint}`, baseUrl);
  appendRange(url, params);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${secret}`,
      Accept: "application/json",
    },
    next: { revalidate: 30 },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Analytics ${endpoint} failed: ${response.status} ${body}`);
  }

  return response.json() as Promise<EndpointMap[T]>;
}

export async function fetchUserDetail(ownerId: string): Promise<UserDetail> {
  const { baseUrl, secret } = getConfig();
  const url = new URL(`/api/admin/analytics/users/${ownerId}`, baseUrl);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${secret}`,
      Accept: "application/json",
    },
    next: { revalidate: 10 },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`User detail failed: ${response.status} ${body}`);
  }

  return response.json() as Promise<UserDetail>;
}

export function coerceRangeParams(
  searchParams?: Record<string, string | string[] | undefined>,
): RangeParams {
  const value = (key: string) => {
    const raw = searchParams?.[key];
    return Array.isArray(raw) ? raw[0] : raw;
  };
  const range = value("range");

  return {
    range: range === "7d" || range === "30d" || range === "90d" || range === "365d" || range === "all"
      ? range
      : undefined,
    from: value("from"),
    to: value("to"),
  };
}
