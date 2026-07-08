import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xnizuglcfovntdnonodf.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuaXp1Z2xjZm92bnRkbm9ub2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0OTQ4NzYsImV4cCI6MjA5OTA3MDg3Nn0.gQQEWgTKICHcAhAGXHZIT69ApX6OpxMp_BYoJff8x4s";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export type NewsArticle = {
  id: number;
  created_at: string;
  category: string | null;
  title: string | null;
  description: string | null;
  source: string | null;
  content: string | null;
  ai_summary: string | null;
  ai_title: string | null;
  url: string | null;
};

export function displayTitle(a: NewsArticle): string {
  const t = (a.ai_title ?? "").trim();
  return t.length > 0 ? t : (a.title ?? "").trim() || "Untitled";
}

export function displayContent(a: NewsArticle): string {
  const s = (a.ai_summary ?? "").trim();
  if (s.length > 0) return s;
  return (a.content ?? a.description ?? "").trim();
}

export const PAGE_SIZE = 20;

export async function fetchArticles(opts: {
  category?: string | null;
  from: number;
  to: number;
}) {
  let q = supabase
    .from("Newsflash")
    .select("*")
    .order("created_at", { ascending: false })
    .range(opts.from, opts.to);
  if (opts.category) q = q.eq("category", opts.category);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as NewsArticle[];
}

export async function fetchArticleById(id: number) {
  const { data, error } = await supabase
    .from("Newsflash")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as NewsArticle | null;
}