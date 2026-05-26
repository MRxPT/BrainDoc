import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function for conditionally merging class names.
 * Combines clsx (conditional classes) with tailwind-merge (deduplication).
 * This is the standard shadcn/ui utility pattern.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
