import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
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
            Welcome to TechieTips! This website is dedicated to sharing practical knowledge 
            about modern data analytics, with a focus on the Microsoft data platform.
          </p>
          
          <h2 className="text-2xl font-semibold text-anthracite mt-12 mb-6">
            What I Write About
          </h2>
          
          <ul className="space-y-4 text-muted-foreground mb-10">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2.5 flex-shrink-0" />
              <span><strong className="text-anthracite font-medium">Microsoft Fabric</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2.5 flex-shrink-0" />
              <span><strong className="text-anthracite font-medium">Power BI</strong> </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2.5 flex-shrink-0" />
              <span><strong className="text-anthracite font-medium">DAX</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2.5 flex-shrink-0" />
              <span><strong className="text-anthracite font-medium">Power Query (M)</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2.5 flex-shrink-0" />
              <span><strong className="text-anthracite font-medium">SQL</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2.5 flex-shrink-0" />
              <span><strong className="text-anthracite font-medium">Python</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2.5 flex-shrink-0" />
              <span><strong className="text-anthracite font-medium">PowerShell</strong></span>
            </li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-anthracite mt-12 mb-6">
            Philosophy
          </h2>
          
          <p className="text-muted-foreground leading-relaxed mb-8">
            I believe in knowledge sharing, and my goal with TechieTips is to provide ad free content for data professionals.
          </p>
        </div>

        <div className="mt-12">
          <ContactCTA />
        </div>
      </section>
    </Layout>
  );
};

export default About;
