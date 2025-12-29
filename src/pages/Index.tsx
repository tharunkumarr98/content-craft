import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import ContentToggle from "@/components/ContentToggle";
import TechCloud from "@/components/TechCloud";
import Newsletter from "@/components/Newsletter";
import ContentCard from "@/components/ContentCard";
import { getArticles, getTips, getDashboards, ContentType } from "@/lib/content";

const Index = () => {
  const [activeType, setActiveType] = useState<ContentType>("article");
  
  const getContent = () => {
    switch (activeType) {
      case "article":
        return getArticles().slice(0, 4);
      case "tip":
        return getTips().slice(0, 4);
      case "dashboard":
        return getDashboards().slice(0, 4);
    }
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

  return (
    <Layout>
      <Helmet>
        <title>TechieTips - Technical Insights on Data Analytics & Microsoft Fabric</title>
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
              Technical insights for{" "}
              <span className="gradient-text">data professionals</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Deep dives into Microsoft Fabric, Power BI, SQL, DAX, Power Query, and Python. 
              Practical tutorials and patterns for building modern data solutions.
            </p>
          </div>
          
          {/* Tech Cloud */}
          <TechCloud />
        </div>
      </section>

      {/* Content Section */}
      <section className="container pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <ContentToggle activeType={activeType} onTypeChange={setActiveType} />
          <Link 
            to={getTypeRoute()} 
            className="flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all duration-200"
          >
            View all {getTypeLabel().toLowerCase()} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
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
        
        {content.length === 0 && (
          <p className="text-muted-foreground text-center py-16">
            No {getTypeLabel().toLowerCase()} yet. Check back soon!
          </p>
        )}
      </section>

      <section className="container pb-20">
        <Newsletter />
      </section>
    </Layout>
  );
};

export default Index;