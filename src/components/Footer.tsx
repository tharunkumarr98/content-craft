import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Link to="/" className="inline-block text-xl font-bold text-foreground tracking-tight">
              Techie<span className="text-primary">Tips</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Technical insights on Microsoft Fabric, Power BI, and modern data analytics. No fluff, just practical knowledge.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-5">Content</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/articles" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Articles
              </Link>
              <Link to="/tips" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Tips & Tricks
              </Link>
              <Link to="/dashboards" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Dashboards
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
            </nav>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-5">Connect</h4>
            <div className="flex gap-3">
              <a 
                href="https://github.com/tharunkumarr98" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/tharun-kumar-ravikrindhi/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="mailto:tharunkumarr98@gmail.com"
                className="p-2.5 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} TechieTips. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;