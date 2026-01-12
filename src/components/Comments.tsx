import React, { useEffect, useState } from "react";
import Giscus from "@giscus/react";

interface CommentsProps {
  /** The discussion mapping term (url, pathname, title, or custom) */
  mapping?: "url" | "title" | "pathname" | "og:title" | "specific";
  /** When using 'specific' mapping you can pass the term (e.g., slug) */
  term?: string;
}

const Comments: React.FC<CommentsProps> = ({ mapping = "pathname", term }) => {
  const repo = (import.meta.env.VITE_GISCUS_REPO as string | undefined) || "tharunkumarr98/content-craft";
  const repoId = (import.meta.env.VITE_GISCUS_REPOSITORY_ID as string | undefined) || "R_kgDOQwBf1w";
  const category = (import.meta.env.VITE_GISCUS_CATEGORY as string | undefined) || "General";
  const categoryId = (import.meta.env.VITE_GISCUS_CATEGORY_ID as string | undefined) || "DIC_kwDOQwBf184C00hf";
  const defaultMapping: CommentsProps["mapping"] = "specific";
  const defaultTerm = "Blog Comments";

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const mappingValue = mapping ? (mapping === "specific" ? (term || defaultTerm) : mapping) : defaultMapping;

  return (
    <section className="mt-16 w-full">
      <h2 className="text-xl font-semibold text-foreground mb-6">Comments</h2>
      <div className="w-full giscus-wrapper">
        {!mounted ? (
          <div className="p-6 rounded-lg bg-muted/30 border border-border/50">
            <div className="text-sm text-muted-foreground">Loading comments…</div>
          </div>
        ) : (
          <Giscus
            repo={repo}
            repoId={repoId}
            category={category}
            categoryId={categoryId}
            mapping={mappingValue}
            term={mapping === "specific" ? (term || defaultTerm) : undefined}
            reactionsEnabled="0"
            emitMetadata="0"
            inputPosition="top"
            theme="light"
            lang="en"
            loading="lazy"
          />
        )}
      </div>
    </section>
  );
};

export default Comments;
