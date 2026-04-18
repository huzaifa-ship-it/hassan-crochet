/**
 * Skeleton placeholder displayed while blog posts are loading.
 * Matches the exact layout of BlogCard so the page doesn't jump.
 */
export default function BlogCardSkeleton() {
  return (
    <div className="flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-sm animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-[16/10] bg-muted" />

      {/* Body placeholder */}
      <div className="flex flex-col gap-3 p-5">
        {/* Meta row */}
        <div className="flex gap-4">
          <div className="h-3 w-24 rounded-full bg-muted" />
          <div className="h-3 w-20 rounded-full bg-muted" />
        </div>

        {/* Title lines */}
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />

        {/* Excerpt lines */}
        <div className="space-y-2 pt-1">
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-2/3 rounded bg-muted" />
        </div>

        {/* CTA placeholder */}
        <div className="h-3 w-20 rounded-full bg-muted mt-2" />
      </div>
    </div>
  )
}
