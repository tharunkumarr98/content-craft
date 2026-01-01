import { Github, Linkedin, Mail } from "lucide-react";
import React from "react";

const Connect: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={className}>
      <h4 className="font-semibold text-foreground mb-3">Connect</h4>
      <div className="flex gap-3">
        <a
          href="mailto:tharunkumarr98@gmail.com"
          className="p-2.5 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
          aria-label="Email"
        >
          <Mail className="h-5 w-5" />
        </a>

        <a
          href="https://www.linkedin.com/in/tharun-kumar-ravikrindhi/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
          aria-label="LinkedIn"
        >
          <Linkedin className="h-5 w-5" />
        </a>

        <a
          href="https://medium.com/@tharunkumarr98"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
          aria-label="Medium"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
          </svg>
        </a>

        <a
          href="https://community.fabric.microsoft.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
          aria-label="Microsoft Fabric Community"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.5 3v7.5H4V3h7.5zm1 0H20v7.5h-7.5V3zm-1 8.5V19H4v-7.5h7.5zm1 0H20V19h-7.5v-7.5z" />
          </svg>
        </a>

        <a
          href="https://github.com/tharunkumarr98"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
          aria-label="GitHub"
        >
          <Github className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
};

export default Connect;
