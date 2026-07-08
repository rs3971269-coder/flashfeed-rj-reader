import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Home, Compass, Bookmark, User, X } from "lucide-react";
import { CategoryProvider, useCategory } from "@/lib/category-context";
import { CATEGORIES, type CategoryKey } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

function TopBar() {
  const { setDrawerOpen, category } = useCategory();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur">
      <button
        aria-label="Open categories"
        onClick={() => setDrawerOpen(true)}
        className="grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-muted"
      >
        <Menu className="h-5 w-5" />
      </button>
      <Link to="/" className="flex items-baseline gap-1">
        <span className="font-display text-xl font-extrabold tracking-tight">News</span>
        <span className="font-display text-xl font-extrabold tracking-tight text-primary">Flash</span>
      </Link>
      {category ? (
        <span className="ml-auto rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {category}
        </span>
      ) : (
        <span className="ml-auto text-xs font-medium text-muted-foreground">All categories</span>
      )}
    </header>
  );
}

function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const tabs = [
    { to: "/", label: "Feed", Icon: Home, match: (p: string) => p === "/" },
    { to: "/explore", label: "Explore", Icon: Compass, match: (p: string) => p.startsWith("/explore") },
    { to: "/saved", label: "Saved", Icon: Bookmark, match: (p: string) => p.startsWith("/saved") },
    { to: "/account", label: "Account", Icon: User, match: (p: string) => p.startsWith("/account") },
  ] as const;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="mx-auto grid max-w-2xl grid-cols-4">
        {tabs.map(({ to, label, Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={to}>
              <Link
                to={to}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function CategoryDrawer() {
  const { drawerOpen, setDrawerOpen, category, setCategory } = useCategory();
  const pick = (c: CategoryKey | null) => {
    setCategory(c);
    setDrawerOpen(false);
  };
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-foreground/40 transition-opacity",
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setDrawerOpen(false)}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[82%] max-w-xs bg-sidebar text-sidebar-foreground shadow-xl transition-transform duration-300",
          drawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
          <span className="font-display text-lg font-extrabold">Categories</span>
          <button
            aria-label="Close"
            onClick={() => setDrawerOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-sidebar-accent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <ul className="p-2">
          <li>
            <button
              onClick={() => pick(null)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium",
                category === null ? "bg-primary text-primary-foreground" : "hover:bg-sidebar-accent",
              )}
            >
              <span className="grid h-8 w-8 place-items-center rounded-md bg-muted text-foreground">
                <Home className="h-4 w-4" />
              </span>
              All
            </button>
          </li>
          {CATEGORIES.map(({ key, icon: Icon, color }) => {
            const active = category === key;
            return (
              <li key={key}>
                <button
                  onClick={() => pick(key)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium",
                    active ? "bg-primary text-primary-foreground" : "hover:bg-sidebar-accent",
                  )}
                >
                  <span className={cn("grid h-8 w-8 place-items-center rounded-md text-white", color)}>
                    <Icon className="h-4 w-4" />
                  </span>
                  {key}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <CategoryProvider>
      <div className="min-h-screen bg-background font-sans text-foreground">
        <TopBar />
        <CategoryDrawer />
        <main className="mx-auto max-w-2xl px-4 pb-24 pt-4">{children}</main>
        <BottomNav />
      </div>
    </CategoryProvider>
  );
}