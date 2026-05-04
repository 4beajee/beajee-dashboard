import { redirect } from "next/navigation";
import { getDashboardAuthConfig, sanitizeNextPath } from "@/lib/dashboard-auth";
import type { PageSearchParams } from "@/lib/search";
import { loginAction } from "./actions";

export default async function LoginPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const params = searchParams ? await searchParams : {};
  const config = getDashboardAuthConfig();
  const next = sanitizeNextPath(Array.isArray(params.next) ? params.next[0] : params.next);
  const hasError = Boolean(params.error);

  if (!config) redirect("/overview");

  return (
    <main className="login-screen">
      <section className="login-panel">
        <div className="brand login-brand">
          <span className="brand-mark">G</span>
          <span>
            <strong>Gennety</strong>
            <small>Analytics OS</small>
          </span>
        </div>
        <div className="login-copy">
          <p className="eyebrow">Operator access</p>
          <h1>Sign in</h1>
          <p>Use the dashboard credentials configured in Vercel.</p>
        </div>
        <form className="login-form" action={loginAction}>
          <input type="hidden" name="next" value={next} />
          <label>
            <span>Username</span>
            <input name="username" autoComplete="username" required />
          </label>
          <label>
            <span>Password</span>
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          {hasError ? <p className="login-error">Invalid username or password.</p> : null}
          <button type="submit">Continue</button>
        </form>
      </section>
    </main>
  );
}
