import { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Trophy,
  BadgeCheck,
  Users,
  Heart,
  ExternalLink,
  Calendar,
  Award,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { getAchievements, type AchievementItem as Achievement, type AchievementType } from "@/lib/achievements";

// ─── Per-type visual config ───────────────────────────────────────────────────

const typeConfig = {
  certification: {
    label: "Certifications",
    Icon: BadgeCheck,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-200 dark:border-blue-800/60",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
    pillBg: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
  },
  award: {
    label: "Awards",
    Icon: Trophy,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-800/60",
    iconBg: "bg-amber-100 dark:bg-amber-900/50",
    pillBg: "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300",
  },
  community: {
    label: "Community",
    Icon: Users,
    color: "text-teal dark:text-teal-light",
    bg: "bg-teal-light/30 dark:bg-teal/10",
    border: "border-teal-light dark:border-teal/30",
    iconBg: "bg-teal-light/60 dark:bg-teal/20",
    pillBg: "bg-teal-light/60 dark:bg-teal/20 text-teal dark:text-teal-light",
  },
  appreciation: {
    label: "Appreciation",
    Icon: Heart,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    border: "border-rose-200 dark:border-rose-800/60",
    iconBg: "bg-rose-100 dark:bg-rose-900/50",
    pillBg: "bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300",
  },
} as const;

const ALL_TABS: Array<{ key: AchievementType | "all"; label: string; Icon: typeof Award }> = [
  { key: "all", label: "All", Icon: BookOpen },
  { key: "certification", label: "Certifications", Icon: BadgeCheck },
  { key: "award", label: "Awards", Icon: Trophy },
  { key: "community", label: "Community", Icon: Users },
  { key: "appreciation", label: "Appreciation", Icon: Heart },
];

function formatMonth(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

// ─── Card components ──────────────────────────────────────────────────────────

function CertificationCard({ item }: { item: Achievement }) {
  const cfg = typeConfig.certification;
  return (
    <div className={`flex items-start gap-4 p-5 rounded-xl border ${cfg.border} ${cfg.bg} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}>
      <div className={`p-2.5 rounded-lg ${cfg.iconBg} flex-shrink-0 mt-0.5`}>
        <BadgeCheck className={`h-5 w-5 ${cfg.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-foreground leading-snug">{item.title}</h3>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Verify certification"
              className={`flex-shrink-0 mt-0.5 ${cfg.color} opacity-50 hover:opacity-100 transition-opacity`}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{item.description}</p>
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          {item.issuer && (
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cfg.pillBg}`}>
              {item.issuer}
            </span>
          )}
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatMonth(item.date)}
          </span>
        </div>
      </div>
    </div>
  );
}

function AwardCard({ item }: { item: Achievement }) {
  const cfg = typeConfig.award;
  return (
    <div className={`flex items-start gap-5 p-6 rounded-xl border ${cfg.border} ${cfg.bg} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}>
      <div className={`p-3 rounded-xl ${cfg.iconBg} flex-shrink-0`}>
        <Trophy className={`h-6 w-6 ${cfg.color}`} />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-foreground leading-snug">{item.title}</h3>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View award"
              className={`flex-shrink-0 mt-1 ${cfg.color} opacity-50 hover:opacity-100 transition-opacity`}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
        <p className="text-muted-foreground mt-2 leading-relaxed">{item.description}</p>
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          {item.issuer && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.pillBg}`}>
              {item.issuer}
            </span>
          )}
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatMonth(item.date)}
          </span>
        </div>
      </div>
    </div>
  );
}

function CommunityCard({ item }: { item: Achievement }) {
  const cfg = typeConfig.community;
  return (
    <div className={`flex items-start gap-4 p-5 rounded-xl border ${cfg.border} ${cfg.bg} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}>
      <div className={`p-2.5 rounded-lg ${cfg.iconBg} flex-shrink-0 mt-0.5`}>
        <Users className={`h-5 w-5 ${cfg.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-foreground leading-snug">{item.title}</h3>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View post"
              className={`flex-shrink-0 mt-0.5 ${cfg.color} opacity-50 hover:opacity-100 transition-opacity`}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{item.description}</p>
        {item.excerpt && (
          <blockquote className="mt-3 pl-3 border-l-2 border-teal/40 italic text-sm text-muted-foreground leading-relaxed">
            "{item.excerpt}"
            {item.from && (
              <span className="block mt-1 not-italic text-xs font-medium text-foreground/70">
                {item.from}
              </span>
            )}
          </blockquote>
        )}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          {item.platform && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.pillBg}`}>
              {item.platform}
            </span>
          )}
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatMonth(item.date)}
          </span>
        </div>
      </div>
    </div>
  );
}

function AppreciationCard({ item }: { item: Achievement }) {
  const cfg = typeConfig.appreciation;
  return (
    <div className={`relative p-6 rounded-xl border ${cfg.border} ${cfg.bg} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md overflow-hidden`}>
      <span className={`absolute top-3 right-5 text-6xl font-serif leading-none ${cfg.color} opacity-15 select-none pointer-events-none`}>
        "
      </span>
      {item.excerpt && (
        <p className="text-foreground/90 italic leading-relaxed mb-5 pr-6 text-[0.95rem]">
          "{item.excerpt}"
        </p>
      )}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          {item.from && (
            <p className={`text-sm font-semibold ${cfg.color}`}>{item.from}</p>
          )}
          {item.title && (
            <p className="text-xs text-muted-foreground mt-0.5">{item.title}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {item.platform && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.pillBg}`}>
              {item.platform}
            </span>
          )}
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatMonth(item.date)}
          </span>
        </div>
      </div>
    </div>
  );
}

function AchievementCard({ item }: { item: Achievement }) {
  switch (item.type) {
    case "certification":  return <CertificationCard item={item} />;
    case "award":          return <AwardCard item={item} />;
    case "community":      return <CommunityCard item={item} />;
    case "appreciation":   return <AppreciationCard item={item} />;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const Achievements = () => {
  const [activeTab, setActiveTab] = useState<AchievementType | "all">("all");
  const achievements = getAchievements();

  const counts: Record<AchievementType | "all", number> = {
    all: achievements.length,
    certification: achievements.filter(a => a.type === "certification").length,
    award:         achievements.filter(a => a.type === "award").length,
    community:     achievements.filter(a => a.type === "community").length,
    appreciation:  achievements.filter(a => a.type === "appreciation").length,
  };

  const visibleTabs = ALL_TABS.filter(
    t => t.key === "all" || counts[t.key as AchievementType] > 0
  );

  const filtered = activeTab === "all"
    ? achievements
    : achievements.filter(a => a.type === activeTab);

  return (
    <Layout>
      <Helmet>
        <title>Achievements & Recognition - TechieTips</title>
        <meta
          name="description"
          content="Certifications, awards, and community recognition earned by Tharun Kumar Ravikrindhi — 8× Microsoft Certified, Fabric Community Super User."
        />
      </Helmet>

      <section className="container py-12 max-w-4xl animate-fade-in">
        {/* Page header */}
        <div className="mb-4">
          <Link
            to="/about"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            ← Back to About
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
            Achievements & Recognition
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Certifications, awards, and moments from the data analytics community I'm proud of. Updated as new milestones are reached.
          </p>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-4 my-8">
          {(["certification", "award", "community", "appreciation"] as AchievementType[]).map(type => {
            const count = counts[type];
            if (count === 0) return null;
            const cfg = typeConfig[type];
            return (
              <div key={type} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${cfg.border} ${cfg.bg}`}>
                <cfg.Icon className={`h-4 w-4 ${cfg.color}`} />
                <span className="text-sm font-semibold text-foreground">{count}</span>
                <span className="text-sm text-muted-foreground">{cfg.label}</span>
              </div>
            );
          })}
        </div>

        {/* Tab filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {visibleTabs.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as AchievementType | "all")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                <tab.Icon className="h-3.5 w-3.5" />
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-background text-muted-foreground"
                  }`}
                >
                  {counts[tab.key]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-1">Nothing here yet</p>
            <p className="text-sm">Check back soon — more milestones on the way!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((item, index) => (
              <div
                key={item.slug}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <AchievementCard item={item} />
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Achievements;
