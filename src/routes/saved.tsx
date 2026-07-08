import { createFileRoute } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "Saved — NewsFlash" }] }),
  component: () => (
    <AppShell>
      <ComingSoon icon="saved" title="Saved articles" subtitle="Bookmarking is coming soon." />
    </AppShell>
  ),
});

function ComingSoon({ title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="mt-16 flex flex-col items-center gap-4 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
        <Bookmark className="h-7 w-7" />
      </span>
      <h1 className="font-display text-2xl font-extrabold">{title}</h1>
      <p className="max-w-xs text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}