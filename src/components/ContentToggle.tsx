import { ContentType } from "@/lib/content";

interface ContentToggleProps {
  activeType: ContentType;
  onTypeChange: (type: ContentType) => void;
}

const ContentToggle = ({ activeType, onTypeChange }: ContentToggleProps) => {
  const types: { type: ContentType; label: string }[] = [
    { type: "article", label: "Articles" },
    { type: "tip", label: "Tips & Tricks" },
    { type: "dashboard", label: "Dashboards" },
  ];

  return (
    <div className="content-toggle">
      {types.map(({ type, label }) => (
        <button
          key={type}
          onClick={() => onTypeChange(type)}
          className="content-toggle-item"
          data-state={activeType === type ? "active" : "inactive"}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default ContentToggle;