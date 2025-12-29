import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import Newsletter from "@/components/Newsletter";
import ContactCTA from "@/components/ContactCTA";

const About = () => {
  return (
    <Layout>
      <Helmet>
        <title>About - TechieTips</title>
        <meta name="description" content="Learn more about TechieTips, a technical blog focused on Microsoft Fabric, Power BI, and data analytics." />
      </Helmet>
      
      <section className="container py-12 max-w-3xl animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-anthracite mb-10 tracking-tight">
          About
        </h1>
        
        <div className="prose-blog">
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Welcome to TechieTips! This blog is dedicated to sharing practical knowledge 
            about modern data analytics, with a focus on the Microsoft data platform.
          </p>
          
          <h2 className="text-2xl font-semibold text-anthracite mt-12 mb-6">
            What I Write About
          </h2>
          
          <ul className="space-y-4 text-muted-foreground mb-10">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2.5 flex-shrink-0" />
              <span><strong className="text-anthracite font-medium">Microsoft Fabric</strong> — Lakehouse architecture, data engineering, and analytics</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2.5 flex-shrink-0" />
              <span><strong className="text-anthracite font-medium">Power BI</strong> — Data modeling, visualization best practices, and performance optimization</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2.5 flex-shrink-0" />
              <span><strong className="text-anthracite font-medium">DAX</strong> — From fundamentals to advanced patterns and time intelligence</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2.5 flex-shrink-0" />
              <span><strong className="text-anthracite font-medium">Power Query (M)</strong> — Data transformation techniques and performance tips</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2.5 flex-shrink-0" />
              <span><strong className="text-anthracite font-medium">SQL</strong> — Query optimization, window functions, and analytics patterns</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2.5 flex-shrink-0" />
              <span><strong className="text-anthracite font-medium">Python</strong> — Data analysis with pandas, PySpark, and automation scripts</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2.5 flex-shrink-0" />
              <span><strong className="text-anthracite font-medium">PowerShell & KQL</strong> — Automation scripts and Kusto queries</span>
            </li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-anthracite mt-12 mb-6">
            Philosophy
          </h2>
          
          <p className="text-muted-foreground leading-relaxed mb-8">
            I believe in writing content that's practical and immediately applicable. 
            Every article includes working code examples that you can adapt for your own projects. 
            No fluff, no marketing speak—just technical content for data professionals.
          </p>
        </div>

        <div className="mt-12">
          <ContactCTA />
        </div>
      </section>

      <section className="container pb-16 max-w-3xl">
        <Newsletter />
      </section>
    </Layout>
  );
};

export default About;
