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
      const name = fileName.replace(/\.(png|svg|jpg|jpeg|webp)$/, "").replace(/-/g, " ");
      loadedIcons.push({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        src: url as string,
      });
    }
    
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
    <div className="py-10">
      <div className="flex flex-wrap justify-center gap-4">
        {icons.map((icon, index) => (
          <div
            key={icon.name}
            className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <img
              src={icon.src}
              alt={icon.name}
              className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
            />
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {icon.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechCloud;