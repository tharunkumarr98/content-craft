import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

const TableOfContents = ({ content }: TableOfContentsProps) => {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const items: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      items.push({ id, text, level });
    }

    setHeadings(items);
  }, [content]);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const getHeaderOffset = () => {
      const val = getComputedStyle(document.documentElement).getPropertyValue("--header-offset") || "0px";
      const px = parseInt(val.trim().replace("px", "")) || 0;
      return px;
    };

    const initObserver = () => {
      if (observer) observer.disconnect();

      const headerOffset = getHeaderOffset();
      // Use the header offset dynamically for the top root margin so headings
      // entering below the sticky header are reported as intersecting.
      const rootMargin = `-${headerOffset}px 0px -66% 0px`;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        { rootMargin }
      );

      headings.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) observer!.observe(element);
      });
    };

    // Initialize and also re-init on resize (header height may change)
    initObserver();
    window.addEventListener("resize", initObserver);

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("resize", initObserver);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden lg:block sticky top-24">
      <div className="p-5 rounded-xl bg-gradient-to-br from-background to-muted/30 border border-teal/20 shadow-sm">
        <h4 className="text-sm font-semibold text-anthracite mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-teal rounded-full"></span>
          On this page
        </h4>
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 2) * 14}px` }}
            >
              <a
                href={`#${heading.id}`}
                onClick={() => setActiveId(heading.id)}
                className={`block py-1.5 transition-all leading-snug hover:text-teal hover:translate-x-0.5 ${
                  activeId === heading.id
                    ? "text-teal font-medium border-l-2 border-teal pl-2 -ml-2"
                    : "text-muted-foreground"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default TableOfContents;
