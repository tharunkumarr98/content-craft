import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Calendar, Clock, ArrowLeft, Linkedin, Twitter, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import Layout from "@/components/Layout";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import TableOfContents from "@/components/TableOfContents";
import TagBadge from "@/components/TagBadge";
import ContactCTA from "@/components/ContactCTA";
import Comments from "@/components/Comments";
import ContentCard from "@/components/ContentCard";
import ReadingProgress from "@/components/ReadingProgress";
import { getContentBySlug, getContentByType, getArticles, ContentType } from "@/lib/content";

interface ContentDetailProps {
  type: ContentType;
}

const ContentDetail = ({ type }: ContentDetailProps) => {
  const { slug } = useParams<{ slug: string }>();
  const item = slug ? getContentBySlug(slug, type) : null;

  const getTypeRoute = () => {
    switch (type) {
      case "article":   return "/articles";
      case "tip":       return "/tips";
      case "dashboard": return "/dashboards";
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case "article":   return "articles";
      case "tip":       return "tips";
      case "dashboard": return "dashboards";
    }
  };

  if (!item) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Content not found</h1>
          <Link to={getTypeRoute()} className="text-primary hover:underline">
            Back to all {getTypeLabel()}
          </Link>
        </div>
      </Layout>
    );
  }

  const formattedDate = new Date(item.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Related content (same primary tag, excluding current)
  const relatedContent = getContentByType(type)
    .filter(c => c.slug !== item.slug && c.tags[0] === item.tags[0])
    .slice(0, 2);

  // Series navigation (articles only)
  const seriesItems = item.series
    ? getArticles()
        .filter(a => a.series === item.series)
        .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0))
    : [];
  const seriesIndex  = seriesItems.findIndex(a => a.slug === item.slug);
  const prevInSeries = seriesIndex > 0 ? seriesItems[seriesIndex - 1] : null;
  const nextInSeries = seriesIndex < seriesItems.length - 1 ? seriesItems[seriesIndex + 1] : null;

  // Social share URLs
  const pageUrl    = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = encodeURIComponent(item.title);
  const shareUrl   = encodeURIComponent(pageUrl);
  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
  const twitterShare  = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}&via=tharunkumarr98`;

  return (
    <Layout>
      <ReadingProgress />

      <Helmet>
        <title>{item.title} - TechieTips</title>
        <meta name="description" content={item.summary} />
        <meta property="og:title" content={item.title} />
        <meta property="og:description" content={item.summary} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={item.date} />
        {item.image && <meta property="og:image" content={item.image} />}
        {item.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Helmet>

      <article className="container py-12">
        <Link
          to={getTypeRoute()}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-10 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to all {getTypeLabel()}
        </Link>

        <header className="max-w-3xl mb-10 animate-fade-in">
          {/* Series badge */}
          {item.series && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                <BookOpen className="h-3 w-3" />
                {item.series}
                {item.seriesOrder != null && seriesItems.length > 1 && (
                  <span className="text-primary/70">· Part {item.seriesOrder} of {seriesItems.length}</span>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-5">
            {item.tags.map((tag, index) => (
              <TagBadge key={tag} tag={tag} isPrimary={index === 0} type={type} />
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            {item.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 text-muted-foreground">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {item.readingTime} min read
            </span>
          </div>
        </header>

        {/* Hero image */}
        {item.image && type !== "dashboard" && (
          <div className="max-w-3xl mb-10 rounded-2xl overflow-hidden shadow-md animate-fade-in">
            <img
              src={item.image}
              alt={item.title}
              className="w-full max-h-96 object-cover"
            />
          </div>
        )}

        {/* Dashboard embed */}
        {type === "dashboard" && item.embedUrl && (
          <div className="mb-12 rounded-xl overflow-hidden border border-border shadow-lg">
            <iframe
              src={item.embedUrl}
              className="w-full h-[500px] md:h-[600px]"
              frameBorder="0"
              allowFullScreen
              title={item.title}
            />
          </div>
        )}

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-14">
          <div className="max-w-3xl animate-fade-in-up">
            <MarkdownRenderer content={item.content} />

            {/* Share buttons */}
            <div className="mt-12 pt-8 border-t border-border/60">
              <p className="text-sm font-semibold text-foreground mb-3">Share this article</p>
              <div className="flex gap-3">
                <a
                  href={linkedinShare}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A66C2] text-white text-sm font-medium hover:bg-[#0958a8] transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                  Share on LinkedIn
                </a>
                <a
                  href={twitterShare}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1DA1F2] text-white text-sm font-medium hover:bg-[#1a8fd1] transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                  Share on X
                </a>
              </div>
            </div>

            {/* Series navigation */}
            {seriesItems.length > 1 && (
              <div className="mt-10 p-5 rounded-xl border border-border/60 bg-card">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  {item.series} — all parts
                </p>
                <ol className="space-y-2 mb-5">
                  {seriesItems.map((s, i) => (
                    <li key={s.slug} className="flex items-center gap-3">
                      <span className={`text-xs font-mono w-5 text-center flex-shrink-0 ${s.slug === item.slug ? "text-primary font-bold" : "text-muted-foreground"}`}>
                        {i + 1}
                      </span>
                      {s.slug === item.slug ? (
                        <span className="text-sm font-semibold text-primary">{s.title}</span>
                      ) : (
                        <Link to={`/articles/${s.slug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                          {s.title}
                        </Link>
                      )}
                    </li>
                  ))}
                </ol>
                <div className="flex gap-3">
                  {prevInSeries && (
                    <Link
                      to={`/articles/${prevInSeries.slug}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </Link>
                  )}
                  {nextInSeries && (
                    <Link
                      to={`/articles/${nextInSeries.slug}`}
                      className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors ml-auto"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {type !== "dashboard" && (
            <aside className="hidden lg:block">
              <TableOfContents content={item.content} />
            </aside>
          )}
        </div>

        {/* Comments */}
        <div className="max-w-3xl">
          <Comments contentSlug={item.slug} contentType={type} contentTitle={item.title} />
        </div>
      </article>

      {relatedContent.length > 0 && (
        <section className="container pb-16">
          <h2 className="text-xl font-semibold text-foreground mb-8 pt-10 border-t border-border">
            Related {getTypeLabel()}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedContent.map(related => (
              <ContentCard key={related.slug} item={related} />
            ))}
          </div>
        </section>
      )}

      <section className="container pb-16">
        <ContactCTA subject={`Re: ${item.title}`} />
      </section>
    </Layout>
  );
};

export default ContentDetail;
