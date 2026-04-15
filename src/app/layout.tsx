import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "esimQ | Premium Travel eSIM — 190+ Countries",
  description:
    "Buy premium travel eSIM plans with instant QR delivery, transparent pricing, and secure checkout. Stay connected across 190+ countries.",
  keywords: "eSIM, travel SIM, international data, roaming, QR eSIM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={
          {
            "--font-inter":
              '"Inter", "Helvetica Neue", Arial, sans-serif',
            "--font-space-grotesk":
              '"Space Grotesk", "IBM Plex Sans", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
          } as CSSProperties
        }
        className="bg-[var(--bg)] text-[var(--ink)] antialiased"
      >
        {children}
      </body>
    </html>
  );
}
