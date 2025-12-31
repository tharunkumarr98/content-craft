import { useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import ContentCard from "@/components/ContentCard";
import ContactCTA from "@/components/ContactCTA";
import SearchInput from "@/components/SearchInput";
import { 
  getContentByType, 
  getPrimaryTags, 
  getContentByPrimaryTag,
  searchContent,
  ContentType 
} from "@/lib/content";

interface ContentPageProps {
  type: ContentType;
}

const ContentPage = ({ type }: ContentPageProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTag = searchParams.get("tag");
  const [searchQuery, setSearchQuery] = useState("");
  
  const primaryTags = getPrimaryTags(type);
  
  const content = useMemo(() => {
    // If searching, use search function
    if (searchQuery.trim()) {
      const searchResults = searchContent(type, searchQuery);
      // If also filtered by tag, filter the search results
      if (selectedTag) {
        return searchResults.filter((item) => item.tags[0] === selectedTag);
      }
      return searchResults;
    }
    
    // Otherwise, filter by tag or show all
    return selectedTag 
      ? getContentByPrimaryTag(type, selectedTag) 
      : getContentByType(type);
  }, [type, selectedTag, searchQuery]);

  const handleTagClick = (tag: string | null) => {
    if (tag) {
      setSearchParams({ tag });
    } else {
      setSearchParams({});
    }
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const getTypeLabel = () => {
    switch (type) {
      case "article":
        return "Articles";
      case "tip":
        return "Tips & Tricks";
      case "dashboard":
        return "Dashboards";
    }
  };

  const getTypeDescription = () => {
    switch (type) {
      case "article":
        return "In-depth technical articles on Microsoft Fabric, Power BI, SQL, DAX, and more.";
      case "tip":
        return "Quick wins, shortcuts, and patterns for everyday data work.";
      case "dashboard":
        return "Interactive dashboard showcases and portfolio pieces.";
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>{selectedTag ? `${selectedTag} - ` : ""}{getTypeLabel()} - TechieTips</title>
        <meta name="description" content={getTypeDescription()} />
      </Helmet>
      
      <section className="container py-12">
        <div className="mb-10 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
            {selectedTag ? `${getTypeLabel()}: ${selectedTag}` : getTypeLabel()}
          </h1>
          <p className="text-muted-foreground">
            {content.length} item{content.length !== 1 ? "s" : ""} 
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

        {/* Search Input */}
        <div className="mb-8">
          <SearchInput 
            onSearch={handleSearch}
            placeholder={`Search ${getTypeLabel().toLowerCase()}...`}
          />
        </div>
        
        {/* Primary tag filters */}
        {primaryTags.length > 0 && (
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
            {primaryTags.map((tag) => (
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
        )}
        
        <div className="grid gap-6">
          {content.map((item, index) => (
            <article 
              key={item.slug} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ContentCard item={item} />
            </article>
          ))}
        </div>
        
        {content.length === 0 && (
          <p className="text-muted-foreground text-center py-16">
            {searchQuery ? `No ${getTypeLabel().toLowerCase()} found matching "${searchQuery}".` : `No ${getTypeLabel().toLowerCase()} found.`}
          </p>
        )}
      </section>

      <section className="container pb-16">
        <ContactCTA />
      </section>
    </Layout>
  );
};

export default ContentPage;
