// REMOVE THIS:
// import matter from 'gray-matter';

// ADD THIS:
import fm from 'front-matter';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  readingTime: number;
  content: string;
}

// Import all markdown files from the content/blog directory at build time
const blogModules = import.meta.glob("/content/blog/*.md", {
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

// Parse all blog posts from markdown files
function parseBlogPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const [path, rawContent] of Object.entries(blogModules)) {
    const content = rawContent as string;
    const slug = path.replace("/content/blog/", "").replace(".md", "");
    
    try {
      //const { data, content: markdownContent } = matter(content);
      // --- CHANGE START ---
      // front-matter returns an object with 'attributes' and 'body'
      const { attributes, body } = fm<any>(rawString);
      const data = attributes;
      const markdownContent = body;
      // --- CHANGE END ---
      
      posts.push({
        slug,
        title: data.title || "Untitled",
        date: data.date || new Date().toISOString().split("T")[0],
        summary: data.summary || "",
        tags: data.tags || [],
        readingTime: data.readingTime || calculateReadingTime(markdownContent),
        content: markdownContent,
      });
    } catch (error) {
      console.error(`Error parsing ${path}:`, error);
    }
  }

  // Sort by date descending
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Cached posts
let cachedPosts: BlogPost[] | null = null;

export function getAllPosts(): BlogPost[] {
  if (!cachedPosts) {
    cachedPosts = parseBlogPosts();
  }
  return cachedPosts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  getAllPosts().forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}
