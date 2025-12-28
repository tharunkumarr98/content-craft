import { Link } from "react-router-dom";

interface TagBadgeProps {
  tag: string;
  clickable?: boolean;
}

const TagBadge = ({ tag, clickable = true }: TagBadgeProps) => {
  const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-tag-bg text-tag-text transition-all duration-200";
  
  if (clickable) {
    return (
      <Link
        to={`/blog?tag=${encodeURIComponent(tag)}`}
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
