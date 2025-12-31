import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  useEffect(() => {
    // Handle hash navigation with dynamic header offset.
    // We avoid hardcoded offsets; we read the runtime CSS variable --header-offset.
    const scrollToHash = (hash?: string) => {
      if (!hash) return;
      const id = decodeURIComponent(hash.replace(/^#/, ""));

      const tryScroll = (attempt = 0) => {
        const el = document.getElementById(id);
        if (el) {
          const root = document.documentElement;
          const varVal = getComputedStyle(root).getPropertyValue("--header-offset") || "0px";
          const headerOffset = parseInt(varVal.trim().replace("px", "")) || 0;
          const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
          // Use smooth scrolling for better UX on blog content
          window.scrollTo({ top, behavior: "smooth" });
          return;
        }

        // If element not found yet (content may be loading), retry a few times
        if (attempt < 5) {
          setTimeout(() => tryScroll(attempt + 1), attempt === 0 ? 50 : 150);
        }
      };

      tryScroll();
    };

    // On route change, if there's a hash, attempt to scroll.
    if (location.hash) {
      // Delay slightly to allow page content to mount
      setTimeout(() => scrollToHash(location.hash), 20);
    } else {
  // If no hash, ensure we scroll to top when navigating to a new route
  window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Also handle native hashchange events (user manually changes hash)
    const onHash = () => scrollToHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
