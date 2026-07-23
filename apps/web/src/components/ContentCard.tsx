import { Link } from "react-router-dom";
import type { ContentMeta, ContentCategory } from "@/lib/api";

interface ContentCardProps {
  item: ContentMeta;
  variant?: "list" | "grid";
}

function readTime(wordCount: number): string {
  const mins = Math.max(1, Math.ceil(wordCount / 200));
  return `${mins} min read`;
}

// Category badge + style for the 3 content types.
const CATEGORY_LABEL: Record<ContentCategory, string> = {
  short: "Short-form",
  weekly: "Weekly Briefing",
  personal: "Personal Piece",
};

const CATEGORY_STYLE: Record<ContentCategory, string> = {
  short: "bg-warm-accent-muted text-warm-accent",
  weekly: "bg-secondary text-muted-foreground",
  personal: "bg-secondary text-foreground",
};

function CategoryBadge({ category }: { category: ContentCategory }) {
  return (
    <span
      className={`text-xs px-2.5 py-0.5 rounded-full font-medium tracking-wide ${CATEGORY_STYLE[category]}`}
    >
      {CATEGORY_LABEL[category]}
    </span>
  );
}

// Route each category to its own slug-prefixed URL.
function categoryHref(category: ContentCategory, slug: string): string {
  switch (category) {
    case "short": return `/writing/${slug}`;
    case "weekly": return `/writing/weekly/${slug}`;
    case "personal": return `/writing/personal/${slug}`;
    default: return `/writing/others/${slug}`;
  }
}

export default function ContentCard({ item, variant = "list" }: ContentCardProps) {
  const articleHref = categoryHref(item.category, item.slug);

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString("en-SG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  if (variant === "grid") {
    return (
      <Link
        to={articleHref}
        className="group relative flex flex-col h-full p-5 rounded-lg border border-border bg-card hover:border-warm-accent/40 hover:shadow-sm transition-all duration-200"
      >
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <CategoryBadge category={item.category} />
          {formattedDate && (
            <time className="text-xs text-muted-foreground">{formattedDate}</time>
          )}
        </div>

        <h2 className="text-base font-semibold text-foreground group-hover:text-warm-accent transition-colors duration-150 leading-snug mb-2 line-clamp-3">
          {item.title}
        </h2>

        {item.summary && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
            {item.summary}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 flex-wrap">
          {item.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {item.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-muted-foreground/80 bg-secondary px-2.5 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {item.tags.length > 2 && (
                <span className="text-xs text-muted-foreground/60">+{item.tags.length - 2}</span>
              )}
            </div>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted-foreground/70">{readTime(item.wordCount)}</span>
        </div>
      </Link>
    );
  }

  return (
    <article className="group py-7 border-b border-border last:border-0 transition-all duration-200">
      <div className="flex items-center gap-2.5 mb-3">
        <CategoryBadge category={item.category} />
        {item.date && (
          <time className="text-xs text-muted-foreground">
            {new Date(item.date).toLocaleDateString("en-SG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}
        <span className="text-xs text-muted-foreground/70">
          {readTime(item.wordCount)}
        </span>
      </div>

      <Link to={articleHref} className="block">
        <h2 className="text-lg font-semibold text-foreground group-hover:text-warm-accent transition-colors duration-150 leading-snug mb-2">
          {item.title}
        </h2>
      </Link>

      {item.summary && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-prose">
          {item.summary}
        </p>
      )}

      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-muted-foreground/80 bg-secondary px-2.5 py-0.5 rounded-full transition-colors duration-150 hover:bg-secondary/80"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
