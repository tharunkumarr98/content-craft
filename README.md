# DataBytes - Technical Blog

A clean, minimal, developer-focused blog built with React, Vite, and Tailwind CSS.

## Features

- 📝 **Markdown blog posts** with frontmatter metadata
- 🎨 **Syntax highlighting** for SQL, DAX, Power Query (M), Python, and more
- 📑 **Auto-generated table of contents** for each post
- 🏷️ **Tag-based filtering** for easy navigation
- ⏱️ **Reading time estimates** on each post
- 📧 **Newsletter subscription** section
- 📡 **RSS feed** for subscribers
- 🔍 **SEO-optimized** with proper meta tags
- 📱 **Fully responsive** design

## Adding a New Blog Post

1. Open `src/data/posts.ts`
2. Add a new post object to the `posts` array:

```typescript
{
  slug: "my-new-post", // URL-friendly identifier
  title: "My New Post Title",
  date: "2024-12-28", // YYYY-MM-DD format
  summary: "A brief summary of the post (shown in listings)",
  tags: ["SQL", "Tutorial"], // Choose relevant tags
  readingTime: 10, // Estimated minutes to read
  content: `
Your markdown content goes here...

## Subheading

Regular paragraphs.

\`\`\`sql
SELECT * FROM table;
\`\`\`
`
}
```

3. The post will automatically appear on the home page and blog listing.

## Supported Code Languages

The blog supports syntax highlighting for:
- `sql` - SQL queries
- `dax` - DAX formulas
- `powerquery` or `m` - Power Query M language
- `python` - Python code
- `javascript`, `typescript`, `json`, etc.

## Project Structure

```
src/
├── components/
│   ├── ui/           # Shadcn UI components
│   ├── BlogCard.tsx  # Post preview card
│   ├── CodeBlock.tsx # Syntax highlighted code
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Layout.tsx
│   ├── MarkdownRenderer.tsx
│   ├── Newsletter.tsx
│   ├── TableOfContents.tsx
│   └── TagBadge.tsx
├── data/
│   └── posts.ts      # Blog post content
├── pages/
│   ├── About.tsx
│   ├── Blog.tsx
│   ├── BlogPost.tsx
│   ├── Index.tsx
│   └── RSS.tsx
└── App.tsx
```

## Deploying to GitHub Pages

### Option 1: Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. The `dist` folder contains the static files ready for deployment.

3. Push the `dist` folder to the `gh-pages` branch of your repository.

### Option 2: GitHub Actions (Recommended)

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

### Configuration for GitHub Pages

Add to `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/your-repo-name/', // Add this line
  // ... rest of config
})
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Customization

### Colors & Theme
Edit `src/index.css` to modify the color scheme. The blog uses CSS custom properties for easy theming.

### Fonts
The blog uses Inter for body text and JetBrains Mono for code. Modify the font imports in `src/index.css`.

### Site Name
Update the site name in:
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- Page titles in each page component

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **react-markdown** - Markdown rendering
- **react-syntax-highlighter** - Code highlighting
- **react-router-dom** - Routing
- **react-helmet-async** - SEO meta tags

## License

MIT
