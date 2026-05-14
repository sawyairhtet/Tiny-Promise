import type { Metadata } from "next";
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
        <header className="pt-8 pb-4 text-center">
          <h1 className="text-2xl font-semibold text-warm-800 tracking-tight">
            Tiny Promise
          </h1>
          <p className="text-sm text-warm-400 mt-1">
            One promise is enough.
          </p>
        </header>
        <main className="flex-1 max-w-md mx-auto w-full px-4 pb-24">
          {children}
        </main>
        <Navigation />
      </body>
    </html>
  );
}
