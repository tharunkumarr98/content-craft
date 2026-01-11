import React, { useEffect, useState } from "react";
import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

interface CommentsProps {
  /** The discussion mapping term (url, pathname, title, or custom) */
  mapping?: "url" | "title" | "pathname" | "og:title" | "specific";
  /** When using 'specific' mapping you can pass the term (e.g., slug) */
  term?: string;
}

const Comments: React.FC<CommentsProps> = ({ mapping = "pathname", term }) => {
  // Load configuration from Vite env vars if present, otherwise fall back to the
  // explicit values you provided.
  const repo = (import.meta.env.VITE_GISCUS_REPO as string | undefined) || "tharunkumarr98/content-craft";
  const repoId = (import.meta.env.VITE_GISCUS_REPOSITORY_ID as string | undefined) || "R_kgDOQwBf1w";
  const category = (import.meta.env.VITE_GISCUS_CATEGORY as string | undefined) || "General";
  const categoryId = (import.meta.env.VITE_GISCUS_CATEGORY_ID as string | undefined) || "DIC_kwDOQwBf184C00hf";
  // default mapping/term per the script you provided (you can override via props)
  const defaultMapping: CommentsProps["mapping"] = "specific";
  const defaultTerm = "Blog Comments";

  // If not configured (shouldn't happen because we have fallbacks), show a helpful placeholder.
  if (!repo || !repoId || !category || !categoryId) {
    return (
      <div className="mt-12 p-4 rounded-md bg-card border border-border/50 text-sm text-muted-foreground">
        <strong>Comments (not configured)</strong>
        <p className="mt-2">To enable comments with Giscus:
          <ol className="list-decimal list-inside ml-4 mt-2">
            <li>Enable Discussions for your GitHub repo and create a category (e.g. "Blog Comments").</li>
            <li>Add Vite env variables: <code>VITE_GISCUS_REPO</code>, <code>VITE_GISCUS_REPOSITORY_ID</code>, <code>VITE_GISCUS_CATEGORY</code>, <code>VITE_GISCUS_CATEGORY_ID</code>.</li>
            <li>Restart the dev server.</li>
          </ol>
        </p>
      </div>
    );
  }

  // Build mapping term. Use the provided mapping/term props when given; otherwise use
  // the defaults from the script you provided.
  const mappingValue = mapping ? (mapping === "specific" ? (term || defaultTerm) : mapping) : defaultMapping;
  // Use site theme (next-themes) so giscus matches the site appearance.
  const { theme: siteTheme = "system" } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const giscusTheme = siteTheme === "dark" ? "dark" : siteTheme === "light" ? "light" : "preferred_color_scheme";

  return (
    <div className="mt-12 w-full">
      <div className="w-full bg-card border border-border/50 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50 bg-card/50 text-sm font-semibold text-foreground">
          Comments
        </div>
        <div className="px-4 py-6">
          {!mounted ? (
            <div className="text-sm text-muted-foreground">Loading comments…</div>
          ) : (
            <Giscus
              repo={repo}
              repoId={repoId}
              category={category}
              categoryId={categoryId}
              mapping={mappingValue}
              term={mapping === "specific" ? (term || defaultTerm) : undefined}
              reactionsEnabled={"0"}
              emitMetadata={"1"}
              inputPosition={"top"}
              theme={giscusTheme}
              lang={"en"}
              loading={"lazy"}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Comments;
