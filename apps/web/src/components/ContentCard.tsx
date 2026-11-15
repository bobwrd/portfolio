import { Link } from "react-router-dom";
import type { ContentMeta, ContentCategory } from "@/lib/api";

interface ContentCardProps {
  item: ContentMeta;
  variant?: "list" | "grid";
  /** Hide the category label, e.g. on that category's own page. */
  hideCategory?: boolean;
}

function readTime(wordCount: number): string {
  const mins = Math.max(1, Math.ceil(wordCount / 200));
  return `${mins} min read`;
}

// Category badge + style for the 4 content types.
const CATEGORY_LABEL: Record<ContentCategory, string> = {
  short: "Short-form",
  weekly: "Weekly Briefing",
  personal: "Essay",
  other: "Analysis",
};

function CategoryBadge({ category }: { category: ContentCategory }) {
  return <span className="text-foreground">{CATEGORY_LABEL[category]}</span>;
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

export default function ContentCard({ item, variant = "list", hideCategory = false }: ContentCardProps) {
  const articleHref = categoryHref(item.category, item.slug);

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString("en-SG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const meta = (
    <p className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-[0.875rem] text-muted-foreground">
      {!hideCategory && <CategoryBadge category={item.category} />}
      {formattedDate && <time dateTime={item.date}>{formattedDate}</time>}
      <span>{readTime(item.wordCount)}</span>
    </p>
  );
  const tags =
    item.tags.length > 0 ? (
      <p className="font-sans text-[0.875rem] text-muted-foreground">
        Tags: {item.tags.join(", ")}
      </p>
    ) : null;

  if (variant === "grid") {
    return (
      <Link to={articleHref} className="group flex h-full flex-col border-t border-foreground pt-4">
        {meta}
        <h2 className="mt-3 font-serif text-xl leading-snug decoration-1 underline-offset-4 group-hover:underline line-clamp-3">
          {item.title}
        </h2>
        {item.summary && (
          <p className="mt-2 font-sans text-[0.9375rem] leading-relaxed text-muted-foreground line-clamp-3">
            {item.summary}
          </p>
        )}
      </Link>
    );
  }

  return (
    <article className="border-b border-border py-7">
      {meta}
      <Link to={articleHref} className="group mt-2 block">
        <h2 className="font-serif text-2xl leading-snug decoration-1 underline-offset-4 group-hover:underline">
          {item.title}
        </h2>
      </Link>
      {item.summary && (
        <p className="mt-2 max-w-[42rem] font-sans text-[0.9375rem] leading-relaxed text-muted-foreground">
          {item.summary}
        </p>
      )}
      {tags && <div className="mt-3">{tags}</div>}
    </article>
  );
}
