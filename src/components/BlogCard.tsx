import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/blog";
import TagBadge from "./TagBadge";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="group p-6 rounded-xl bg-card border border-border/50 shadow-card card-hover">
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <TagBadge key={tag} tag={tag} clickable={false} />
          ))}
        </div>
        
        <h2 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors mb-3 leading-snug">
          {post.title}
        </h2>
        
        <p className="text-muted-foreground mb-5 leading-relaxed line-clamp-2">
          {post.summary}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readingTime} min
            </span>
          </div>
          
          <span className="text-primary text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            Read more <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;
