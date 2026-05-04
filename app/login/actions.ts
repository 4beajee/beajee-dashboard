"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createDashboardSessionToken,
  DASHBOARD_SESSION_COOKIE,
  getDashboardAuthConfig,
  sanitizeNextPath,
} from "@/lib/dashboard-auth";

export async function loginAction(formData: FormData) {
  const next = sanitizeNextPath(formData.get("next"));
  const config = getDashboardAuthConfig();

  if (!config) redirect(next);

  const username = formData.get("username");
  const password = formData.get("password");
  const valid = username === config.username && password === config.password;

  if (!valid) {
    redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: DASHBOARD_SESSION_COOKIE,
    value: await createDashboardSessionToken(config.username, config.cookieSecret),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  redirect(next);
}
