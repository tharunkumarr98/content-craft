import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Trophy, BadgeCheck, Users, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import ContactCTA from "@/components/ContactCTA";
import Connect from "@/components/Connect";
import aboutPhoto from "@/assets/about-photo.jpg";

const About = () => {
  return (
    <Layout>
      <Helmet>
        <title>About - TechieTips</title>
        <meta
          name="description"
          content="About Tharun Kumar Ravikrindhi — Senior Data Engineer, 8× Microsoft Certified, and Microsoft Fabric Community Super User. Sharing practical data analytics insights."
        />
      </Helmet>

      <section className="container py-12 max-w-5xl animate-fade-in">
        <div className="flex flex-col md:flex-row gap-10 md:gap-14">

          {/* Left Column — Photo & Identity */}
          <div className="md:w-1/3 flex-shrink-0">
            <div className="relative inline-block mb-5">
              <img
                src={aboutPhoto}
                alt="Tharun Kumar Ravikrindhi"
                className="w-full max-w-[260px] rounded-2xl shadow-lg"
              />
              {/* Teal accent border decoration */}
              <div className="absolute -bottom-2 -right-2 w-full max-w-[260px] h-full rounded-2xl border-2 border-primary/30 -z-10" />
            </div>

            {/* Identity badges */}
            <div className="max-w-[300px] space-y-2.5 mb-6">
              <h2 className="text-xl font-bold text-foreground mb-3">
                Tharun Kumar Ravikrindhi
              </h2>

              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <span className="text-base">💼</span>
                <span>Senior Data Engineer at <strong className="text-foreground font-medium">Tiger Analytics</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <span className="text-base">👮‍♂️</span>
                <span>Super User in <strong className="text-foreground font-medium">Fabric Community</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <span className="text-base">🏅</span>
                <span><strong className="text-foreground font-medium">8× Microsoft Certified</strong></span>
              </div>
            </div>

            <div className="max-w-[300px]">
              <Connect />
            </div>
          </div>

          {/* Right Column — Content */}
          <div className="md:w-2/3 prose-blog">
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Welcome to TechieTips! I share practical insights from building data analytics solutions using the Microsoft data ecosystem.
            </p>

            <h2 className="text-2xl font-semibold text-anthracite mt-8 mb-4">
              I Write About
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Real-world experiences, observations, and best practices from working in data analytics and data engineering, with a focus on:
            </p>
            <ul className="space-y-3 text-muted-foreground mb-10">
              {[
                "Microsoft Fabric",
                "Microsoft Power BI",
                "Microsoft Power Automate",
                "Microsoft Power Apps",
              ].map((topic) => (
                <li key={topic} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <strong className="text-foreground font-medium">{topic}</strong>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-semibold text-anthracite mt-10 mb-4">
              Philosophy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              I believe in learning through sharing. This space is about exchanging knowledge, growing together, and continuously improving, one insight at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Achievements Teaser */}
      <section className="container pb-8 max-w-5xl">
        <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-primary/5 via-card to-primary/[0.02] p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Achievements & Recognition
              </h2>
              <p className="text-muted-foreground text-sm max-w-lg">
                Certifications, awards, community recognition, and appreciation from the data analytics ecosystem — all in one place.
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-4 mt-5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                    <BadgeCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">8× Microsoft Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40">
                    <Trophy className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">Fabric Community Super User</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal/20">
                    <Users className="h-4 w-4 text-teal" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">Active Community Contributor</span>
                </div>
              </div>
            </div>

            <Link
              to="/achievements"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all duration-200 flex-shrink-0 group"
            >
              View All
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
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
