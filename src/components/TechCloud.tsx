import { useEffect, useState } from "react";

interface TechIcon {
  name: string;
  src: string;
  tagMatches: string[]; // Tags this icon should match against
}

interface TechCloudProps {
  onTechClick?: (tech: string | null) => void;
  activeTech?: string | null;
}

// Import all icons from the public/icons folder
const iconModules = import.meta.glob("/public/icons/*.{png,svg,jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

// Mapping from icon names to content tags they should match
const tagMapping: Record<string, string[]> = {
  "Power BI": ["Power BI"],
  "Fabric": ["Fabric", "Microsoft Fabric"],
  "Power Apps": ["Power Apps", "PowerApps"],
  "Power Automate": ["Power Automate", "PowerAutomate"],
  "Synapse": ["Synapse"],
};

const TechCloud = ({ onTechClick, activeTech }: TechCloudProps) => {
  const [icons, setIcons] = useState<TechIcon[]>([]);

  useEffect(() => {
    const loadedIcons: TechIcon[] = [];

    for (const [path, url] of Object.entries(iconModules)) {
      const fileName = path.split("/").pop() || "";
      const base = fileName.replace(/\.(png|svg|jpg|jpeg|webp)$/i, "").replace(/[-_]/g, " ");
      // Title-case each word for nicer display
      const name = base
        .split(" ")
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      loadedIcons.push({
        name,
        src: url as string,
        tagMatches: [],
      });
    }

    // Order icons by a predefined preferred order; unknown icons appear after, alphabetically
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const preferredOrder = ["fabric", "powerbi", "powerautomate", "powerapps", "synapse"];

    // Friendly display name overrides for known techs (fix casing like "Power BI")
    const displayOverrides: Record<string, string> = {
      powerbi: "Power BI",
      powerapps: "Power Apps",
      powerautomate: "Power Automate",
      synapse: "Synapse",
      fabric: "Fabric",
      microsoftfabric: "Fabric",
    };

    // Apply display overrides and tag mappings where applicable
    for (const ico of loadedIcons) {
      const key = normalize(ico.name);
      if (displayOverrides[key]) {
        ico.name = displayOverrides[key];
      }
      // Set tag matches from mapping
      ico.tagMatches = tagMapping[ico.name] || [ico.name];
    }

    loadedIcons.sort((a, b) => {
      const ai = preferredOrder.indexOf(normalize(a.name));
      const bi = preferredOrder.indexOf(normalize(b.name));
      if (ai === -1 && bi === -1) return a.name.localeCompare(b.name);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

    setIcons(loadedIcons);
  }, []);

  const handleTechClick = (techName: string) => {
    if (!onTechClick) return;
    // Toggle: if already active, clear the filter
    if (activeTech === techName) {
      onTechClick(null);
    } else {
      onTechClick(techName);
    }
  };

  if (icons.length === 0) {
    // Fallback to text-based tech display if no icons
    const technologies = [
      "Microsoft Fabric",
      "Power BI",
      "Data Pipelines",
      "Python",
      "SQL",
      "DAX",
      "Power Query",
      "Power Automate",
      "PowerShell",
      "CLI",
      "KQL",
    ];

    return (
      <div className="py-10">
        <div className="flex flex-wrap justify-center gap-3">
          {technologies.map((tech, index) => (
            <div
              key={tech}
              className="px-4 py-2.5 rounded-xl bg-card border border-border/50 text-sm font-medium text-foreground/80 shadow-sm hover:shadow-md hover:border-primary/30 hover:text-primary transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-2 mt-0 md:mt-6">
      {/* Mobile: single-line left aligned, horizontally scrollable */}
  <div className="flex flex-nowrap md:flex-wrap justify-center md:justify-start gap-2 md:gap-4 pr-2 md:pr-6 overflow-x-auto md:overflow-visible touch-pan-x" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* All button to clear filter */}
        {onTechClick && (
          <button
            onClick={() => onTechClick(null)}
            className={`group flex items-center gap-2 px-4 py-2 rounded-lg border shadow-sm transition-all duration-300 animate-fade-in ${
              activeTech === null
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "bg-card border-border/50 hover:shadow-md hover:border-primary/30"
            }`}
          >
            <span className="text-sm font-medium">All</span>
          </button>
        )}
        
        {icons.map((icon, index) => {
          const isActive = activeTech === icon.name;
          return (
            <button
              key={icon.name}
              onClick={() => handleTechClick(icon.name)}
              className={`group flex items-center justify-center md:justify-start gap-2 md:gap-3 px-2 md:px-3 py-1 md:py-2 rounded-lg border shadow-sm cursor-pointer transition-colors duration-150 ease-out will-change-transform min-w-0 ${
                isActive
                  ? "bg-primary/10 border-primary shadow-md ring-2 ring-primary/20"
                  : "bg-card border-border/50 hover:shadow-md hover:border-primary/30"
              }`}
              style={{ animationDelay: `${index * 40}ms` }}
              aria-pressed={isActive}
              // Responsive sizing: compact on small screens, fixed-ish on md+
              // min-w on mobile reduced so items wrap cleanly
              
            >
              <img
                src={icon.src}
                alt={icon.name}
                title={icon.name}
                className={`w-6 h-6 md:w-8 md:h-8 flex-shrink-0 object-contain transition-transform duration-150 ease-out ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`}
              />

              <span
                className={`hidden md:inline-block text-sm font-medium truncate ${
                  isActive ? "text-primary" : "text-foreground"
                } md:max-w-[140px] md:flex-1 md:text-left`}
                style={{ minWidth: 0 }}
              >
                {icon.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TechCloud;