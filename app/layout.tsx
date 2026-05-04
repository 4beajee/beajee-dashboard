import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gennety Analytics OS",
  description: "Internal analytics dashboard for Gennety.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
