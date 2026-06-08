import type { ReactNode } from "react";
import Link from "next/link";
import { NavLink } from "./nav-link";

const navItems = [
  ["Overview", "/overview"],
  ["Trust", "/trust"],
  ["Supply & Demand", "/network"],
  ["Beacons", "/beacons"],
  ["Model Advice", "/advice"],
  ["Agent Quality", "/agents"],
  ["Countries", "/countries"],
  ["Users", "/users"],
  ["Costs", "/costs"],
  ["Anomalies", "/anomalies"],
  ["Reports", "/reports"],
] as const;

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <Link className="brand" href="/overview">
          <span className="brand-mark">B</span>
          <span>
            <strong>Beajee</strong>
            <small>Analytics OS</small>
          </span>
        </Link>
        <nav className="nav" aria-label="Analytics sections">
          {navItems.map(([label, href]) => (
            <NavLink key={href} href={href} label={label} />
          ))}
        </nav>
        <a className="logout-link" href="/logout">Sign out</a>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
