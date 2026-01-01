import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import ContactCTA from "@/components/ContactCTA";
import aboutPhoto from "@/assets/about-photo.jpg";

const About = () => {
  return (
    <Layout>
      <Helmet>
        <title>About - TechieTips</title>
        <meta name="description" content="Learn more about TechieTips, a technical blog focused on Microsoft Fabric, Power BI, and data analytics." />
      </Helmet>
      
      <section className="container py-12 max-w-5xl animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-anthracite mb-10 tracking-tight">
          About
        </h1>
        
        <div className="flex flex-col md:flex-row gap-10 md:gap-12">
          {/* Left Column - Photo & Credentials */}
          <div className="md:w-1/3 flex-shrink-0">
            <img 
              src={aboutPhoto} 
              alt="Tharun Kumar" 
              className="w-full max-w-[280px] rounded-lg shadow-md mb-6"
            />
            
            {/* Credentials Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-anthracite">Credentials</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-anthracite">Profession</p>
                  <p className="text-muted-foreground">Data Analytics Professional</p>
                </div>
                
                <div>
                  <p className="font-medium text-anthracite">Certifications</p>
                  <ul className="text-muted-foreground space-y-1 mt-1">
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-teal mt-2 flex-shrink-0" />
                      <span>Microsoft Certified: Power BI Data Analyst</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-teal mt-2 flex-shrink-0" />
                      <span>Microsoft Certified: Fabric Analytics Engineer</span>
                    </li>
                    {/* Add more certifications here */}
                  </ul>
                </div>
                
                <div>
                  <p className="font-medium text-anthracite">Recognitions</p>
                  <ul className="text-muted-foreground space-y-1 mt-1">
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-teal mt-2 flex-shrink-0" />
                      <span>Microsoft MVP</span>
                    </li>
                    {/* Add more recognitions here */}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Content */}
          <div className="md:w-2/3 prose-blog">
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Welcome to TechieTips! This website is dedicated to sharing practical knowledge 
              about modern data analytics, with a focus on the Microsoft data platform.
            </p>
            
            <h2 className="text-2xl font-semibold text-anthracite mt-8 mb-6">
              What I Write About
            </h2>
            
            <ul className="space-y-4 text-muted-foreground mb-10">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2.5 flex-shrink-0" />
                <span><strong className="text-anthracite font-medium">Microsoft Fabric</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2.5 flex-shrink-0" />
                <span><strong className="text-anthracite font-medium">Power BI</strong></span>
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
            
            <p className="text-muted-foreground leading-relaxed">
              I believe in knowledge sharing, and my goal with TechieTips is to provide ad free content for data professionals.
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
