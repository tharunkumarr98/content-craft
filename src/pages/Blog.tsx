import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import BlogCard from "@/components/BlogCard";
import Newsletter from "@/components/Newsletter";
import { getAllPosts, getAllTags, getPostsByTag } from "@/data/posts";

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTag = searchParams.get("tag");
  
  const allTags = getAllTags();
  const posts = useMemo(() => {
    return selectedTag ? getPostsByTag(selectedTag) : getAllPosts();
  }, [selectedTag]);

  const handleTagClick = (tag: string | null) => {
    if (tag) {
      setSearchParams({ tag });
    } else {
      setSearchParams({});
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>{selectedTag ? `${selectedTag} Articles` : "All Articles"} - DataBytes</title>
        <meta name="description" content="Browse all technical articles on Microsoft Fabric, Power BI, SQL, DAX, Power Query, and Python." />
      </Helmet>
      
      <section className="container py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {selectedTag ? `Articles tagged "${selectedTag}"` : "All Articles"}
        </h1>
        <p className="text-muted-foreground mb-8">
          {posts.length} article{posts.length !== 1 ? "s" : ""} 
          {selectedTag && (
            <button 
              onClick={() => handleTagClick(null)}
              className="ml-2 text-primary hover:underline"
            >
              Clear filter
            </button>
          )}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => handleTagClick(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !selectedTag 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedTag === tag 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        
        <div className="grid gap-10">
          {posts.map((post) => (
            <article key={post.slug} className="border-b border-border pb-10 last:border-0">
              <BlogCard post={post} />
            </article>
          ))}
        </div>
        
        {posts.length === 0 && (
          <p className="text-muted-foreground text-center py-12">
            No articles found for this tag.
          </p>
        )}
      </section>

      <section className="container pb-16">
        <Newsletter />
      </section>
    </Layout>
  );
};

export default Blog;
