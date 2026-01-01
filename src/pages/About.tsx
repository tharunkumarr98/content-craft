import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import ContactCTA from "@/components/ContactCTA";
import Connect from "@/components/Connect";
import aboutPhoto from "@/assets/about-photo.jpg";

const About = () => {
  return (
    <Layout>
      <Helmet>
        <title>About - TechieTips</title>
        <meta name="description" content="Learn more about TechieTips, a technical blog focused on Microsoft Fabric, Power BI, and data analytics." />
      </Helmet>
      
      <section className="container py-12 max-w-5xl animate-fade-in">
       
        
        <div className="flex flex-col md:flex-row gap-10 md:gap-12">
          {/* Left Column - Photo & Credentials */}
          <div className="md:w-1/3 flex-shrink-0">
            <img 
              src={aboutPhoto} 
              alt="Tharun Kumar Ravikrindhi" 
              className="w-full max-w-[280px] rounded-lg shadow-md mb-5"
            />
            
            {/* Profile Info */}
            <div className="max-w-[350px]">
              <h2 className="text-xl font-semibold text-anthracite mb-1">
                Tharun Kumar Ravikrindhi
              </h2>
              <p className="text-sm font-small text-teal mb-3">
                 💼 Senior Data Engineer at Tiger Analytics
              </p>
               <p className="text-sm font-medium text-teal mb-3">
                👮‍♂️ Super User in Fabric Community
              </p>
               <p className="text-sm font-medium text-teal mb-3">
                🏅 8X Microsoft Certified
              </p>
            </div>
            
            {/* Reuse Connect block from footer */}
            <div className="mt-6 max-w-[350px]">
              <Connect />
            </div>
          </div>
          
          {/* Right Column - Content */}
          <div className="md:w-2/3 prose-blog">
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Welcome to TechieTips! I share practical insights from building data analytics solutions using the Microsoft data ecosystem.
            </p>
            
            <h2 className="text-2xl font-semibold text-anthracite mt-8 mb-6">
              I Write About
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Real-world experiences, observations, and best practices from working in data analytics and data engineering, with a focus on:
            </p>
            <ul className="space-y-4 text-muted-foreground mb-10">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2.5 flex-shrink-0" />
                <span><strong className="text-anthracite font-medium">Microsoft Fabric</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2.5 flex-shrink-0" />
                <span><strong className="text-anthracite font-medium">Microsoft Power BI</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2.5 flex-shrink-0" />
                <span><strong className="text-anthracite font-medium">Microsoft Power Automate</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2.5 flex-shrink-0" />
                <span><strong className="text-anthracite font-medium">Microsoft Power Apps</strong></span>
              </li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-anthracite mt-12 mb-6">
              Philosophy
            </h2>
            
            <p className="text-muted-foreground leading-relaxed">
              I believe in learning through sharing. This space is about exchanging knowledge, growing together, and continuously improving, one insight at a time.
            </p>
          </div>
        </div>
      </section>
      
      <section className="container pb-16 max-w-5xl">
        <ContactCTA />
      </section>
    </Layout>
  );
};

export default About;
