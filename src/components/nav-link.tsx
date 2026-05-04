"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/overview" && pathname.startsWith(`${href}/`));

  return (
    <Link className="nav-link" aria-current={active ? "page" : undefined} href={href}>
      {label}
    </Link>
  );
}
