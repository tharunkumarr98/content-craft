import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Check, Copy } from "lucide-react";

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
  kql: "sql", // KQL similar to SQL
  powershell: "powershell",
  ps1: "powershell",
  shell: "bash",
  cli: "bash",
};

// Custom theme with high contrast colors
const customTheme: { [key: string]: React.CSSProperties } = {
  'code[class*="language-"]': {
    color: "#e6e6e6",
    background: "none",
    fontFamily: "'JetBrains Mono', Consolas, Monaco, 'Andale Mono', monospace",
    fontSize: "0.875rem",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    lineHeight: "1.7",
    tabSize: 4,
    hyphens: "none",
  },
  'pre[class*="language-"]': {
    color: "#e6e6e6",
    background: "#1a1d23",
    fontFamily: "'JetBrains Mono', Consolas, Monaco, 'Andale Mono', monospace",
    fontSize: "0.875rem",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    lineHeight: "1.7",
    tabSize: 4,
    hyphens: "none",
    padding: "1.25rem",
    margin: 0,
    overflow: "auto",
    borderRadius: "0.75rem",
  },
  comment: { color: "#7c8a99" },
  prolog: { color: "#7c8a99" },
  doctype: { color: "#7c8a99" },
  cdata: { color: "#7c8a99" },
  punctuation: { color: "#b3b9c5" },
  namespace: { opacity: 0.7 },
  property: { color: "#ff9d4d" },
  tag: { color: "#ff7b72" },
  boolean: { color: "#79c0ff" },
  number: { color: "#79c0ff" },
  constant: { color: "#79c0ff" },
  symbol: { color: "#79c0ff" },
  deleted: { color: "#ff7b72" },
  selector: { color: "#7ee787" },
  "attr-name": { color: "#79c0ff" },
  string: { color: "#a5d6ff" },
  char: { color: "#a5d6ff" },
  builtin: { color: "#ffa657" },
  inserted: { color: "#7ee787" },
  operator: { color: "#ff7b72" },
  entity: { color: "#79c0ff", cursor: "help" },
  url: { color: "#79c0ff" },
  ".language-css .token.string": { color: "#a5d6ff" },
  ".style .token.string": { color: "#a5d6ff" },
  atrule: { color: "#79c0ff" },
  "attr-value": { color: "#a5d6ff" },
  keyword: { color: "#ff7b72" },
  function: { color: "#d2a8ff" },
  "class-name": { color: "#ffa657" },
  regex: { color: "#7ee787" },
  important: { color: "#ffa657", fontWeight: "bold" },
  variable: { color: "#ffa657" },
  bold: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },
};

const CodeBlock = ({ language = "text", children }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const mappedLanguage = languageMap[language.toLowerCase()] || language;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative group rounded-xl overflow-hidden bg-[#1a1d23] border border-border/50">
      {/* Header with language and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#15171c] border-b border-border/30">
        {language && language !== "text" ? (
          <span className="text-xs text-[#7c8a99] font-mono uppercase tracking-wide">
            {language}
          </span>
        ) : (
          <span />
        )}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#a0a8b7] hover:text-white bg-transparent hover:bg-white/10 rounded-md transition-all duration-200"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">Copy</span>
            </>
          )}
        </button>
      </div>
      
      {/* Code content */}
      <SyntaxHighlighter
        language={mappedLanguage}
        style={customTheme}
        showLineNumbers={children.split("\n").length > 3}
        wrapLines
        lineNumberStyle={{
          minWidth: "2.5em",
          paddingRight: "1em",
          color: "#4a5568",
          userSelect: "none",
        }}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: "#1a1d23",
        }}
      >
        {children.trim()}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
