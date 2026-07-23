import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { marked } from "marked";
import Layout from "@/components/Layout";
import LikeButton from "@/components/LikeButton";
import AuthorBox from "@/components/AuthorBox";
import NewsletterSignup from "@/components/NewsletterSignup";
import ReadingPreferences from "@/components/ReadingPreferences";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import { getContentBySlug, type ContentItem } from "@/lib/api";

function readTime(wordCount: number): string {
  const mins = Math.max(1, Math.ceil(wordCount / 200));
  return `${mins} min read`;
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [item, setItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getContentBySlug(slug).then((result) => {
      if (!result) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setItem(result);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="py-16 text-center text-sm text-muted-foreground">Loading…</div>
      </Layout>
    );
  }

  if (notFound || !item) {
    return (
      <Layout>
        <div className="py-16 text-center">
          <p className="text-muted-foreground mb-4">Not found.</p>
          <Link to="/writing" className="text-sm underline underline-offset-2">
            ← Home
          </Link>
        </div>
      </Layout>
    );
  }

  const htmlBody = marked.parse(item.body) as string;

  const backHref = (() => {
    switch (item.category) {
      case "short": return "/writing";
      case "weekly": return "/writing/weekly";
      case "personal": return "/writing/personal";
      default: return "/writing/others";
    }
  })();
  const backLabel = (() => {
    switch (item.category) {
      case "short": return "Short-form";
      case "weekly": return "Weekly Briefing";
      case "personal": return "Personal Pieces";
      default: return "Analysis";
    }
  })();
  const categoryLabel = backLabel;

  return (
    <Layout>
      <ReadingProgressBar />

      <div className="mb-6">
        <Link
          to={backHref}
          className="text-sm text-muted-foreground hover:text-warm-accent transition-colors duration-150"
        >
          ← {backLabel}
        </Link>
      </div>

      {/* Article header */}
      <header className="mb-10 pb-8 border-b border-border">
        <div className="flex items-center gap-2.5 mb-4">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium tracking-wide bg-secondary text-muted-foreground"
          >
            {categoryLabel}
          </span>
          <span className="text-xs text-muted-foreground/70">{readTime(item.wordCount)}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight leading-snug mb-4">
          {item.title}
        </h1>

        <div className="flex items-center gap-3 flex-wrap mb-4">
          {item.date && (
            <time className="text-sm text-muted-foreground">
              {new Date(item.date).toLocaleDateString("en-SG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-secondary text-muted-foreground px-2.5 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <ReadingPreferences />
      </header>

      {/* Embedded PDF for long-form articles */}
      {item.pdf && (
        <div className="mb-8 rounded-lg border border-border overflow-hidden" style={{ height: "75vh" }}>
          <iframe
            src={item.pdf}
            className="w-full h-full"
            title={`PDF: ${item.title}`}
          />
        </div>
      )}

      {/* Article body */}
      <div
        className="prose prose-neutral dark:prose-invert max-w-none
          prose-p:text-[1.0625rem] prose-p:leading-[1.85] prose-p:mb-5
          prose-headings:font-semibold prose-headings:tracking-tight prose-headings:mt-10 prose-headings:mb-4
          prose-h2:text-xl prose-h3:text-lg
          prose-a:text-warm-accent prose-a:underline-offset-2 prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-warm-accent prose-blockquote:border-l-2 prose-blockquote:text-muted-foreground prose-blockquote:pl-4
          prose-code:text-warm-accent prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal
          prose-pre:bg-secondary prose-pre:border prose-pre:border-border
          prose-img:rounded-lg prose-img:border prose-img:border-border
          prose-hr:border-border"
        dangerouslySetInnerHTML={{ __html: htmlBody }}
      />

      <div className="mt-10 pt-8 border-t border-border flex items-center gap-4">
        <LikeButton contentType={item.form} slug={item.slug} />
      </div>

      <AuthorBox />

      <div className="mt-10">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-80 shrink-0">
            <NewsletterSignup compact />
          </div>
          <div className="flex-1" />
        </div>
      </div>
    </Layout>
  );
}
