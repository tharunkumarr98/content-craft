import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import TableOfContents from "@/components/TableOfContents";
import TagBadge from "@/components/TagBadge";
import Newsletter from "@/components/Newsletter";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import BlogCard from "@/components/BlogCard";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : null;
  
  if (!post) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post not found</h1>
          <Link to="/blog" className="text-primary hover:underline">
            ← Back to all posts
          </Link>
        </div>
      </Layout>
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get related posts (same tags, excluding current)
  const relatedPosts = getAllPosts()
    .filter(p => p.slug !== post.slug && p.tags.some(tag => post.tags.includes(tag)))
    .slice(0, 2);

  return (
    <Layout>
      <Helmet>
        <title>{post.title} - TechieTips</title>
        <meta name="description" content={post.summary} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.summary} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Helmet>
      
      <article className="container py-12">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-10 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to all articles
        </Link>
        
        <header className="max-w-3xl mb-12 animate-fade-in">
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-5 text-muted-foreground">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {post.readingTime} min read
            </span>
          </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-14">
          <div className="max-w-3xl animate-fade-in-up">
            <MarkdownRenderer content={post.content} />
          </div>
          
          <aside className="hidden lg:block">
            <TableOfContents content={post.content} />
          </aside>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="container pb-16">
          <h2 className="text-xl font-semibold text-foreground mb-8 pt-10 border-t border-border">
            Related Articles
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedPosts.map(relatedPost => (
              <BlogCard key={relatedPost.slug} post={relatedPost} />
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

export default BlogPost;
