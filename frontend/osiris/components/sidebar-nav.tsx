"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Printer,
  Bell,
  History,
  Server,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/protected/dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { href: "/protected/printers",  label: "Printers",   icon: Printer },
  { href: "/protected/alerts",    label: "Alerts",     icon: Bell, badge: 2 },
  { href: "/protected/history",   label: "History",    icon: History },
  { href: "/protected/fleet",     label: "Fleet",      icon: Server },
  { href: "/protected/settings",  label: "Settings",   icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-[240px] min-h-screen border-r border-border bg-card shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-border shrink-0">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5"/>
            <circle cx="7" cy="7" r="2" fill="hsl(var(--primary-foreground))"/>
          </svg>
        </div>
        <span className="font-semibold text-sm tracking-tight text-foreground">
          PrintGuard <span className="text-primary">AI</span>
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors relative",
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon size={16} strokeWidth={active ? 2 : 1.5} />
              <span>{label}</span>
              {badge && (
                <span className="ml-auto bg-pg-danger text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md">
          <div className="w-7 h-7 rounded-full bg-surface-2 flex items-center justify-center text-xs font-semibold text-muted-foreground">
            LM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">Lab Manager</p>
            <p className="text-[10px] text-muted-foreground truncate">DSU Makerspace</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
