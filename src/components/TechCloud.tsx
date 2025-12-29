import { useEffect, useState } from "react";

interface TechIcon {
  name: string;
  src: string;
}

// Import all icons from the public/icons folder
const iconModules = import.meta.glob("/public/icons/*.{png,svg,jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

const TechCloud = () => {
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

    // Apply display overrides where applicable
    for (const ico of loadedIcons) {
      const key = normalize(ico.name);
      if (displayOverrides[key]) {
        ico.name = displayOverrides[key];
      }
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
    // Reduced top spacing so TechCloud sits closer to the hero
    <div className="py-2 mt-0 md:mt-6">
      <div className="flex flex-wrap justify-center md:justify-start gap-4 pr-6">
        {icons.map((icon, index) => (
          <div
            key={icon.name}
            className="group flex items-center gap-3 p-2 pr-3 rounded-lg bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 80}ms`, minWidth: 160, maxWidth: 180 }}
          >
            <img
              src={icon.src}
              alt={icon.name}
              title={icon.name}
              className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-300"
            />

            <div className="flex-1 min-w-0">
              <span className="block text-sm font-medium text-foreground truncate">{icon.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechCloud;