import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import ContentToggle from "@/components/ContentToggle";
import TechCloud from "@/components/TechCloud";
import ContactCTA from "@/components/ContactCTA";
import ContentCard from "@/components/ContentCard";
import { getArticles, getTips, getDashboards, ContentType } from "@/lib/content";

// Mapping from icon names to content tags they should match
const tagMapping: Record<string, string[]> = {
  "Power BI": ["Power BI"],
  "Fabric": ["Fabric", "Microsoft Fabric"],
  "Power Apps": ["Power Apps", "PowerApps"],
  "Power Automate": ["Power Automate", "PowerAutomate"],
  "Synapse": ["Synapse"],
};

const Index = () => {
  const [activeType, setActiveType] = useState<ContentType>("article");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  
  const getContent = () => {
    let items;
    switch (activeType) {
      case "article":
        items = getArticles();
        break;
      case "tip":
        items = getTips();
        break;
      case "dashboard":
        items = getDashboards();
        break;
    }
    
    // Filter by selected tech if one is active
    if (selectedTech) {
      const matchingTags = tagMapping[selectedTech] || [selectedTech];
      items = items.filter(item => {
        const primaryTag = item.tags?.[0];
        return primaryTag && matchingTags.some(tag => 
          tag.toLowerCase() === primaryTag.toLowerCase()
        );
      });
    }
    
    return items.slice(0, 4);
  };

  const getTypeLabel = () => {
    switch (activeType) {
      case "article":
        return "Articles";
      case "tip":
        return "Tips & Tricks";
      case "dashboard":
        return "Dashboards";
    }
  };

  const getTypeRoute = () => {
    switch (activeType) {
      case "article":
        return "/articles";
      case "tip":
        return "/tips";
      case "dashboard":
        return "/dashboards";
    }
  };

  const content = getContent();
  const hasNoContent = content.length === 0 && selectedTech !== null;

  return (
    <Layout>
      <Helmet>
        <title>TechieTips</title>
        <meta name="description" content="Technical insights on Microsoft Fabric, Power BI, SQL, DAX, Power Query, and Python. Articles, tips, and dashboard showcases for data professionals." />
        <meta property="og:title" content="TechieTips - Technical Insights on Data Analytics" />
        <meta property="og:description" content="Technical insights on Microsoft Fabric, Power BI, and data analytics." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] via-primary/[0.03] to-transparent" />
        <div className="container py-16 md:py-20 relative">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-[1.1] tracking-tight">
             Knowledge Hub for{" "}
              <span className="gradient-text">Modern Data Analytics</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Hands-on knowledge for the Microsoft data ecosystem
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
          <ContentToggle activeType={activeType} onTypeChange={setActiveType} />
          <Link 
            to={getTypeRoute()} 
            className="flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all duration-200"
          >
            View all {getTypeLabel().toLowerCase()} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        {/* TechCloud placed below the content navigation */}
        <div className="mb-10">
          <TechCloud 
            onTechClick={setSelectedTech} 
            activeTech={selectedTech} 
          />
        </div>
        
        {hasNoContent ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {selectedTech} content is brewing! ☕
            </h3>
            <p className="text-muted-foreground max-w-md">
              I'm crafting some awesome {selectedTech} {getTypeLabel().toLowerCase()} for you. 
              Check back soon or explore other topics!
            </p>
            <button
              onClick={() => setSelectedTech(null)}
              className="mt-6 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              ← View all content
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {content.map((item, index) => (
              <article 
                key={item.slug} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ContentCard item={item} />
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="container pb-20">
        <ContactCTA />
      </section>
    </Layout>
  );
};

export default Index;
