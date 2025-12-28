import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  language?: string;
  children: string;
}

// Map custom language identifiers to Prism-supported ones
const languageMap: Record<string, string> = {
  powerquery: "powerquery",
  m: "powerquery",
  dax: "javascript", // DAX has similar syntax to JS
  pq: "powerquery",
};

const CodeBlock = ({ language = "text", children }: CodeBlockProps) => {
  const mappedLanguage = languageMap[language.toLowerCase()] || language;
  
  // Custom theme based on oneDark but adjusted for our design
  const customStyle = {
    ...oneDark,
    'pre[class*="language-"]': {
      ...oneDark['pre[class*="language-"]'],
      background: "transparent",
      margin: 0,
      padding: "1rem",
      fontSize: "0.875rem",
      lineHeight: "1.7",
    },
    'code[class*="language-"]': {
      ...oneDark['code[class*="language-"]'],
      background: "transparent",
    },
  };

  return (
    <div className="relative group">
      {language && language !== "text" && (
        <div className="absolute right-3 top-2 text-xs text-muted-foreground font-mono uppercase">
          {language}
        </div>
      )}
      <SyntaxHighlighter
        language={mappedLanguage}
        style={customStyle}
        showLineNumbers={children.split("\n").length > 3}
        wrapLines
        lineNumberStyle={{
          minWidth: "2.5em",
          paddingRight: "1em",
          color: "hsl(var(--muted-foreground) / 0.5)",
          userSelect: "none",
        }}
      >
        {children.trim()}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
