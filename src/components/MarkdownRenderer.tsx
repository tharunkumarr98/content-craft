import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="prose-blog">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => {
            const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
            return <h1 id={id}>{children}</h1>;
          },
          h2: ({ children }) => {
            const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
            return <h2 id={id}>{children}</h2>;
          },
          h3: ({ children }) => {
            const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
            return <h3 id={id}>{children}</h3>;
          },
          h4: ({ children }) => {
            const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
            return <h4 id={id}>{children}</h4>;
          },
        img: ({ src, alt }) => {
            // 1. Get the base (e.g., "/content-craft") and remove any trailing slash
            const base = import.meta.env.BASE_URL.replace(/\/$/, "");
            
            // 2. Clean up the src from Markdown
            let path = src || "";

            // 3. If the path already includes the base name (manually typed in MD), 
            // remove it first so we don't double it.
            if (path.startsWith(base) && base !== "") {
              path = path.replace(base, "");
            }

            // 4. Final safety check: Ensure there is exactly one slash between them
            if (!path.startsWith("/")) {
              path = "/" + path;
            }

            const finalSrc = `${base}${path}`;

            return (
              <img
                src={finalSrc}
                alt={alt || ""}
                className="rounded-xl my-8 max-w-full w-full shadow-md"
                loading="eager"
                onError={(e) => {
                  console.error("FINAL ATTEMPT URL:", e.currentTarget.src);
                }}
              />
            );
          },
  
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !className;
            
            if (isInline) {
              return <code {...props}>{children}</code>;
            }
            
            return (
              <CodeBlock language={match?.[1] || "text"}>
                {String(children).replace(/\n$/, "")}
              </CodeBlock>
            );
          },
          pre: ({ children }) => {
            return <pre className="not-prose">{children}</pre>;
          },
          a: ({ href, children }) => {
            const isExternal = href?.startsWith("http");
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
