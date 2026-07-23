export type ContentCategory = "short" | "weekly" | "personal";

export interface ContentMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  form: "article" | "newsletter"; // article >= 500 words, newsletter < 500 words
  category: ContentCategory;
  wordCount: number;
  pdf?: string;
  verdictId?: number;
  verdictTier?: string;
  verdictJurisdiction?: string;
  verdictDecision?: string;
  verdictEdi?: number;
  verdictDp?: number;
  verdictDr?: number;
  verdictUncertainty?: number;
}

export interface ContentItem extends ContentMeta {
  body: string;
}

export async function getAllContent(): Promise<ContentMeta[]> {
  const res = await fetch("/api/content");
  const data = await res.json();
  return data.items;
}

export async function getContentBySlug(slug: string): Promise<ContentItem | null> {
  const res = await fetch(`/api/content/${slug}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.item;
}

export async function getShortForm(): Promise<ContentMeta[]> {
  const res = await fetch("/api/content/short");
  const data = await res.json();
  return data.items;
}

export async function getWeeklyBriefings(): Promise<ContentMeta[]> {
  const res = await fetch("/api/content/weekly");
  const data = await res.json();
  return data.items;
}

export async function getPersonalPieces(): Promise<ContentMeta[]> {
  const res = await fetch("/api/content/personal");
  const data = await res.json();
  return data.items;
}

export async function getOthers(): Promise<ContentMeta[]> {
  const res = await fetch("/api/content/other");
  const data = await res.json();
  return data.items;
}

export async function getProfile(): Promise<string> {
  const res = await fetch("/api/profile");
  const data = await res.json();
  return data.markdown;
}

export async function getLikes(form: string, slug: string): Promise<number> {
  const res = await fetch(`/api/likes/${form}/${slug}`);
  const data = await res.json();
  return data.count;
}

export async function addLike(form: string, slug: string): Promise<number> {
  const res = await fetch(`/api/likes/${form}/${slug}`, { method: "POST" });
  const data = await res.json();
  return data.count;
}

export async function submitContact(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success?: boolean; error?: string }> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
