import { useState, useCallback, useEffect, useMemo, useRef } from "react";
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
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import Layout from "@/components/Layout";
import {
  getAchievements,
  type AchievementItem as Achievement,
  type AchievementType,
} from "@/lib/achievements";

// ─── Visual config ────────────────────────────────────────────────────────────

const typeConfig = {
  certification: {
    label: "Certification",
    pluralLabel: "Certifications",
    Icon: BadgeCheck,
    color: "text-blue-600 dark:text-blue-400",
    gradient: "from-blue-500 to-blue-700",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-200 dark:border-blue-800/60",
    pillBg: "bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300",
    verifyLabel: "Verify credential",
  },
  award: {
    label: "Award",
    pluralLabel: "Awards",
    Icon: Trophy,
    color: "text-amber-600 dark:text-amber-400",
    gradient: "from-amber-400 to-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-800/60",
    pillBg: "bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300",
    verifyLabel: "View award",
  },
  community: {
    label: "Community",
    pluralLabel: "Community",
    Icon: Users,
    color: "text-teal-600 dark:text-teal-400",
    gradient: "from-teal-500 to-teal-700",
    bg: "bg-teal-50 dark:bg-teal-950/40",
    border: "border-teal-200 dark:border-teal-800/60",
    pillBg: "bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300",
    verifyLabel: "View post",
  },
  appreciation: {
    label: "Appreciation",
    pluralLabel: "Appreciation",
    Icon: Heart,
    color: "text-rose-600 dark:text-rose-400",
    gradient: "from-rose-500 to-rose-700",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    border: "border-rose-200 dark:border-rose-800/60",
    pillBg: "bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300",
    verifyLabel: "View",
  },
} as const;

const ALL_TABS: Array<{
  key: AchievementType | "all";
  label: string;
  Icon: typeof Award;
}> = [
  { key: "all",           label: "All",           Icon: BookOpen  },
  { key: "certification", label: "Certifications", Icon: BadgeCheck },
  { key: "award",         label: "Awards",         Icon: Trophy    },
  { key: "community",     label: "Community",      Icon: Users     },
  { key: "appreciation",  label: "Appreciation",   Icon: Heart     },
];

const AUTO_PLAY_MS = 3500;

function formatMonth(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

// ─── Full-width horizontal card ───────────────────────────────────────────────

function CarouselCard({ item }: { item: Achievement }) {
  const cfg = typeConfig[item.type];
  const TypeIcon = cfg.Icon;
  const isCertOrAward = item.type === "certification" || item.type === "award";
  const isAppreciation = item.type === "appreciation";

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col sm:flex-row min-h-[260px]">
      {/* ── Left / Top: media ── */}
      <div className="relative h-56 sm:h-auto sm:w-72 lg:w-80 flex-shrink-0 overflow-hidden">
        {item.embedUrl ? (
          <iframe
            src={item.embedUrl}
            className="w-full h-full border-0"
            title={item.title}
            loading="lazy"
            allow="fullscreen"
          />
        ) : item.imageUrl ? (
          <div className="w-full h-full bg-white dark:bg-neutral-900 flex items-center justify-center">
            <img
              src={item.imageUrl}
              alt={item.title}
              loading="lazy"
              className={`w-full h-full ${
                isCertOrAward ? "object-contain p-8" : "object-cover"
              }`}
            />
          </div>
        ) : (
          /* Gradient placeholder */
          <div
            className={`w-full h-full bg-gradient-to-br ${cfg.gradient} flex items-center justify-center relative overflow-hidden`}
          >
            {isAppreciation && item.excerpt ? (
              <>
                <span className="absolute top-0 left-2 text-9xl font-serif leading-none text-white/15 select-none pointer-events-none">
                  "
                </span>
                <p className="text-white text-sm leading-relaxed line-clamp-6 italic text-center drop-shadow-sm px-6 relative z-10">
                  "{item.excerpt}"
                </p>
              </>
            ) : (
              <div className="p-5 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                <TypeIcon className="h-12 w-12 text-white" />
              </div>
            )}
          </div>
        )}

        {/* Type pill */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm ${cfg.pillBg}`}
          >
            {cfg.label}
          </span>
        </div>
      </div>

      {/* ── Right / Bottom: details ── */}
      <div className="p-6 lg:p-8 flex-1 flex flex-col justify-between">
        <div>
          {/* Issuer / platform */}
          {(item.issuer || item.platform) && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
              {item.issuer || item.platform}
            </p>
          )}

          {/* Title */}
          <h3 className="text-xl lg:text-2xl font-bold text-foreground leading-tight mb-3">
            {item.title}
          </h3>

          {/* Attribution (appreciation) */}
          {isAppreciation && item.from && (
            <p className={`text-sm font-semibold mb-3 ${cfg.color}`}>
              {item.from}
            </p>
          )}

          {/* Description */}
          {!isAppreciation && item.description && (
            <p className="text-sm lg:text-base text-muted-foreground leading-relaxed line-clamp-3">
              {item.description}
            </p>
          )}

          {/* Quote for appreciation when image/embed is present */}
          {isAppreciation && item.excerpt && (item.imageUrl || item.embedUrl) && (
            <blockquote className="border-l-2 border-rose-300/60 pl-4 italic text-muted-foreground text-sm lg:text-base leading-relaxed line-clamp-4">
              "{item.excerpt}"
            </blockquote>
          )}
        </div>

        {/* Footer: date + verify link */}
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-border/40">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            {formatMonth(item.date)}
          </span>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-bold flex items-center gap-1.5 ${cfg.color} hover:opacity-75 transition-opacity`}
            >
              {cfg.verifyLabel}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const Achievements = () => {
  const [activeTab, setActiveTab]   = useState<AchievementType | "all">("all");
  const [isPaused,  setIsPaused]    = useState(false);
  const achievements = getAchievements();

  const counts = useMemo(
    (): Record<AchievementType | "all", number> => ({
      all:           achievements.length,
      certification: achievements.filter((a) => a.type === "certification").length,
      award:         achievements.filter((a) => a.type === "award").length,
      community:     achievements.filter((a) => a.type === "community").length,
      appreciation:  achievements.filter((a) => a.type === "appreciation").length,
    }),
    [achievements]
  );

  const visibleTabs = ALL_TABS.filter(
    (t) => t.key === "all" || counts[t.key as AchievementType] > 0
  );

  const filtered = useMemo(
    () =>
      activeTab === "all"
        ? achievements
        : achievements.filter((a) => a.type === activeTab),
    [achievements, activeTab]
  );

  // ── Embla setup ────────────────────────────────────────────────────────────
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps,   setScrollSnaps]   = useState<number[]>([]);
  const [prevEnabled,   setPrevEnabled]   = useState(false);
  const [nextEnabled,   setNextEnabled]   = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevEnabled(emblaApi.canScrollPrev());
    setNextEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Reinitialise when tab changes (new slide set)
  useEffect(() => {
    if (!emblaApi) return;
    const id = setTimeout(() => {
      emblaApi.reInit();
      emblaApi.scrollTo(0, true);
    }, 30);
    return () => clearTimeout(id);
  }, [activeTab, emblaApi]);

  // ── Auto-play ──────────────────────────────────────────────────────────────
  // Advances every AUTO_PLAY_MS ms; wraps back to first slide at the end.
  // Pauses while the user hovers over the carousel area.
  useEffect(() => {
    if (!emblaApi || isPaused || filtered.length < 2) return;
    const id = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0); // wrap to first slide
      }
    }, AUTO_PLAY_MS);
    return () => clearInterval(id);
  }, [emblaApi, isPaused, filtered.length]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo   = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const multiSlide = filtered.length > 1;

  return (
    <Layout>
      <Helmet>
        <title>Achievements and Recognition - TechieTips</title>
        <meta
          name="description"
          content="Certifications, awards, and community recognition earned by Tharun Kumar Ravikrindhi - 8x Microsoft Certified, Fabric Community Super User."
        />
      </Helmet>

      <section className="container py-12 max-w-4xl animate-fade-in">
        {/* Back link */}
        <Link
          to="/about"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to About
        </Link>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
            Achievements and Recognition
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Certifications, awards, and moments from the data analytics community
            I'm proud of. Updated as new milestones are reached.
          </p>
        </div>

        {/* Stats chips */}
        <div className="flex flex-wrap gap-3 mb-8">
          {(["certification", "award", "community", "appreciation"] as AchievementType[]).map(
            (type) => {
              const count = counts[type];
              if (count === 0) return null;
              const cfg = typeConfig[type];
              return (
                <div
                  key={type}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${cfg.border} ${cfg.bg}`}
                >
                  <cfg.Icon className={`h-4 w-4 ${cfg.color}`} />
                  <span className="text-sm font-bold text-foreground">{count}</span>
                  <span className="text-sm text-muted-foreground">{cfg.pluralLabel}</span>
                </div>
              );
            }
          )}
        </div>

        {/* Tab filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {visibleTabs.map((tab) => {
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

        {/* ── Carousel or empty state ─────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-1">Nothing here yet</p>
            <p className="text-sm">Check back soon, more milestones on the way!</p>
          </div>
        ) : filtered.length === 1 ? (
          /* Single item: no carousel needed */
          <CarouselCard item={filtered[0]} />
        ) : (
          /* Multi-item: full-width auto-play carousel */
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Embla viewport */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {filtered.map((item) => (
                  <div key={item.slug} className="flex-[0_0_100%] min-w-0">
                    <CarouselCard item={item} />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation bar: prev | dots | next | pause toggle */}
            <div className="flex items-center justify-center gap-3 mt-6">
              {/* Prev */}
              <button
                onClick={scrollPrev}
                disabled={!prevEnabled}
                aria-label="Previous"
                className="w-9 h-9 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {scrollSnaps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollTo(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`rounded-full transition-all duration-300 ${
                      i === selectedIndex
                        ? "w-6 h-2.5 bg-primary"
                        : "w-2.5 h-2.5 bg-muted-foreground/25 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>

              {/* Next */}
              <button
                onClick={scrollNext}
                disabled={!nextEnabled}
                aria-label="Next"
                className="w-9 h-9 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Pause / Resume auto-play */}
              <button
                onClick={() => setIsPaused((p) => !p)}
                aria-label={isPaused ? "Resume auto-play" : "Pause auto-play"}
                className="w-9 h-9 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors ml-2"
              >
                {isPaused ? (
                  <Play className="h-4 w-4" />
                ) : (
                  <Pause className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Slide counter */}
            <p className="text-center text-xs text-muted-foreground mt-2">
              {selectedIndex + 1} of {scrollSnaps.length}
              {!isPaused && (
                <span className="ml-2 opacity-60">
                  (auto-advancing)
                </span>
              )}
            </p>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Achievements;
