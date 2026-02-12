import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

type ConfigResult =
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
        error: "NEXT_PUBLIC_API_URL is not configured",
        errorType: "INVALID_RESPONSE",
      };
    }

    const res = await fetch(`${apiUrl}/api/env`, {
      cache: "force-cache",
      next: { tags: ["env"] },
    });

    if (!res.ok) {
      return {
        success: false,
        error: `Backend error (${res.status})`,
        errorType: "BACKEND_DOWN",
      };
    }

    const data = await res.json();

    if (!data.NEXT_PUBLIC_SUPABASE_URL || !data.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      return {
        success: false,
        error: "Missing Supabase environment variables",
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
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      errorType: "NETWORK_ERROR",
    };
  }
}

export const updateSession = async (request: NextRequest) => {
  const configResult = await getSupabaseConfig();

  // If config failed, pass request through without auth checks
  // The root layout will display the error page
  if (!configResult.success) {
    console.error("Proxy middleware: Config error:", configResult.error);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }

  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    configResult.config.NEXT_PUBLIC_SUPABASE_URL,
    configResult.config.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
};

