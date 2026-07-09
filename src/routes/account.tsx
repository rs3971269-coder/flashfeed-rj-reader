import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — Your NewsFlash profile" },
      { name: "description", content: "Manage your NewsFlash profile and reading preferences. Account features are coming soon." },
      { property: "og:title", content: "Account — Your NewsFlash profile" },
      { property: "og:description", content: "Manage your NewsFlash profile and reading preferences. Account features are coming soon." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://flashfeed-rj-reader.lovable.app/account" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://flashfeed-rj-reader.lovable.app/account" }],
  }),
  component: () => (
    <AppShell>
      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
          <User className="h-7 w-7" />
        </span>
        <h1 className="font-display text-2xl font-extrabold">Your account</h1>
        <p className="max-w-xs text-sm text-muted-foreground">
          Profile and preferences are coming soon.
        </p>
      </div>
    </AppShell>
  ),
});