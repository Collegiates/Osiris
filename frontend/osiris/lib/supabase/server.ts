import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export type ConfigResult =
  | {
    success: true;
    config: {
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: string;
    };
  }
  | {
    success: false;
    error: string;
    errorType: "BACKEND_DOWN" | "INVALID_RESPONSE" | "NETWORK_ERROR" | "MISSING_ENV_VARS";
  };

async function getSupabaseConfig(): Promise<ConfigResult> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      return {
        success: false,
        error: "NEXT_PUBLIC_API_URL is not configured in .env.local",
        errorType: "INVALID_RESPONSE",
      };
    }

    const res = await fetch(`${apiUrl}/api/env`, {
      cache: "force-cache",
      next: { tags: ["env"] },
    });

    if (!res.ok) {
      if (res.status === 404 || res.status >= 500) {
        return {
          success: false,
          error: `Backend server error (${res.status}). Ensure the backend is running.`,
          errorType: "BACKEND_DOWN",
        };
      }
      return {
        success: false,
        error: `HTTP ${res.status}: ${res.statusText}`,
        errorType: "INVALID_RESPONSE",
      };
    }

    const data = await res.json();

    // Validate the response has required fields
    if (!data.NEXT_PUBLIC_SUPABASE_URL || !data.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      return {
        success: false,
        error: "Backend is missing Supabase environment variables. Check backend/.env file.",
        errorType: "MISSING_ENV_VARS",
      };
    }

    return {
      success: true,
      config: {
        NEXT_PUBLIC_SUPABASE_URL: data.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: data.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      },
    };
  } catch (error) {
    console.error("Error fetching Supabase config:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      errorType: "NETWORK_ERROR",
    };
  }
}

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const configResult = await getSupabaseConfig();

  if (!configResult.success) {
    throw new Error(`Failed to get Supabase config: ${configResult.error}`);
  }

  return createServerClient(
    configResult.config.NEXT_PUBLIC_SUPABASE_URL,
    configResult.config.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have proxy refreshing
            // user sessions.
          }
        },
      },
    },
  );
}

export async function getConfigForClient(): Promise<ConfigResult> {
  return getSupabaseConfig();
}

