import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CategoryBadge } from "@/components/CategoryBadge";
import { articleImage, relativeTime } from "@/lib/categories";
import { displayContent, displayTitle, fetchArticleById } from "@/lib/supabase";
import { useEffect, useState } from "react";
import type { NewsArticle } from "@/lib/supabase";

export const Route = createFileRoute("/article/$id")({
  component: ArticlePage,
});

function ArticlePage() {
  const { id } = Route.useParams();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchArticleById(Number(id))
      .then((a) => {
        if (!a) throw notFound();
        setArticle(a);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AppShell>
      <Link
        to="/"
        className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-56 w-full rounded-2xl bg-muted" />
          <div className="h-6 w-3/4 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : article ? (
        <article className="space-y-5">
          <div className="overflow-hidden rounded-2xl">
            <img
              src={articleImage(article.id, article.category, 1200, 750)}
              alt=""
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
          <CategoryBadge category={article.category} />
          <h1 className="font-display text-3xl font-extrabold leading-tight">
            {displayTitle(article)}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {article.source ? (
              <span className="font-semibold text-foreground">{article.source}</span>
            ) : null}
            {article.source ? <span>·</span> : null}
            <span>{relativeTime(article.created_at)}</span>
          </div>
          <div className="whitespace-pre-line text-[15px] leading-relaxed text-foreground/85">
            {displayContent(article) || "No content available."}
          </div>
          {article.url ? (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Read original <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </article>
      ) : null}
    </AppShell>
  );
}