import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, ExternalLink } from "lucide-react";
import type { ContentItem } from "@/lib/content";
import TagBadge from "./TagBadge";

interface ContentCardProps {
  item: ContentItem;
}

const typeAccent: Record<string, string> = {
  article:   "border-l-primary",
  tip:       "border-l-amber-400 dark:border-l-amber-500",
  dashboard: "border-l-violet-400 dark:border-l-violet-500",
};

const ContentCard = ({ item }: ContentCardProps) => {
  const formattedDate = new Date(item.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const getRoute = () => {
    switch (item.type) {
      case "article":   return `/articles/${item.slug}`;
      case "tip":       return `/tips/${item.slug}`;
      case "dashboard": return `/dashboards/${item.slug}`;
    }
  };

  const isDashboard = item.type === "dashboard";
  const accent = typeAccent[item.type] ?? "border-l-primary";

  return (
    <article className={`group overflow-hidden rounded-xl bg-card border border-border/50 border-l-4 ${accent} shadow-card card-hover`}>
      <Link to={getRoute()} className="flex">
        {/* Text content */}
        <div className="flex-1 min-w-0 p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.map((tag, index) => (
              <TagBadge key={tag} tag={tag} clickable={false} isPrimary={index === 0} />
            ))}
          </div>

          <h2 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors mb-3 leading-snug">
            {item.title}
          </h2>

          <p className="text-muted-foreground mb-5 leading-relaxed line-clamp-2">
            {item.summary}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </span>
              {!isDashboard && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {item.readingTime} min
                </span>
              )}
            </div>

            <span className="text-primary text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {isDashboard ? (
                <>View dashboard <ExternalLink className="h-4 w-4" /></>
              ) : (
                <>Read more <ArrowRight className="h-4 w-4" /></>
              )}
            </span>
          </div>
        </div>

        {/* Cover image — only rendered when frontmatter sets `image:` */}
        {item.image && (
          <div className="hidden sm:flex items-center justify-center flex-shrink-0 pr-5 py-5">
            <div className="w-36 md:w-44 aspect-video overflow-hidden rounded-xl border border-border/40 bg-muted flex-shrink-0">
              <img
                src={item.image}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        )}
      </Link>
    </article>
  );
};

export default ContentCard;
