import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, Lightbulb, LayoutDashboard } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getArticles, getTips, getDashboards } from "@/lib/content";

const articles   = getArticles();
const tips       = getTips();
const dashboards = getDashboards();

const typeIcon = {
  article:   FileText,
  tip:       Lightbulb,
  dashboard: LayoutDashboard,
};

const typeRoute: Record<string, string> = {
  article:   "/articles",
  tip:       "/tips",
  dashboard: "/dashboards",
};

const SearchPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Cmd+K / Ctrl+K to open
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Also listen for external trigger (from header button)
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("openSearch", handler);
    return () => window.removeEventListener("openSearch", handler);
  }, []);

  const handleSelect = useCallback((slug: string, type: string) => {
    setOpen(false);
    navigate(`${typeRoute[type]}/${slug}`);
  }, [navigate]);

  return (
    <>
      {/* Trigger button — shown in Header */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors border border-border/50"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search</span>
        <kbd className="ml-1 pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Mobile icon-only button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      >
        <Search className="h-4 w-4" />
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search articles, tips, dashboards..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {articles.length > 0 && (
            <CommandGroup heading="Articles">
              {articles.map(item => (
                <CommandItem
                  key={item.slug}
                  value={`${item.title} ${item.tags.join(" ")}`}
                  onSelect={() => handleSelect(item.slug, "article")}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.summary}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {tips.length > 0 && (
            <CommandGroup heading="Tips & Tricks">
              {tips.map(item => (
                <CommandItem
                  key={item.slug}
                  value={`${item.title} ${item.tags.join(" ")}`}
                  onSelect={() => handleSelect(item.slug, "tip")}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Lightbulb className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.summary}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {dashboards.length > 0 && (
            <CommandGroup heading="Dashboards">
              {dashboards.map(item => (
                <CommandItem
                  key={item.slug}
                  value={`${item.title} ${item.tags.join(" ")}`}
                  onSelect={() => handleSelect(item.slug, "dashboard")}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4 text-violet-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.summary}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchPalette;
