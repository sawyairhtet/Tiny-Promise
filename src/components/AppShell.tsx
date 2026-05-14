export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[640px] mx-auto w-full px-5 pb-28">
      <header className="pt-10 pb-6 text-center">
        <h1 className="text-2xl font-semibold text-warm-800 tracking-tight">
          Tiny Promise
        </h1>
        <p className="text-sm text-warm-400 mt-1">One promise is enough.</p>
      </header>
      <main>{children}</main>
    </div>
  );
}
