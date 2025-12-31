import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/articles", label: "Articles" },
    { path: "/tips", label: "Tips" },
    { path: "/dashboards", label: "Dashboards" },
    { path: "/about", label: "About" },
  ];

  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const setOffset = () => {
      const el = headerRef.current as HTMLElement | null;
      const height = el ? Math.ceil(el.getBoundingClientRect().height) : 0;
      document.documentElement.style.setProperty("--header-offset", `${height}px`);
    };

    // Initial set
    setOffset();

    // ResizeObserver to watch header size changes (e.g., mobile menu open)
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && headerRef.current) {
      ro = new ResizeObserver(() => setOffset());
      ro.observe(headerRef.current);
    }

    // Fallback: window resize
    window.addEventListener("resize", setOffset);

    return () => {
      window.removeEventListener("resize", setOffset);
      if (ro) ro.disconnect();
    };
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <span className="text-xl font-bold text-foreground tracking-tight">
            Techie<span className="text-primary">Tips</span>
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-all duration-200 hover:text-primary relative ${
                isActive(link.path)
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
              {isActive(link.path) && (
                <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <nav className="container py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;