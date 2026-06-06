import fm from 'front-matter';

export type JourneyCategory = "birth" | "education" | "career";

export interface JourneyItem {
  slug: string;
  category: JourneyCategory;
  title: string;
  /** Display date, e.g. "1998", "May 2016", "2020 - Present" */
  date: string;
  /** ISO date used purely for chronological sorting (YYYY-MM-DD) */
  sortDate: string;
  organization?: string;
  location?: string;
  description: string;
  /** Marks this as the current / latest milestone (gets a pulsing "Now" node) */
  current?: boolean;
}

// ─── How to add or edit a journey milestone ──────────────────────────────────
//
// Create a markdown file in /content/journey/<slug>.md:
//
//   ---
//   title: "Joined Tiger Analytics"
//   category: career | education | birth
//   date: "2022 - Present"        # free text shown on the card
//   sortDate: "2022-06-01"        # YYYY-MM-DD, used only for ordering
//   organization: "Tiger Analytics"
//   location: "Hyderabad, India"
//   current: true                 # optional, adds a pulsing "Now" marker
//   ---
//   One or two sentences describing this milestone.
//
// Items are sorted newest -> oldest by sortDate, so the timeline reads
// top-to-bottom from today back to where it began.
//
// ─────────────────────────────────────────────────────────────────────────────

const VALID_CATEGORIES: JourneyCategory[] = ["birth", "education", "career"];

/** Coerce any frontmatter value into a valid category; default to "career". */
function normalizeCategory(value: unknown): JourneyCategory {
  const v = String(value ?? "").trim().toLowerCase();
  return (VALID_CATEGORIES as string[]).includes(v)
    ? (v as JourneyCategory)
    : "career";
}

const journeyModules = import.meta.glob("/content/journey/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

function parseJourney(): JourneyItem[] {
  const items: JourneyItem[] = [];

  for (const [path, rawContent] of Object.entries(journeyModules)) {
    const content = rawContent as string;
    const slug = path.replace("/content/journey/", "").replace(".md", "");

    try {
      const { attributes, body } = fm<any>(content);
      items.push({
        slug,
        category: normalizeCategory(attributes.category),
        title: attributes.title || "Untitled",
        date: attributes.date || "",
        sortDate:
          attributes.sortDate ||
          attributes.date ||
          new Date().toISOString().split("T")[0],
        organization: attributes.organization,
        location: attributes.location,
        description: body.trim(),
        current: attributes.current === true || attributes.current === "true",
      });
    } catch (err) {
      console.error(`Error parsing journey milestone ${path}:`, err);
    }
  }

  // Newest first so the timeline flows present -> birth (top to bottom)
  return items.sort(
    (a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime()
  );
}

let cached: JourneyItem[] | null = null;

export function getJourney(): JourneyItem[] {
  if (!cached) cached = parseJourney();
  return cached;
}
