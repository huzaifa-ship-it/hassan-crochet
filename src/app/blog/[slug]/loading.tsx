/**
 * Blog detail page loading skeleton.
 * Displayed by Next.js while the async page component resolves.
 * Mirrors the structure of the actual post page to prevent layout shift.
 */
export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Hero image skeleton */}
      <div className="h-72 w-full bg-muted sm:h-96 md:h-[480px]" />

      <div className="container mx-auto max-w-3xl px-4">
        {/* Back link skeleton */}
        <div className="mt-8 h-4 w-24 rounded bg-muted" />

        {/* Header skeleton */}
        <header className="mt-6 mb-10 pb-8 border-b border-border space-y-4">
          {/* Category badge */}
          <div className="flex gap-2">
            <div className="h-5 w-24 rounded-full bg-muted" />
            <div className="h-5 w-20 rounded-full bg-muted" />
          </div>

          {/* Title */}
          <div className="space-y-3 pt-1">
            <div className="h-8 w-full rounded-lg bg-muted" />
            <div className="h-8 w-4/5 rounded-lg bg-muted" />
            <div className="h-8 w-3/5 rounded-lg bg-muted" />
          </div>

          {/* Excerpt */}
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
          </div>

          {/* Author + date row */}
          <div className="flex items-center gap-4 pt-2">
            <div className="h-10 w-10 rounded-full bg-muted shrink-0" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-28 rounded bg-muted" />
              <div className="h-3 w-20 rounded bg-muted" />
            </div>
            <div className="ml-4 h-3.5 w-32 rounded bg-muted" />
          </div>
        </header>

        {/* Body skeleton lines */}
        <div className="pb-16 space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-4 rounded bg-muted"
              style={{ width: `${85 + Math.sin(i) * 12}%` }}
            />
          ))}
          {/* Simulated image block */}
          <div className="my-8 h-64 w-full rounded-lg bg-muted" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`b-${i}`}
              className="h-4 rounded bg-muted"
              style={{ width: `${80 + Math.cos(i) * 15}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
