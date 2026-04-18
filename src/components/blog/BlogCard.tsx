"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { PostPreview } from "@/sanity/queries";
import { urlFor } from "@/sanity/lib/image";
import { CalendarDays, User, ArrowRight, Tag } from "lucide-react";

interface BlogCardProps {
  post: PostPreview;
}

/**
 * Formats a date string into a readable human date.
 * Example: "2025-03-15T08:00:00Z" → "March 15, 2025"
 */
function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Converts a raw category slug into a display label.
 * E.g. "crochet-tips" → "Crochet Tips"
 */
function formatCategory(cat: string): string {
  return cat
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function BlogCard({ post }: BlogCardProps) {
  const imageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage).width(800).height(500).fit("crop").url()
    : null;

  const firstCategory = post.categories?.[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-shadow duration-500 h-full"
    >
      {/* Featured Image */}
      <Link
        href={`/blog/${post.slug.current}`}
        className="relative block aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0"
        aria-label={`Read "${post.title}"`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt ?? post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          // Placeholder when no image is set in Sanity
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-100 to-rose-50 dark:from-zinc-800 dark:to-zinc-700">
            <span className="text-4xl filter grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
              🧶
            </span>
          </div>
        )}

        {/* Category badge overlaid on the image */}
        {firstCategory && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 text-[10px] font-bold uppercase tracking-wider px-3 py-1 shadow-sm backdrop-blur-md border border-white/20 dark:border-white/10">
              <Tag className="h-3 w-3 text-orange-400" />
              {formatCategory(firstCategory)}
            </span>
          </div>
        )}
      </Link>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-6 sm:p-7 gap-4">
        {/* Meta row: date + author */}
        <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          {post.publishedAt && (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(post.publishedAt)}
            </span>
          )}
          {post.author?.name && (
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {post.author.name}
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/blog/${post.slug.current}`} className="group/title block">
          <h2 className="text-xl sm:text-2xl font-bold leading-tight text-zinc-900 dark:text-zinc-50 group-hover/title:text-orange-500 transition-colors duration-300 line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Read More CTA */}
        <div className="mt-auto pt-4">
          <Link
            href={`/blog/${post.slug.current}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100 group/link"
            aria-label={`Read more about ${post.title}`}
          >
            <span className="relative">
              Read More
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover/link:w-full" />
            </span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
