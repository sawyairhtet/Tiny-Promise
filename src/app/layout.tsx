import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import AppShell from "@/components/AppShell";
import Navigation from "@/components/Navigation";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-garden-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tiny Promise",
  description: "One small promise a day. Self-trust, built gently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${fraunces.variable}`}>
      <body className="min-h-full flex flex-col antialiased">
        <AppShell>{children}</AppShell>
        <Navigation />
      </body>
    </html>
  );
}
