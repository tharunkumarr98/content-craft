import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import BlogCard from "@/components/BlogCard";
import Newsletter from "@/components/Newsletter";
import { getAllPosts } from "@/lib/blog";

const Index = () => {
  const recentPosts = getAllPosts().slice(0, 4);

  return (
    <Layout>
      <Helmet>
        <title>TechieTips - Technical Blog on Data Analytics & Microsoft Fabric</title>
        <meta name="description" content="Technical insights on Microsoft Fabric, Power BI, SQL, DAX, Power Query, and Python. Deep dives into data analytics, tutorials, and best practices." />
        <meta property="og:title" content="TechieTips - Technical Blog on Data Analytics" />
        <meta property="og:description" content="Technical insights on Microsoft Fabric, Power BI, and data analytics." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <section className="container py-16 md:py-24">
        <div className="max-w-2xl animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Data Analytics & Microsoft Fabric
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-[1.1] tracking-tight">
            Technical insights for{" "}
            <span className="gradient-text">data professionals</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Deep dives into Microsoft Fabric, Power BI, SQL, DAX, Power Query, and Python. 
            Practical tutorials and patterns for building modern data solutions.
          </p>
        </div>
      </section>

      <section className="container pb-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">
            Recent Articles
          </h2>
          <Link 
            to="/blog" 
            className="flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all duration-200"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid gap-6">
          {recentPosts.map((post, index) => (
            <article 
              key={post.slug} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <BlogCard post={post} />
            </article>
          ))}
        </div>
      </section>

      <section className="container pb-20">
        <Newsletter />
      </section>
    </Layout>
  );
};

export default Index;
