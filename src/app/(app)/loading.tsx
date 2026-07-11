export default function AppLoading() {
  return (
    <div className="space-y-8 p-6 lg:p-8" aria-busy="true" aria-label="Loading">
      <div className="space-y-2">
        <div className="h-7 w-56 animate-pulse rounded-lg bg-card" />
        <div className="h-4 w-80 animate-pulse rounded-lg bg-card/60" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl border border-border bg-card/40" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-xl border border-border bg-card/40" />
        ))}
      </div>
    </div>
  );
}
