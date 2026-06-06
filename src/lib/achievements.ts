import fm from 'front-matter';

export type AchievementType = "certification" | "award" | "community" | "appreciation";

export interface AchievementItem {
  slug: string;
  type: AchievementType;
  title: string;
  date: string;
  description: string;
  link?: string;
  issuer?: string;
  platform?: string;
  excerpt?: string;
  from?: string;
}

// ─── How to add a new achievement ────────────────────────────────────────────
//
// Create a markdown file in /content/achievements/<slug>.md with this format:
//
//   ---
//   title: "Achievement title"
//   type: certification | award | community | appreciation
//   date: "YYYY-MM-DD"
//   issuer: "Organization name"        # certifications & awards
//   link: "https://..."                # verify / post URL
//   platform: "LinkedIn"               # community & appreciation
//   from: "Name, Role"                 # community & appreciation
//   ---
//
//   The markdown body is the description (certifications/awards)
//   or the displayed quote/excerpt (community/appreciation).
//
// ─────────────────────────────────────────────────────────────────────────────

const achievementModules = import.meta.glob("/content/achievements/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

function parseAchievements(): AchievementItem[] {
  const items: AchievementItem[] = [];

  for (const [path, rawContent] of Object.entries(achievementModules)) {
    const content = rawContent as string;
    const slug = path.replace("/content/achievements/", "").replace(".md", "");

    try {
      const { attributes, body } = fm<any>(content);
      const trimmedBody = body.trim();

      items.push({
        slug,
        type: attributes.type as AchievementType,
        title: attributes.title || "Untitled",
        date: attributes.date || new Date().toISOString().split("T")[0],
        description: trimmedBody,
        link: attributes.link,
        issuer: attributes.issuer,
        platform: attributes.platform,
        from: attributes.from,
        // For community/appreciation: use frontmatter excerpt if set,
        // otherwise fall back to the markdown body.
        excerpt: attributes.excerpt || (
          (attributes.type === "community" || attributes.type === "appreciation")
            ? trimmedBody
            : undefined
        ),
      });
    } catch (err) {
      console.error(`Error parsing achievement ${path}:`, err);
    }
  }

  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

let cached: AchievementItem[] | null = null;

export function getAchievements(): AchievementItem[] {
  if (!cached) cached = parseAchievements();
  return cached;
}
