import { Link } from "react-router-dom";
import { ContentType } from "@/lib/content";

interface TagBadgeProps {
  tag: string;
  clickable?: boolean;
  isPrimary?: boolean;
  type?: ContentType;
}

const TagBadge = ({ tag, clickable = true, isPrimary = false, type = "article" }: TagBadgeProps) => {
  const baseClasses = `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
    isPrimary 
      ? "bg-primary/15 text-primary" 
      : "bg-tag-bg text-tag-text"
  }`;
  
  const getRoute = () => {
    switch (type) {
      case "article":
        return `/articles?tag=${encodeURIComponent(tag)}`;
      case "tip":
        return `/tips?tag=${encodeURIComponent(tag)}`;
      case "dashboard":
        return `/dashboards?tag=${encodeURIComponent(tag)}`;
    }
  };
  
  if (clickable) {
    return (
      <Link
        to={getRoute()}
        className={`${baseClasses} hover:bg-primary/20 hover:text-primary`}
      >
        {tag}
      </Link>
    );
  }
  
  return (
    <span className={baseClasses}>
      {tag}
    </span>
  );
};

export default TagBadge;