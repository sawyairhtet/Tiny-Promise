import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import Navigation from "@/components/Navigation";
import "./globals.css";

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
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <AppShell>{children}</AppShell>
        <Navigation />
      </body>
    </html>
  );
}
