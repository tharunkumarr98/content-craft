# TechieTips - Technical Knowledge Hub

A clean, minimal, developer-focused technical blog with three content types: Articles, Tips & Tricks, and Dashboards.

Built with React, Vite, and Tailwind CSS.

---

## Table of Contents

- [Content Types](#content-types)
- [Adding an Article](#adding-an-article)
- [Adding a Tip & Trick](#adding-a-tip--trick)
- [Adding a Dashboard](#adding-a-dashboard)
- [Tagging System](#tagging-system)
- [Images & Icons](#images--icons)
- [Newsletter Subscription](#newsletter-subscription)
- [Deployment](#deployment)
- [Development](#development)

---

## Content Types

| Type | Purpose | Location |
|------|---------|----------|
| **Articles** | Long-form technical blogs | `/content/articles/` |
| **Tips & Tricks** | Short, concise quick wins | `/content/tips/` |
| **Dashboards** | Portfolio with embedded Power BI | `/content/dashboards/` |

---

## Adding an Article

Articles are long-form technical content with code examples, images, and in-depth explanations.

### Step 1: Create the File

Create a new Markdown file in `/content/articles/`:

```
content/articles/my-article-slug.md
```

**Naming convention**: Use lowercase, hyphens for spaces (e.g., `understanding-dax-context.md`)

### Step 2: Add Frontmatter

Every article **must** start with frontmatter:

```markdown
---
title: "Understanding Context Transition in DAX"
date: "2025-01-15"
summary: "A deep dive into row context vs filter context in Power BI."
tags: ["Power BI", "DAX", "Data Modeling"]
---

Your article content starts here...
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | ✅ Yes | Article title (displayed on cards and page) |
| `date` | ✅ Yes | Publication date in `YYYY-MM-DD` format |
| `summary` | ✅ Yes | Brief description (shown on listing cards) |
| `tags` | ✅ Yes | Array of tags (first tag = primary tag) |

### Step 3: Write Content

Use standard Markdown:

```markdown
## Introduction

This is a paragraph with **bold** and *italic* text.

### Code Examples

Use fenced code blocks with language identifiers:

```sql
SELECT CustomerName, SUM(Revenue)
FROM Sales
GROUP BY CustomerName
```

```dax
Total Sales = SUMX(Sales, Sales[Quantity] * Sales[Price])
```

```powerquery
let
    Source = Excel.Workbook(File.Contents("data.xlsx"))
in
    Source
```

### Supported Languages

- `sql` - SQL queries
- `dax` - DAX formulas
- `powerquery` or `m` - Power Query M
- `python` - Python
- `powershell` - PowerShell
- `kql` - Kusto Query Language
- `bash` or `shell` - CLI commands
- `javascript`, `typescript`, `json`
```

### Step 4: Add Images (Optional)

See [Images & Icons](#images--icons) section below.

### What Happens After Commit

1. Push your `.md` file to the repo
2. Site automatically discovers the new article
3. Article appears on Articles page and Home page
4. Tags are indexed for filtering
5. Reading time is calculated automatically
6. Table of contents is generated from headings

**No code changes required!**

---

## Adding a Tip & Trick

Tips are short, focused posts for quick wins, patterns, and shortcuts.

### Difference from Articles

| Aspect | Articles | Tips & Tricks |
|--------|----------|---------------|
| Length | 500-3000+ words | 100-500 words |
| Purpose | Deep dives, tutorials | Quick reference, patterns |
| Structure | Multiple sections | One main point |

### Step 1: Create the File

```
content/tips/my-tip-slug.md
```

### Step 2: Add Frontmatter

```markdown
---
title: "DAX Running Total Pattern"
date: "2025-01-15"
summary: "Quick pattern for cumulative totals in Power BI."
tags: ["DAX", "Power BI"]
---

Here's a quick pattern for running totals:

```dax
Running Total = 
CALCULATE(
    [Total Sales],
    FILTER(
        ALL('Date'),
        'Date'[Date] <= MAX('Date'[Date])
    )
)
```

**Pro tip**: Use ALLSELECTED() if you need to respect slicer context.
```

### Navigation Behavior

- Tips appear on the "Tips & Tricks" tab on the home page
- Filtered by primary tag (first tag in array)
- Clicking opens the full tip with contact CTA

---

## Adding a Dashboard

Dashboards are portfolio items showcasing embedded Power BI reports or other visualizations.

### Step 1: Create the File

```
content/dashboards/my-dashboard.md
```

### Step 2: Add Frontmatter with Embed URL

```markdown
---
title: "Sales Performance Dashboard"
date: "2025-01-15"
summary: "Executive-level sales analytics with drill-through capabilities."
tags: ["Power BI", "Sales", "Executive Reporting"]
embedUrl: "https://app.powerbi.com/view?r=YOUR_EMBED_TOKEN"
---

## Overview

This dashboard provides real-time sales analytics...

## Features

- Revenue trends by region
- Product performance analysis
- Customer segmentation

## Technical Details

Built with Power BI, connected to Azure SQL Database.
```

| Field | Required | Description |
|-------|----------|-------------|
| `embedUrl` | ✅ Yes | Full Power BI embed URL or iframe src |

### Getting Your Embed URL

1. Open your Power BI report
2. Click **File** → **Embed report** → **Website or portal**
3. Copy the embed URL
4. Paste into `embedUrl` field

### Rendering Behavior

- Dashboard cards show on the "Dashboards" tab
- Clicking opens full page with embedded iframe
- Iframe is responsive and fills content area
- Markdown content appears below the embed

---

## Tagging System

Tags are critical for content organization and filtering.

### Primary vs Secondary Tags

```markdown
tags: ["Power BI", "DAX", "Data Modeling"]
        ↑ Primary    ↑ Secondary tags
```

| Tag Position | Name | Filtering Behavior |
|--------------|------|-------------------|
| First tag | **Primary Tag** | Used for first-level filtering on listing pages |
| Other tags | **Secondary Tags** | Visible on content cards, not used for filtering |

### How Tags Affect Navigation

#### Home Page
- Content toggle: Articles / Tips & Tricks / Dashboards
- Below toggle: Primary tags appear as filter chips
- Only first tags from each content item are shown

#### Filtering Example

```
Content items:
1. ["Power BI", "DAX"] → Primary: Power BI
2. ["Power BI", "Power Query"] → Primary: Power BI
3. ["SQL", "Performance"] → Primary: SQL
4. ["Python", "Pandas"] → Primary: Python

Filter chips shown: Power BI, SQL, Python
Clicking "Power BI" → Shows items 1 and 2
```

### Best Practices

1. **Primary tag** = Main technology or category
2. **Secondary tags** = Specific topics, techniques
3. Keep tags consistent across content (use same spelling)
4. 2-4 tags per content item is ideal

---

## Images & Icons

### Blog Images

Store images for articles and tips in:

```
public/images/blog/
```

**Folder structure example:**

```
public/
└── images/
    └── blog/
        ├── dax-context-diagram.png
        ├── power-query-flow.png
        └── my-article/
            ├── step-1.png
            └── step-2.png
```

**Reference in Markdown:**

```markdown
![DAX Context Diagram](/images/blog/dax-context-diagram.png)

![Step 1](/images/blog/my-article/step-1.png)
```

**Naming best practices:**
- Use lowercase
- Use hyphens for spaces
- Be descriptive: `sales-dashboard-filter-panel.png`
- Group related images in subfolders

### Tech Icons (Home Page Cloud)

The dynamic tech cloud on the home page automatically reads from:

```
public/icons/
```

**To add a new technology icon:**

1. Add an SVG or PNG file:
   ```
   public/icons/Power BI.svg
   public/icons/Python.svg
   ```

2. **That's it!** The icon appears automatically in the tech cloud.

**Supported formats:** `.svg`, `.png`, `.jpg`, `.jpeg`, `.webp`

**Naming:** File name (without extension) becomes the display label.

---

## Newsletter Subscription

### Current Behavior

The newsletter form is a UI placeholder. Email collection requires backend functionality.

### Options for Implementation

1. **Manual collection**: Form shows success, you manually note emails from form submissions
2. **Third-party service**: Integrate Mailchimp, ConvertKit, etc.
3. **GitHub-based**: Requires GitHub Actions or serverless function

### File Location (if implemented)

```
data/subscribers.json
```

**Format:**
```json
{
  "subscribers": [
    { "email": "user@example.com", "date": "2025-01-15" }
  ]
}
```

**Note:** True GitHub-based storage requires server-side logic (GitHub API with token).

---

## Deployment

### GitHub Pages (Recommended)

#### Step 1: Configure Base Path

In `vite.config.ts`, set your repo name:

```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ...
})
```

#### Step 2: GitHub Actions Workflow

The workflow at `.github/workflows/deploy.yml` handles automatic deployment:

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

#### Step 3: Enable GitHub Pages

1. Go to repo **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** / **root**

### Deployment Flow

```
main branch → Push changes → GitHub Actions builds → Deploys to gh-pages → Live site updates
```

**What to modify:**
- Content files in `/content/`
- Images in `/public/images/`
- Icons in `/public/icons/`

**What NOT to modify (unless necessary):**
- `src/` components
- `vite.config.ts` (after initial setup)
- Build configuration

---

## Development

### Local Setup

```bash
npm install      # Install dependencies
npm run dev      # Start dev server at localhost:8080
npm run build    # Build for production
npm run preview  # Preview production build
```

### Project Structure

```
├── content/
│   ├── articles/          # Long-form articles (.md)
│   ├── tips/              # Tips & tricks (.md)
│   └── dashboards/        # Dashboard entries (.md)
├── public/
│   ├── icons/             # Tech icons for home page cloud
│   └── images/
│       └── blog/          # Blog post images
├── src/
│   ├── components/        # React components
│   ├── lib/
│   │   └── content.ts     # Content loader (auto-discovers files)
│   └── pages/             # Page components
└── README.md
```

### Features

- ✅ Three content types (Articles, Tips, Dashboards)
- ✅ Markdown with frontmatter
- ✅ Syntax highlighting (SQL, DAX, Power Query, Python, etc.)
- ✅ Auto-generated table of contents
- ✅ Primary tag filtering
- ✅ Reading time estimates
- ✅ Embedded Power BI dashboards
- ✅ Dynamic tech icon cloud
- ✅ Contact CTA on all content
- ✅ SEO-optimized
- ✅ Fully responsive
- ✅ Copy button on code blocks

---

## Quick Reference

| Task | Action |
|------|--------|
| Add article | Create `.md` in `/content/articles/` |
| Add tip | Create `.md` in `/content/tips/` |
| Add dashboard | Create `.md` in `/content/dashboards/` with `embedUrl` |
| Add image | Put in `/public/images/blog/`, reference as `/images/blog/filename.png` |
| Add tech icon | Put SVG/PNG in `/public/icons/` |
| Deploy | Push to `main` branch |

**Zero code changes required for content updates!**
