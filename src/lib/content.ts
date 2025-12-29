import fm from 'front-matter';

export type ContentType = 'article' | 'tip' | 'dashboard';

export interface ContentItem {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  readingTime: number;
  content: string;
  type: ContentType;
  // Dashboard-specific
  embedUrl?: string;
}

// Import all markdown files from content directories at build time
const articleModules = import.meta.glob("/content/articles/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const tipModules = import.meta.glob("/content/tips/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const dashboardModules = import.meta.glob("/content/dashboards/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

// Calculate reading time based on word count
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Parse content items from markdown files
function parseContentItems(
  modules: Record<string, unknown>,
  type: ContentType,
  pathPrefix: string
): ContentItem[] {
  const items: ContentItem[] = [];

  for (const [path, rawContent] of Object.entries(modules)) {
    const content = rawContent as string;
    const slug = path.replace(pathPrefix, "").replace(".md", "");
    
    try {
      const { attributes, body } = fm<any>(content);
      const data = attributes;
      const markdownContent = body;
      
      items.push({
        slug,
        title: data.title || "Untitled",
        date: data.date || new Date().toISOString().split("T")[0],
        summary: data.summary || "",
        tags: data.tags || [],
        readingTime: data.readingTime || calculateReadingTime(markdownContent),
        content: markdownContent,
        type,
        embedUrl: data.embedUrl,
      });
    } catch (error) {
      console.error(`Error parsing ${path}:`, error);
    }
  }

  // Sort by date descending
  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Cached content
let cachedArticles: ContentItem[] | null = null;
let cachedTips: ContentItem[] | null = null;
let cachedDashboards: ContentItem[] | null = null;

export function getArticles(): ContentItem[] {
  if (!cachedArticles) {
    cachedArticles = parseContentItems(articleModules, 'article', "/content/articles/");
  }
  return cachedArticles;
}

export function getTips(): ContentItem[] {
  if (!cachedTips) {
    cachedTips = parseContentItems(tipModules, 'tip', "/content/tips/");
  }
  return cachedTips;
}

export function getDashboards(): ContentItem[] {
  if (!cachedDashboards) {
    cachedDashboards = parseContentItems(dashboardModules, 'dashboard', "/content/dashboards/");
  }
  return cachedDashboards;
}

export function getAllContent(): ContentItem[] {
  return [...getArticles(), ...getTips(), ...getDashboards()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getContentBySlug(slug: string, type?: ContentType): ContentItem | undefined {
  if (type === 'article') return getArticles().find((item) => item.slug === slug);
  if (type === 'tip') return getTips().find((item) => item.slug === slug);
  if (type === 'dashboard') return getDashboards().find((item) => item.slug === slug);
  return getAllContent().find((item) => item.slug === slug);
}

export function getContentByType(type: ContentType): ContentItem[] {
  if (type === 'article') return getArticles();
  if (type === 'tip') return getTips();
  if (type === 'dashboard') return getDashboards();
  return [];
}

// Get primary tags (first tag) for a content type
export function getPrimaryTags(type: ContentType): string[] {
  const items = getContentByType(type);
  const tags = new Set<string>();
  items.forEach((item) => {
    if (item.tags.length > 0) {
      tags.add(item.tags[0]);
    }
  });
  return Array.from(tags).sort();
}

// Get content by primary tag (first tag must match)
export function getContentByPrimaryTag(type: ContentType, tag: string): ContentItem[] {
  return getContentByType(type).filter((item) => item.tags[0] === tag);
}

// Get all unique tags for a content type
export function getAllTagsForType(type: ContentType): string[] {
  const items = getContentByType(type);
  const tags = new Set<string>();
  items.forEach((item) => item.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

// Legacy support - keep these for backward compatibility
export function getAllPosts(): ContentItem[] {
  return getArticles();
}

export function getPostBySlug(slug: string): ContentItem | undefined {
  return getContentBySlug(slug, 'article');
}

export function getPostsByTag(tag: string): ContentItem[] {
  return getArticles().filter((item) => item.tags.includes(tag));
}

export function getAllTags(): string[] {
  return getAllTagsForType('article');
}
