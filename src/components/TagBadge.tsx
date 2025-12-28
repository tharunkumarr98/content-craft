import { Link } from "react-router-dom";

interface TagBadgeProps {
  tag: string;
  clickable?: boolean;
}

const TagBadge = ({ tag, clickable = true }: TagBadgeProps) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-tag-bg text-tag-text transition-colors";
  
  if (clickable) {
    return (
      <Link
        to={`/blog?tag=${encodeURIComponent(tag)}`}
        className={`${baseClasses} hover:bg-primary/20`}
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
