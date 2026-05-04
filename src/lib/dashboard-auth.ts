export const DASHBOARD_SESSION_COOKIE = "gennety_dashboard_session";

export function getDashboardAuthConfig() {
  const username = process.env.DASHBOARD_BASIC_AUTH_USER;
  const password = process.env.DASHBOARD_BASIC_AUTH_PASSWORD;
  const cookieSecret = process.env.DASHBOARD_AUTH_COOKIE_SECRET ?? password;

  if (!username || !password || !cookieSecret) return null;

  return { username, password, cookieSecret };
}

export function sanitizeNextPath(value: FormDataEntryValue | string | null | undefined) {
  const next = typeof value === "string" ? value : "";
  if (!next.startsWith("/") || next.startsWith("//")) return "/overview";
  if (next.startsWith("/login")) return "/overview";
  return next;
}

export async function createDashboardSessionToken(username: string, cookieSecret: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(`gennety-dashboard:${username}:${cookieSecret}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function isValidDashboardSession(cookieValue: string | undefined) {
  const config = getDashboardAuthConfig();
  if (!config || !cookieValue) return false;
  const expected = await createDashboardSessionToken(config.username, config.cookieSecret);
  return cookieValue === expected;
}
