import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import Newsletter from "@/components/Newsletter";

const About = () => {
  return (
    <Layout>
      <Helmet>
        <title>About - DataBytes</title>
        <meta name="description" content="Learn more about DataBytes, a technical blog focused on Microsoft Fabric, Power BI, and data analytics." />
      </Helmet>
      
      <section className="container py-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
          About
        </h1>
        
        <div className="prose-blog">
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Welcome to DataBytes! This blog is dedicated to sharing practical knowledge 
            about modern data analytics, with a focus on the Microsoft data platform.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">
            What I Write About
          </h2>
          
          <ul className="space-y-3 text-muted-foreground mb-8">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">Microsoft Fabric</strong> — Lakehouse architecture, data engineering, and analytics</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">Power BI</strong> — Data modeling, visualization best practices, and performance optimization</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">DAX</strong> — From fundamentals to advanced patterns and time intelligence</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">Power Query (M)</strong> — Data transformation techniques and performance tips</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">SQL</strong> — Query optimization, window functions, and analytics patterns</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span><strong className="text-foreground">Python</strong> — Data analysis with pandas, PySpark, and automation scripts</span>
            </li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">
            Philosophy
          </h2>
          
          <p className="text-muted-foreground leading-relaxed mb-6">
            I believe in writing content that's practical and immediately applicable. 
            Every article includes working code examples that you can adapt for your own projects. 
            No fluff, no marketing speak—just technical content for data professionals.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">
            Get in Touch
          </h2>
          
          <p className="text-muted-foreground leading-relaxed">
            Have questions or suggestions for topics? Feel free to reach out on{" "}
            <a href="https://linkedin.com" className="text-primary hover:underline">LinkedIn</a> or{" "}
            <a href="https://twitter.com" className="text-primary hover:underline">Twitter</a>.
          </p>
        </div>
      </section>

      <section className="container pb-16 max-w-3xl">
        <Newsletter />
      </section>
    </Layout>
  );
};

export default About;
