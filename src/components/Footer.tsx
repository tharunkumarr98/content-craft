import { Link } from "react-router-dom";
import Connect from "./Connect";

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
              Knowledge hub for Modern Data Analytics.
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
            <Connect />
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