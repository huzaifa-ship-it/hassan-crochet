import { client } from "./client";

/** Options forwarded to the Next.js fetch cache layer. */
interface FetchOptions {
  /**
   * Number of seconds for ISR revalidation.
   * Omit (or set to undefined) to use `cache: 'no-store'` (no caching).
   * Pass a positive integer (e.g. 60) to enable time-based ISR.
   */
  revalidate?: number;
}

/**
 * Wrapper function to fetch a single item from Sanity with error handling.
 *
 * @param query      - The GROQ query string
 * @param params     - Query parameters
 * @param options    - Optional cache/revalidation settings
 * @returns The fetched data or null on error / no result
 */
export async function fetchSanity<T>(
  query: string,
  params?: Record<string, unknown>,
  options?: FetchOptions
): Promise<T | null> {
  try {
    // If revalidate is provided, use Next.js ISR; otherwise bypass cache entirely.
    const nextOptions =
      options?.revalidate !== undefined
        ? { next: { revalidate: options.revalidate } }
        : { cache: 'no-store' as const };

    const result = await client.fetch<T>(query, params || {}, nextOptions);
    return result;
  } catch (error) {
    console.error("Sanity fetch error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return null;
  }
}

/**
 * Wrapper function to fetch multiple items from Sanity with error handling.
 *
 * @param query      - The GROQ query string
 * @param params     - Query parameters
 * @param options    - Optional cache/revalidation settings
 * @returns The fetched data array or empty array on error
 */
export async function fetchSanityArray<T>(
  query: string,
  params?: Record<string, unknown>,
  options?: FetchOptions
): Promise<T[]> {
  try {
    const nextOptions =
      options?.revalidate !== undefined
        ? { next: { revalidate: options.revalidate } }
        : { cache: 'no-store' as const };

    const result = await client.fetch<T[]>(query, params || {}, nextOptions);
    return result || [];
  } catch (error) {
    console.error("Sanity fetch array error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return [];
  }
}
