import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import BlogCard from "@/components/BlogCard";
import Newsletter from "@/components/Newsletter";
import { getAllPosts, getAllTags, getPostsByTag } from "@/lib/blog";

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
        <title>{selectedTag ? `${selectedTag} Articles` : "All Articles"} - TechieTips</title>
        <meta name="description" content="Browse all technical articles on Microsoft Fabric, Power BI, SQL, DAX, Power Query, and Python." />
      </Helmet>
      
      <section className="container py-12">
        <div className="mb-10 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
            {selectedTag ? `Articles tagged "${selectedTag}"` : "All Articles"}
          </h1>
          <p className="text-muted-foreground">
            {posts.length} article{posts.length !== 1 ? "s" : ""} 
            {selectedTag && (
              <button 
                onClick={() => handleTagClick(null)}
                className="ml-2 text-primary hover:underline font-medium"
              >
                Clear filter
              </button>
            )}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-12">
          <button
            onClick={() => handleTagClick(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              !selectedTag 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedTag === tag 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        
        <div className="grid gap-6">
          {posts.map((post, index) => (
            <article 
              key={post.slug} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <BlogCard post={post} />
            </article>
          ))}
        </div>
        
        {posts.length === 0 && (
          <p className="text-muted-foreground text-center py-16">
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
