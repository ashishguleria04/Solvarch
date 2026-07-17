export default function ProblemLoading() {
  return (
    <div
      className="grid h-[calc(100dvh-4rem)] grid-cols-1 gap-px bg-border lg:grid-cols-2"
      aria-busy="true"
      aria-label="Loading problem"
    >
      <div className="space-y-4 bg-background p-6">
        <div className="h-4 w-24 animate-pulse rounded bg-card" />
        <div className="h-7 w-2/3 animate-pulse rounded-lg bg-card" />
        <div className="flex gap-2">
          <div className="h-5 w-16 animate-pulse rounded-full bg-card/60" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-card/60" />
        </div>
        <div className="space-y-2 pt-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-4 animate-pulse rounded bg-card/50"
              style={{ width: `${90 - (i % 4) * 12}%` }}
            />
          ))}
        </div>
      </div>
      <div className="hidden bg-code p-6 lg:block">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-card" />
        <div className="mt-4 space-y-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-4 animate-pulse rounded bg-card/40"
              style={{ width: `${70 - (i % 5) * 10}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
