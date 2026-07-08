import { getCategoryMeta } from "@/lib/categories";
import { cn } from "@/lib/utils";

export function CategoryBadge({
  category,
  className,
}: {
  category: string | null | undefined;
  className?: string;
}) {
  const meta = getCategoryMeta(category);
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        meta.color,
        meta.fg,
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {meta.key}
    </span>
  );
}