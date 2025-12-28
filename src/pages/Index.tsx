import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import BlogCard from "@/components/BlogCard";
import Newsletter from "@/components/Newsletter";
import { getAllPosts } from "@/data/posts";

const Index = () => {
  const recentPosts = getAllPosts().slice(0, 4);

  return (
    <Layout>
      <Helmet>
        <title>DataBytes - Technical Blog on Data Analytics & Microsoft Fabric</title>
        <meta name="description" content="Technical insights on Microsoft Fabric, Power BI, SQL, DAX, Power Query, and Python. Deep dives into data analytics, tutorials, and best practices." />
      </Helmet>
      
      <section className="container py-12 md:py-20">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Technical insights on data analytics<span className="text-primary">.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Deep dives into Microsoft Fabric, Power BI, SQL, DAX, Power Query, and Python. 
            Practical tutorials and patterns for building modern data solutions.
          </p>
        </div>
      </section>

      <section className="container pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">
            Recent Posts
          </h2>
          <Link 
            to="/blog" 
            className="flex items-center gap-1 text-sm text-primary hover:underline underline-offset-2"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid gap-10">
          {recentPosts.map((post) => (
            <article key={post.slug} className="border-b border-border pb-10 last:border-0">
              <BlogCard post={post} />
            </article>
          ))}
        </div>
      </section>

      <section className="container pb-16">
        <Newsletter />
      </section>
    </Layout>
  );
};

export default Index;
