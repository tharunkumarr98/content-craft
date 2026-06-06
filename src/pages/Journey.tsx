import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Baby,
  GraduationCap,
  Briefcase,
  MapPin,
  Sparkles,
} from "lucide-react";
import Layout from "@/components/Layout";
import { getJourney, type JourneyItem, type JourneyCategory } from "@/lib/journey";

// ─── Per-category visual config ───────────────────────────────────────────────

const categoryConfig: Record<
  JourneyCategory,
  {
    label: string;
    Icon: typeof Baby;
    dot: string;        // node background
    ring: string;       // node ring / glow
    text: string;       // accent text
    chip: string;       // year badge
    line: string;       // border accent on card
  }
> = {
  birth: {
    label: "Origin",
    Icon: Baby,
    dot: "bg-gradient-to-br from-rose-400 to-rose-600",
    ring: "ring-rose-200 dark:ring-rose-900/50",
    text: "text-rose-600 dark:text-rose-400",
    chip: "bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300",
    line: "border-l-rose-400 dark:border-l-rose-500",
  },
  education: {
    label: "Education",
    Icon: GraduationCap,
    dot: "bg-gradient-to-br from-violet-400 to-violet-600",
    ring: "ring-violet-200 dark:ring-violet-900/50",
    text: "text-violet-600 dark:text-violet-400",
    chip: "bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300",
    line: "border-l-violet-400 dark:border-l-violet-500",
  },
  career: {
    label: "Career",
    Icon: Briefcase,
    dot: "bg-gradient-to-br from-teal-400 to-teal-600",
    ring: "ring-teal-200 dark:ring-teal-900/50",
    text: "text-teal-600 dark:text-teal-400",
    chip: "bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300",
    line: "border-l-teal-400 dark:border-l-teal-500",
  },
};

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion preference: show immediately
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

// ─── Single timeline node ─────────────────────────────────────────────────────

function TimelineNode({ item, index }: { item: JourneyItem; index: number }) {
  const cfg = categoryConfig[item.category];
  const Icon = cfg.Icon;
  const isLeft = index % 2 === 0; // alternate sides on desktop
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`relative md:grid md:grid-cols-2 md:gap-x-12 transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* ── Center node (the dot on the spine) ── */}
      <div className="absolute left-4 md:left-1/2 top-1 -translate-x-1/2 z-10">
        <span className="relative flex">
          {item.current && (
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${cfg.dot} opacity-60 animate-ping`}
            />
          )}
          <span
            className={`relative inline-flex items-center justify-center h-9 w-9 rounded-full ${cfg.dot} ring-4 ring-background shadow-lg`}
          >
            <Icon className="h-4 w-4 text-white" />
          </span>
        </span>
      </div>

      {/* ── Card ── */}
      <div
        className={`pl-14 md:pl-0 ${
          isLeft
            ? "md:col-start-1 md:pr-4"
            : "md:col-start-2 md:pl-4"
        }`}
      >
        <div
          className={`relative rounded-2xl border border-border/60 bg-card shadow-md hover:shadow-xl transition-shadow duration-300 p-5 md:p-6 border-l-4 ${cfg.line} text-left`}
        >
          {/* Year + category pill */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.chip}`}>
              {item.date}
            </span>
            {item.current && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-foreground text-background flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Now
              </span>
            )}
          </div>

          <h3 className="text-lg md:text-xl font-bold text-foreground leading-snug">
            {item.title}
          </h3>

          {(item.organization || item.location) && (
            <div className="flex items-center gap-3 mt-1.5 text-sm flex-wrap">
              {item.organization && (
                <span className={`font-semibold ${cfg.text}`}>
                  {item.organization}
                </span>
              )}
              {item.location && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {item.location}
                </span>
              )}
            </div>
          )}

          {item.description && (
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const Journey = () => {
  const milestones = getJourney();

  const usedCategories = Array.from(
    new Set(milestones.map((m) => m.category))
  ) as JourneyCategory[];

  return (
    <Layout>
      <Helmet>
        <title>My Journey - TechieTips</title>
        <meta
          name="description"
          content="The career and life timeline of Tharun Kumar Ravikrindhi, from early education to becoming a Senior Data Engineer and Microsoft Fabric Community Super User."
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

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
            My Journey
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The milestones that shaped my path, from where I am today back to
            where it all began.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {usedCategories.map((cat) => {
            const cfg = categoryConfig[cat];
            const Icon = cfg.Icon;
            return (
              <div
                key={cat}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-card"
              >
                <span className={`p-1 rounded-full ${cfg.dot}`}>
                  <Icon className="h-3 w-3 text-white" />
                </span>
                <span className="text-xs font-medium text-foreground">
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Timeline ── */}
        {milestones.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-1">No milestones yet</p>
            <p className="text-sm">Add a markdown file to content/journey/ to begin.</p>
          </div>
        ) : (
          <div>
            {/* Spine + nodes: the line spans only this block, ending at the end dot */}
            <div className="relative pb-3">
              {/* The spine: vertical gradient line (teal at top -> rose at bottom) */}
              <div
                className="absolute top-0 bottom-0 left-4 md:left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-teal-400 via-violet-300 to-rose-300 dark:from-teal-600 dark:via-violet-700 dark:to-rose-700 rounded-full"
                aria-hidden="true"
              />

              {/* Start cap (most recent) */}
              <div className="relative flex md:justify-center mb-10">
                <span className="absolute left-4 md:left-1/2 -translate-x-1/2 top-0 h-3 w-3 rounded-full bg-teal-400 dark:bg-teal-500 ring-4 ring-background" />
              </div>

              {/* Milestones */}
              <div className="space-y-12 md:space-y-16">
                {milestones.map((item, index) => (
                  <TimelineNode key={item.slug} item={item} index={index} />
                ))}
              </div>

              {/* End dot (where it began) */}
              <div className="relative mt-12">
                <span className="absolute left-4 md:left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-rose-400 dark:bg-rose-500 ring-4 ring-background shadow-md" />
              </div>
            </div>

            {/* Closing line, centered below the spine so nothing overlaps */}
            <p className="text-center text-sm text-muted-foreground italic mt-8">
              Where it all began.
            </p>
          </div>
        )}

      </section>
    </Layout>
  );
};

export default Journey;
