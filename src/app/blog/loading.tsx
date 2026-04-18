import BlogCardSkeleton from '@/components/blog/BlogCardSkeleton'

/**
 * Instant loading skeleton shown by Next.js while the blog page's
 * async data fetch resolves. Mirrors the 3-column grid layout.
 */
export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <section className="border-b border-border bg-gradient-to-b from-accent/40 to-background py-16 md:py-24">
        <div className="container mx-auto max-w-5xl px-4 text-center space-y-4 animate-pulse">
          <div className="mx-auto h-5 w-28 rounded-full bg-muted" />
          <div className="mx-auto h-12 w-2/3 rounded-lg bg-muted" />
          <div className="mx-auto h-4 w-1/2 rounded bg-muted" />
        </div>
      </section>

      {/* Grid skeleton */}
      <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  )
}
