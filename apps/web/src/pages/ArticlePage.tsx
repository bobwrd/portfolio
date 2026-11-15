import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { marked } from "marked";
import { usePageTitle } from "@/hooks/use-page-title";
import Layout from "@/components/Layout";
import LikeButton from "@/components/LikeButton";
import AuthorBox from "@/components/AuthorBox";
import NewsletterSignup from "@/components/NewsletterSignup";
import PaperHeader from "@/components/PaperHeader";
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
  usePageTitle(item?.title ?? null);
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
          <p className="text-muted-foreground mb-4">This piece doesn't exist, or it has moved.</p>
          <Link to="/writing" className="text-sm underline decoration-warm-accent underline-offset-4">
            Browse all writing
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
      case "personal": return "Essays";
      default: return "Analysis";
    }
  })();
  const categoryLabel = backLabel;
  const backText = (() => {
    switch (item.category) {
      case "short": return "All short-form pieces";
      case "weekly": return "All weekly briefings";
      case "personal": return "All essays";
      default: return "All analysis";
    }
  })();

  return (
    <Layout>
      <ReadingProgressBar />

      <div className="mb-6">
        <Link
          to={backHref}
          className="text-sm text-muted-foreground hover:text-warm-accent transition-colors duration-150"
        >
          {backText}
        </Link>
      </div>

      {/* Article header: the series band, then the paper's title block. */}
      <div className="mb-10">
        <PaperHeader
          series={`Margin of Error, ${categoryLabel}`}
          meta={
            item.date
              ? new Date(item.date).toLocaleDateString("en-SG", { year: "numeric", month: "long", day: "numeric" })
              : undefined
          }
          title={item.title}
          byline={`Arin Jain. ${readTime(item.wordCount)}.`}
          keywords={item.tags.length > 0 ? `Tags: ${item.tags.join(", ")}` : undefined}
        />
        <div className="mt-6 border-b border-border pb-6">
          <ReadingPreferences />
        </div>
      </div>

      {/* Embedded PDF for long-form articles */}
      {item.pdf && (
        <div className="mb-8 border border-border overflow-hidden" style={{ height: "75vh" }}>
          <iframe
            src={item.pdf}
            className="w-full h-full"
            title={`PDF: ${item.title}`}
          />
        </div>
      )}

      {/* Article body */}
      <div
        className="prose prose-neutral dark:prose-invert max-w-[42rem]
          prose-p:text-[1.0625rem] prose-p:leading-[1.8] prose-p:mb-5
          prose-headings:font-serif prose-headings:font-normal prose-headings:mt-12 prose-headings:mb-4
          prose-h2:text-[1.625rem] prose-h3:text-xl
          prose-a:text-link prose-a:underline prose-a:underline-offset-2
          prose-blockquote:border-l prose-blockquote:border-l-foreground prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:text-muted-foreground prose-blockquote:pl-5
          prose-code:font-mono prose-code:bg-secondary prose-code:px-1 prose-code:py-0.5 prose-code:text-[0.9em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-secondary prose-pre:text-foreground prose-pre:border prose-pre:border-border prose-pre:rounded-none
          prose-img:border prose-img:border-border
          prose-table:font-sans prose-table:text-[0.9375rem]
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
