import { useState, useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import PaperHeader from "@/components/PaperHeader";
import ContentCard from "@/components/ContentCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import ViewToggle, { readStoredView, type ViewMode } from "@/components/ViewToggle";
import { getAllContent, type ContentMeta, type ContentCategory } from "@/lib/api";
import { usePageTitle } from "@/hooks/use-page-title";

const VIEW_STORAGE_KEY = "moe-view-mode";

interface CategoryPageProps {
  category: ContentCategory;
  title: string;
  subtitle: string;
  headingExtra?: React.ReactNode;
}

export default function CategoryPage({ category, title, subtitle, headingExtra }: CategoryPageProps) {
  usePageTitle(`${title}, Margin of Error`);
  const [allItems, setAllItems] = useState<ContentMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>(() => readStoredView(VIEW_STORAGE_KEY, "list"));
  const [tagQuery, setTagQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  useEffect(() => {
    getAllContent().then((all) => {
      setAllItems(
        all
          .filter((i) => i.category === category)
          .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      );
      setLoading(false);
    });
  }, [category]);

  // All unique tags across items, sorted alphabetically
  const allTags = useMemo(() => {
    const set = new Set<string>();
    allItems.forEach((i) => i.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [allItems]);

  // Tags that match the current query (for suggestion pills)
  const suggestedTags = useMemo(() => {
    const q = tagQuery.trim().toLowerCase();
    if (!q) return [];
    return allTags.filter(
      (t) => t.toLowerCase().includes(q) && !activeTags.includes(t)
    );
  }, [tagQuery, allTags, activeTags]);

  // Filtered items: must match ALL active tags
  const items = useMemo(() => {
    if (activeTags.length === 0) return allItems;
    return allItems.filter((item) =>
      activeTags.every((t) => item.tags?.includes(t))
    );
  }, [allItems, activeTags]);

  const addTag = (tag: string) => {
    if (!activeTags.includes(tag)) setActiveTags((prev) => [...prev, tag]);
    setTagQuery("");
  };

  const removeTag = (tag: string) => {
    setActiveTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagQuery.trim()) {
      // Add exact match if it exists, otherwise add the first suggestion
      const q = tagQuery.trim().toLowerCase();
      const exact = allTags.find((t) => t.toLowerCase() === q);
      const first = exact ?? suggestedTags[0];
      if (first) addTag(first);
    }
    if (e.key === "Backspace" && tagQuery === "" && activeTags.length > 0) {
      setActiveTags((prev) => prev.slice(0, -1));
    }
  };

  // Render verdict items always in list style; others follow the toggle.
  const renderItem = (item: ContentMeta) => (
    <ContentCard
      key={item.slug}
      item={item}
      variant={item.verdictId ? "list" : view}
      hideCategory
    />
  );

  return (
    <Layout>
      <div className="mb-10">
        <PaperHeader
          series="Margin of Error"
          meta={loading ? undefined : `${allItems.length} ${allItems.length === 1 ? "piece" : "pieces"}`}
          title={title}
          byline={subtitle}
        />
        {headingExtra && <div className="mt-4">{headingExtra}</div>}
      </div>

      {category === "short" && (
        <div className="mb-8">
          <NewsletterSignup />
        </div>
      )}

      {loading ? (
        <div className="py-12 font-sans text-[0.9375rem] text-muted-foreground">Loading…</div>
      ) : (
        <>
          {/* Tag filter */}
          <div className="mb-6">
            <div className="flex max-w-xl flex-wrap items-center gap-2 border border-input bg-background px-3 py-2 font-sans focus-within:border-foreground transition-colors">
              {activeTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 border border-foreground px-2 py-0.5 text-[0.8125rem]"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-foreground transition-colors leading-none"
                    aria-label={`Remove ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagQuery}
                onChange={(e) => setTagQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={activeTags.length === 0 ? "Filter by tag" : ""}
                aria-label="Filter by tag"
                className="flex-1 min-w-[120px] text-[0.9375rem] bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Suggestion pills */}
            {suggestedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {suggestedTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    className="border border-border px-2 py-0.5 font-sans text-[0.8125rem] text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {items.length === 0 ? (
            <div className="py-12 font-sans text-[0.9375rem] text-muted-foreground">
              {allItems.length === 0 ? "Nothing published yet." : "No articles match those tags."}
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                {activeTags.length > 0 ? (
                  <span className="font-sans text-[0.9375rem] text-muted-foreground">
                    {items.length} {items.length === 1 ? "result" : "results"}
                  </span>
                ) : (
                  <span />
                )}
                <ViewToggle value={view} onChange={setView} storageKey={VIEW_STORAGE_KEY} />
              </div>
              <div className={view === "grid" ? "grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3" : "border-t border-border"}>
                {items.map(renderItem)}
              </div>
            </>
          )}
        </>
      )}

      {category !== "short" && (
        <div className="mt-12">
          <NewsletterSignup compact />
        </div>
      )}
    </Layout>
  );
}
