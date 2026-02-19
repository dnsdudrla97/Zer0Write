import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zer0Write",
  description: "Scan text for hidden stealth characters and decode suspicious payloads.",
  icons: {
    icon: "/brand/zw.svg",
    shortcut: "/brand/zw.svg",
    apple: "/brand/zw.svg"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
