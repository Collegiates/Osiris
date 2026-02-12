import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Note: The hasEnvVars check has been removed because Supabase configuration
// is now fetched at runtime from the backend API (/api/env) instead of using
// build-time environment variables. The SupabaseProvider in layout.tsx handles
// fetching and initializing the Supabase client with credentials from the backend.
