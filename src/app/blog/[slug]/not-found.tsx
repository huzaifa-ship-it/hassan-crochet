import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

/**
 * Rendered when a blog slug is not found in Sanity.
 * Next.js automatically shows this when notFound() is called in page.tsx.
 */
export default function BlogPostNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-24">
      <span className="text-6xl mb-6" aria-hidden>
        🧶
      </span>
      <h1 className="text-3xl font-bold text-foreground mb-3">
        Post not found
      </h1>
      <p className="max-w-sm text-muted-foreground mb-8">
        We couldn&apos;t find the article you&apos;re looking for. It may have
        been moved or removed.
      </p>
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors duration-150"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>
    </div>
  )
}
