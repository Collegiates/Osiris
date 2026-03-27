"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutButton } from "./logout-button";
import { useSupabase } from "@/components/supabase-provider";
import { useEffect, useState } from "react";

export function AuthButton() {
  const supabase = useSupabase();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email ?? null);
      setIsLoading(false);
    };
    loadUser();
  }, [supabase]);

  if (isLoading) {
    return <div className="h-9 w-28 rounded-full bg-white/60" />;
  }

  return userEmail ? (
    <div className="flex items-center gap-4">
      Hey, {userEmail}!
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
