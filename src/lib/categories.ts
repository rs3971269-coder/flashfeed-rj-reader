import {
  Briefcase,
  Film,
  Globe,
  HeartPulse,
  FlaskConical,
  Trophy,
  Cpu,
  Newspaper,
  type LucideIcon,
} from "lucide-react";

export type CategoryKey =
  | "Business"
  | "Entertainment"
  | "General"
  | "Health"
  | "Science"
  | "Sports"
  | "Technology";

export const CATEGORIES: {
  key: CategoryKey;
  icon: LucideIcon;
  color: string; // tailwind bg class
  fg: string; // tailwind text class
}[] = [
  { key: "Business", icon: Briefcase, color: "bg-cat-business", fg: "text-white" },
  { key: "Entertainment", icon: Film, color: "bg-cat-entertainment", fg: "text-white" },
  { key: "General", icon: Globe, color: "bg-cat-general", fg: "text-white" },
  { key: "Health", icon: HeartPulse, color: "bg-cat-health", fg: "text-white" },
  { key: "Science", icon: FlaskConical, color: "bg-cat-science", fg: "text-white" },
  { key: "Sports", icon: Trophy, color: "bg-cat-sports", fg: "text-white" },
  { key: "Technology", icon: Cpu, color: "bg-cat-technology", fg: "text-white" },
];

export function getCategoryMeta(raw: string | null | undefined) {
  if (!raw) return { key: "General" as CategoryKey, icon: Newspaper, color: "bg-cat-general", fg: "text-white" };
  const normalized = raw.trim().toLowerCase();
  const found = CATEGORIES.find((c) => c.key.toLowerCase() === normalized);
  if (found) return found;
  return { key: (raw as CategoryKey) ?? "General", icon: Newspaper, color: "bg-muted", fg: "text-foreground" };
}

export function relativeTime(iso: string): string {
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString();
}

// Deterministic image per article id (stable per-article placeholder)
export function articleImage(id: number, category: string | null | undefined, w = 800, h = 500) {
  const seed = `${category ?? "news"}-${id}`;
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}