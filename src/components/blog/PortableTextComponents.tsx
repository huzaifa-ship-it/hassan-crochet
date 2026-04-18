'use client'

/**
 * Custom renderers for @portabletext/react.
 *
 * Each key maps to a Sanity block type or mark and returns the
 * React element that should be rendered for it.
 *
 * Kept as a 'use client' component because PortableText itself
 * uses React context for custom components — it's fine since there
 * is no server-only data fetching here.
 */

import type { PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

// Helper: render a syntax-highlighted code block
// (no external dep needed — a simple styled <pre> is sufficient)
function CodeBlock({ children }: { children: string }) {
  return (
    <div className="my-6 rounded-lg overflow-hidden border border-border bg-[#1e1e2e]">
      {/* Decorative dots like a macOS terminal */}
      <div className="flex gap-1.5 px-4 py-2.5 bg-[#181825] border-b border-border">
        <span className="inline-block w-3 h-3 rounded-full bg-[#f38ba8]" />
        <span className="inline-block w-3 h-3 rounded-full bg-[#f9e2af]" />
        <span className="inline-block w-3 h-3 rounded-full bg-[#a6e3a1]" />
      </div>
      <pre className="overflow-x-auto p-5 text-sm font-mono leading-relaxed text-[#cdd6f4]">
        <code>{children}</code>
      </pre>
    </div>
  )
}

export const portableTextComponents: PortableTextComponents = {
  // ----------------------------------------------------------------
  // Block-level renderers
  // ----------------------------------------------------------------
  block: {
    normal: ({ children }) => (
      <p className="mb-5 leading-relaxed text-foreground/90">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 text-2xl font-semibold tracking-tight text-foreground scroll-mt-20">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-xl font-semibold tracking-tight text-foreground scroll-mt-20">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-6 mb-2 text-lg font-semibold text-foreground scroll-mt-20">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 pl-5 border-l-4 border-primary text-foreground/75 italic leading-relaxed">
        {children}
      </blockquote>
    ),
  },

  // ----------------------------------------------------------------
  // List renderers
  // ----------------------------------------------------------------
  list: {
    bullet: ({ children }) => (
      <ul className="my-5 ml-6 list-disc space-y-2 text-foreground/90 marker:text-primary">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-5 ml-6 list-decimal space-y-2 text-foreground/90 marker:text-primary">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },

  // ----------------------------------------------------------------
  // Inline mark renderers
  // ----------------------------------------------------------------
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline underline-offset-2">{children}</span>,
    // Inline code (single backtick)
    code: ({ children }) => (
      <code className="rounded bg-muted px-1.5 py-0.5 text-[0.875em] font-mono text-primary">
        {children}
      </code>
    ),
    // External link annotation
    link: ({ value, children }) => {
      const target = value?.blank ? '_blank' : '_self'
      const rel = target === '_blank' ? 'noopener noreferrer' : undefined
      return (
        <a
          href={value?.href}
          target={target}
          rel={rel}
          className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors duration-150"
        >
          {children}
        </a>
      )
    },
  },

  // ----------------------------------------------------------------
  // Custom block types (e.g. inline images in the body)
  // ----------------------------------------------------------------
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null

      const src = urlFor(value).width(1200).fit('max').url()
      const alt: string = value.alt ?? 'Blog post image'
      const caption: string | undefined = value.caption

      return (
        <figure className="my-8">
          <div className="relative overflow-hidden rounded-lg border border-border bg-muted">
            {/* Next/Image with width & height derived from the Sanity asset */}
            <Image
              src={src}
              alt={alt}
              width={1200}
              height={750}
              className="w-full h-auto object-cover"
              sizes="(min-width: 768px) 768px, 100vw"
            />
          </div>
          {caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground italic">
              {caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}
