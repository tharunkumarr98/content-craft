import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, ExternalLink } from "lucide-react";
import type { ContentItem } from "@/lib/content";
import TagBadge from "./TagBadge";

interface ContentCardProps {
  item: ContentItem;
}

const ContentCard = ({ item }: ContentCardProps) => {
  const formattedDate = new Date(item.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const getRoute = () => {
    switch (item.type) {
      case "article":
        return `/articles/${item.slug}`;
      case "tip":
        return `/tips/${item.slug}`;
      case "dashboard":
        return `/dashboards/${item.slug}`;
    }
  };

  const isDashboard = item.type === "dashboard";

  return (
    <article className="group p-6 rounded-xl bg-card border border-border/50 shadow-card card-hover">
      <Link to={getRoute()} className="block">
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
      </Link>
    </article>
  );
};

export default ContentCard;