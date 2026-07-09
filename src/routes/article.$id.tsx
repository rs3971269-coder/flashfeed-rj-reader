import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CategoryBadge } from "@/components/CategoryBadge";
import { articleImage, relativeTime } from "@/lib/categories";
import { displayContent, displayTitle, fetchArticleById } from "@/lib/supabase";
import { useEffect, useState } from "react";
import type { NewsArticle } from "@/lib/supabase";

export const Route = createFileRoute("/article/$id")({
  loader: async ({ params }) => {
    const a = await fetchArticleById(Number(params.id));
    return { article: a };
  },
  head: ({ params, loaderData }) => {
    const a = loaderData?.article ?? null;
    const url = `https://flashfeed-rj-reader.lovable.app/article/${params.id}`;
    const rawTitle = a ? displayTitle(a) : "Article";
    const title = `${rawTitle} — NewsFlash`.slice(0, 60);
    const rawDesc = a ? displayContent(a) : "";
    const description = (rawDesc || "Read this news story on NewsFlash — AI-summarized headlines for fast, mobile-first reading.")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 155);
    const image = a ? articleImage(a.id, a.category, 1200, 750) : undefined;
    const meta: Array<Record<string, string>> = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: url },
    ];
    if (image) meta.push({ property: "og:image", content: image });
    const scripts = a
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              headline: displayTitle(a),
              image: image ? [image] : undefined,
              datePublished: a.created_at,
              dateModified: a.created_at,
              url,
              publisher: { "@type": "Organization", name: a.source ?? "NewsFlash" },
              mainEntityOfPage: url,
            }),
          },
        ]
      : undefined;
    return { meta, links: [{ rel: "canonical", href: url }], scripts };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { id } = Route.useParams();
  const initial = Route.useLoaderData().article;
  const [article, setArticle] = useState<NewsArticle | null>(initial);
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial && initial.id === Number(id)) return;
    setLoading(true);
    fetchArticleById(Number(id))
      .then((a) => {
        if (!a) throw notFound();
        setArticle(a);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [id, initial]);

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