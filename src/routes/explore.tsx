import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CategoryBadge } from "@/components/CategoryBadge";
import { ArticleSkeleton } from "@/components/ArticleSkeleton";
import { useCategory } from "@/lib/category-context";
import { articleImage, relativeTime } from "@/lib/categories";
import { displayContent, displayTitle, fetchArticles, type NewsArticle } from "@/lib/supabase";

export const Route = createFileRoute("/explore")({
  head: () => ({ meta: [{ title: "Explore — NewsFlash" }] }),
  component: () => (
    <AppShell>
      <ExplorePage />
    </AppShell>
  ),
});

function ExplorePage() {
  const { category } = useCategory();
  const [items, setItems] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchArticles({ category, from: 0, to: 49 })
      .then(setItems)
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) return <ArticleSkeleton />;
  if (items.length === 0) {
    return (
      <div className="rounded-xl bg-muted p-8 text-center text-sm text-muted-foreground">
        No articles{category ? ` in ${category}` : ""} to explore.
      </div>
    );
  }

  return (
    <div className="-mx-4 -mt-4">
      <div
        className="snap-y snap-mandatory overflow-y-auto"
        style={{ height: "calc(100dvh - 3.5rem - 4.25rem)", scrollbarWidth: "none" }}
      >
        {items.map((a) => (
          <ExploreCard key={a.id} article={a} />
        ))}
      </div>
    </div>
  );
}

function ExploreCard({ article }: { article: NewsArticle }) {
  return (
    <section
      className="relative flex snap-start flex-col overflow-hidden bg-background"
      style={{ height: "calc(100dvh - 3.5rem - 4.25rem)" }}
    >
      <div className="relative h-[46%] w-full overflow-hidden">
        <img
          src={articleImage(article.id, article.category, 900, 700)}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute left-4 top-4">
          <CategoryBadge category={article.category} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 px-5 pb-6 pt-2">
        <h2 className="font-display text-2xl font-extrabold leading-tight">
          {displayTitle(article)}
        </h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {article.source ? <span className="font-semibold text-foreground">{article.source}</span> : null}
          {article.source ? <span>·</span> : null}
          <span>{relativeTime(article.created_at)}</span>
        </div>
        <p className="line-clamp-[8] flex-1 text-[15px] leading-relaxed text-foreground/80">
          {displayContent(article) || "No summary available."}
        </p>
        <Link
          to="/article/$id"
          params={{ id: String(article.id) }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110"
        >
          View Full Article <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}