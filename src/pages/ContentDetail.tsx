import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import TableOfContents from "@/components/TableOfContents";
import TagBadge from "@/components/TagBadge";
import Newsletter from "@/components/Newsletter";
import ContactCTA from "@/components/ContactCTA";
import ContentCard from "@/components/ContentCard";
import { getContentBySlug, getContentByType, ContentType } from "@/lib/content";

interface ContentDetailProps {
  type: ContentType;
}

const ContentDetail = ({ type }: ContentDetailProps) => {
  const { slug } = useParams<{ slug: string }>();
  const item = slug ? getContentBySlug(slug, type) : null;
  
  const getTypeRoute = () => {
    switch (type) {
      case "article":
        return "/articles";
      case "tip":
        return "/tips";
      case "dashboard":
        return "/dashboards";
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case "article":
        return "articles";
      case "tip":
        return "tips";
      case "dashboard":
        return "dashboards";
    }
  };
  
  if (!item) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Content not found</h1>
          <Link to={getTypeRoute()} className="text-primary hover:underline">
            ← Back to all {getTypeLabel()}
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

  // Get related content (same primary tag, excluding current)
  const relatedContent = getContentByType(type)
    .filter(c => c.slug !== item.slug && c.tags[0] === item.tags[0])
    .slice(0, 2);

  return (
    <Layout>
      <Helmet>
        <title>{item.title} - TechieTips</title>
        <meta name="description" content={item.summary} />
        <meta property="og:title" content={item.title} />
        <meta property="og:description" content={item.summary} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={item.date} />
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
        
        <header className="max-w-3xl mb-12 animate-fade-in">
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
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-14">
          <div className="max-w-3xl animate-fade-in-up">
            <MarkdownRenderer content={item.content} />
            <ContactCTA subject={`Re: ${item.title}`} />
          </div>
          
          {type !== "dashboard" && (
            <aside className="hidden lg:block">
              <TableOfContents content={item.content} />
            </aside>
          )}
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
        <Newsletter />
      </section>
    </Layout>
  );
};

export default ContentDetail;