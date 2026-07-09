import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { GridCard, HeroCard, WideCard } from "@/components/ArticleCards";
import { ArticleSkeleton } from "@/components/ArticleSkeleton";
import { useCategory } from "@/lib/category-context";
import { fetchArticles, PAGE_SIZE, type NewsArticle } from "@/lib/supabase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NewsFlash — Top stories, summarized" },
      { name: "description", content: "Browse the latest top news stories with AI-generated summaries. Fast, mobile-first reading across tech, business, sports and more." },
      { property: "og:title", content: "NewsFlash — Top stories, summarized" },
      { property: "og:description", content: "Browse the latest top news stories with AI-generated summaries. Fast, mobile-first reading across tech, business, sports and more." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://flashfeed-rj-reader.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://flashfeed-rj-reader.lovable.app/" }],
  }),
  component: () => (
    <AppShell>
      <FeedPage />
    </AppShell>
  ),
});

function FeedPage() {
  const { category } = useCategory();
  const [items, setItems] = useState<NewsArticle[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(
    async (nextPage: number, replace: boolean) => {
      const from = nextPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      try {
        const rows = await fetchArticles({ category, from, to });
        setItems((prev) => (replace ? rows : [...prev, ...rows]));
        setDone(rows.length < PAGE_SIZE);
        setPage(nextPage);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      }
    },
    [category],
  );

  useEffect(() => {
    setLoading(true);
    setDone(false);
    load(0, true).finally(() => setLoading(false));
  }, [category, load]);

  useEffect(() => {
    if (done || loading) return;
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          setLoadingMore(true);
          await load(page + 1, false);
          setLoadingMore(false);
        }
      },
      { rootMargin: "300px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [done, loading, loadingMore, page, load]);

  const refresh = async () => {
    setRefreshing(true);
    setDone(false);
    await load(0, true);
    setRefreshing(false);
  };

  if (loading) {
    return <ArticleSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl bg-muted p-8 text-center text-sm text-muted-foreground">
        No articles{category ? ` in ${category}` : ""} yet.
      </div>
    );
  }

  const [hero, ...rest] = items;

  // Group rest into a pattern: 1 wide, then 2-col grid pair, repeating
  const blocks: Array<{ kind: "wide"; a: NewsArticle } | { kind: "grid"; a: NewsArticle; b?: NewsArticle }> = [];
  let i = 0;
  let cycle = 0;
  while (i < rest.length) {
    if (cycle % 2 === 0) {
      blocks.push({ kind: "wide", a: rest[i] });
      i += 1;
    } else {
      blocks.push({ kind: "grid", a: rest[i], b: rest[i + 1] });
      i += 2;
    }
    cycle += 1;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-extrabold">
          {category ? category : "Top stories"}
        </h1>
        <button
          onClick={refresh}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-60"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <HeroCard article={hero} />

      <div className="space-y-4">
        {blocks.map((b, idx) =>
          b.kind === "wide" ? (
            <WideCard key={`w-${b.a.id}`} article={b.a} />
          ) : (
            <div key={`g-${b.a.id}-${idx}`} className="grid grid-cols-2 gap-3">
              <GridCard article={b.a} />
              {b.b ? <GridCard article={b.b} /> : null}
            </div>
          ),
        )}
      </div>

      {!done ? (
        <div ref={sentinelRef} className="flex items-center justify-center py-6 text-muted-foreground">
          {loadingMore ? <Loader2 className="h-5 w-5 animate-spin" /> : <span className="text-xs">Load more…</span>}
        </div>
      ) : (
        <p className="py-6 text-center text-xs text-muted-foreground">You're all caught up.</p>
      )}
    </div>
  );
}
