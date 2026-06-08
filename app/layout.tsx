import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beajee Analytics OS",
  description: "Internal analytics dashboard for Beajee.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
