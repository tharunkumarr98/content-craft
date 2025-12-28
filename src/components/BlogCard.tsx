import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import type { BlogPost } from "@/data/posts";
import TagBadge from "./TagBadge";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="group">
      <Link to={`/blog/${post.slug}`} className="block">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
          {post.title}
        </h2>
      </Link>
      
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          {formattedDate}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {post.readingTime} min read
        </span>
      </div>
      
      <p className="text-muted-foreground mb-4 leading-relaxed">
        {post.summary}
      </p>
      
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
    </article>
  );
};

export default BlogCard;
