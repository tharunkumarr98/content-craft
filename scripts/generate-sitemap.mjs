/**
 * Sitemap generator — run automatically before every production build.
 *
 * Set VITE_SITE_URL in your .env or Vercel environment variables:
 *   VITE_SITE_URL=https://your-domain.com
 *
 * Output: public/sitemap.xml
 */

import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT      = resolve(__dirname, "..");
const SITE_URL  = process.env.VITE_SITE_URL?.replace(/\/$/, "") || "https://techietips.dev";

// Static routes (always in sitemap)
const staticRoutes = [
  { path: "/",             priority: "1.0", changefreq: "weekly"  },
  { path: "/articles",     priority: "0.9", changefreq: "weekly"  },
  { path: "/tips",         priority: "0.9", changefreq: "weekly"  },
  { path: "/dashboards",   priority: "0.8", changefreq: "monthly" },
  { path: "/about",        priority: "0.7", changefreq: "monthly" },
  { path: "/achievements", priority: "0.7", changefreq: "monthly" },
  { path: "/journey",      priority: "0.6", changefreq: "monthly" },
  { path: "/newsletter",   priority: "0.6", changefreq: "monthly" },
];

// Read all markdown files from a content directory and return slug + date
function readContentDir(dir, prefix) {
  const fullPath = resolve(ROOT, "content", dir);
  let files;
  try {
    files = readdirSync(fullPath).filter(f => f.endsWith(".md"));
  } catch {
    return [];
  }

  return files.map(file => {
    const slug = file.replace(".md", "");
    let date   = new Date().toISOString().split("T")[0];
    try {
      const raw = readFileSync(join(fullPath, file), "utf-8");
      const match = raw.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})["']?/m);
      if (match) date = match[1];
    } catch { /* skip */ }
    return { path: `/${prefix}/${slug}`, date, priority: "0.8", changefreq: "monthly" };
  });
}

const dynamicRoutes = [
  ...readContentDir("articles",     "articles"),
  ...readContentDir("tips",         "tips"),
  ...readContentDir("dashboards",   "dashboards"),
];

const today = new Date().toISOString().split("T")[0];

const urlEntries = [
  ...staticRoutes.map(r => ({
    loc:        `${SITE_URL}${r.path}`,
    lastmod:    today,
    changefreq: r.changefreq,
    priority:   r.priority,
  })),
  ...dynamicRoutes.map(r => ({
    loc:        `${SITE_URL}${r.path}`,
    lastmod:    r.date,
    changefreq: r.changefreq,
    priority:   r.priority,
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

writeFileSync(resolve(ROOT, "public", "sitemap.xml"), xml, "utf-8");
console.log(`Sitemap generated: ${urlEntries.length} URLs -> public/sitemap.xml`);
