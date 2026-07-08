import { Link } from "@tanstack/react-router";
import { articleImage, relativeTime } from "@/lib/categories";
import { displayContent, displayTitle, type NewsArticle } from "@/lib/supabase";
import { CategoryBadge } from "./CategoryBadge";

export function HeroCard({ article }: { article: NewsArticle }) {
  return (
    <Link
      to="/article/$id"
      params={{ id: String(article.id) }}
      className="group relative block overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border transition hover:shadow-md"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <img
          src={articleImage(article.id, article.category, 900, 560)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 space-y-3 p-4">
          <CategoryBadge category={article.category} />
          <h2 className="font-display text-2xl font-extrabold leading-tight text-white drop-shadow-sm">
            {displayTitle(article)}
          </h2>
          <div className="flex items-center gap-2 text-xs text-white/85">
            {article.source ? <span className="font-medium">{article.source}</span> : null}
            {article.source ? <span>·</span> : null}
            <span>{relativeTime(article.created_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function WideCard({ article }: { article: NewsArticle }) {
  return (
    <Link
      to="/article/$id"
      params={{ id: String(article.id) }}
      className="flex gap-3 overflow-hidden rounded-xl bg-card p-3 ring-1 ring-border transition hover:shadow-sm"
    >
      <img
        src={articleImage(article.id, article.category, 320, 320)}
        alt=""
        loading="lazy"
        className="h-24 w-24 shrink-0 rounded-lg object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <CategoryBadge category={article.category} className="self-start" />
        <h3 className="font-display line-clamp-2 text-[15px] font-bold leading-snug">
          {displayTitle(article)}
        </h3>
        <p className="line-clamp-2 text-xs text-muted-foreground">{displayContent(article)}</p>
        <div className="mt-auto flex items-center gap-2 text-[11px] text-muted-foreground">
          {article.source ? <span className="truncate font-medium">{article.source}</span> : null}
          {article.source ? <span>·</span> : null}
          <span>{relativeTime(article.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}

export function GridCard({ article }: { article: NewsArticle }) {
  return (
    <Link
      to="/article/$id"
      params={{ id: String(article.id) }}
      className="flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-border transition hover:shadow-sm"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={articleImage(article.id, article.category, 480, 360)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <CategoryBadge category={article.category} className="absolute left-2 top-2" />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="font-display line-clamp-3 text-sm font-bold leading-snug">
          {displayTitle(article)}
        </h3>
        <div className="mt-auto pt-1 text-[11px] text-muted-foreground">
          {relativeTime(article.created_at)}
        </div>
      </div>
    </Link>
  );
}