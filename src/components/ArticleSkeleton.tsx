export function ArticleSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-56 w-full rounded-2xl bg-muted" />
      <div className="h-24 w-full rounded-xl bg-muted" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-48 rounded-xl bg-muted" />
        <div className="h-48 rounded-xl bg-muted" />
      </div>
    </div>
  );
}