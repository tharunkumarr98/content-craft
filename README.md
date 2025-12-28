# TechieTips - Technical Blog

A clean, minimal, developer-focused blog built with React, Vite, and Tailwind CSS.

## Adding a New Blog Post

Simply create a new Markdown file in the `content/blog/` folder:

```
content/blog/my-new-post.md
```

### Frontmatter Format

Each post must include frontmatter at the top:

```markdown
---
title: "Your Post Title"
date: "2025-01-12"
summary: "A brief description of your post."
tags: ["Power BI", "DAX"]
---

Your markdown content starts here...
```

**That's it!** The post will automatically appear on the site. No code changes needed.

## Adding Images to Blog Posts

1. Place images in `public/images/blog/`:
   ```
   public/images/blog/my-image.png
   ```

2. Reference in Markdown:
   ```markdown
   ![Alt text](my-image.png)
   ```

   Or with full path:
   ```markdown
   ![Alt text](/images/blog/my-image.png)
   ```

Images are automatically:
- Responsive (max-width: 100%)
- Lazy loaded
- Styled with rounded corners and shadows

## Folder Structure

```
├── content/
│   └── blog/                    # Blog posts (.md files)
│       ├── my-first-post.md
│       └── another-post.md
├── public/
│   └── images/
│       └── blog/                # Blog images
├── src/
│   ├── components/              # React components
│   ├── lib/
│   │   └── blog.ts              # Blog loader (auto-discovers posts)
│   └── pages/                   # Page components
└── README.md
```

## Supported Code Languages

The blog supports syntax highlighting for:
- `sql` - SQL queries
- `dax` - DAX formulas  
- `powerquery` or `m` - Power Query M language
- `python` - Python code
- `javascript`, `typescript`, `json`, etc.

## Deploying to GitHub Pages

### Option 1: GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Configuration

Add to `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})
```

### Option 2: Manual Deployment

```bash
npm run build
# Upload dist/ folder to your hosting
```

## Development

```bash
npm install      # Install dependencies
npm run dev      # Start dev server
npm run build    # Build for production
```

## Features

- ✅ Markdown blog posts with frontmatter
- ✅ Syntax highlighting (SQL, DAX, Power Query, Python)
- ✅ Auto-generated table of contents
- ✅ Tag-based filtering
- ✅ Reading time estimates
- ✅ RSS feed
- ✅ Newsletter section
- ✅ SEO-optimized
- ✅ Fully responsive
- ✅ Images in blog posts
