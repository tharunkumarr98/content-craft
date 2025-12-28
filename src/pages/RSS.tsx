import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import Layout from "@/components/Layout";
import { getAllPosts } from "@/data/posts";

const RSS = () => {
  const [copied, setCopied] = useState(false);
  const posts = getAllPosts();
  
  // Generate RSS XML content
  const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DataBytes</title>
    <link>https://yourdomain.com</link>
    <description>Technical insights on Microsoft Fabric, Power BI, and data analytics</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://yourdomain.com/rss.xml" rel="self" type="application/rss+xml"/>
${posts.map(post => `    <item>
      <title>${post.title}</title>
      <link>https://yourdomain.com/blog/${post.slug}</link>
      <description>${post.summary}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>https://yourdomain.com/blog/${post.slug}</guid>
    </item>`).join('\n')}
  </channel>
</rss>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(rssContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <Helmet>
        <title>RSS Feed - DataBytes</title>
        <meta name="description" content="Subscribe to DataBytes RSS feed for the latest articles on data analytics." />
      </Helmet>
      
      <section className="container py-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          RSS Feed
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Subscribe to receive new articles in your favorite RSS reader.
        </p>
        
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Feed URL</h2>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy XML
                </>
              )}
            </button>
          </div>
          
          <code className="block bg-muted p-3 rounded text-sm text-muted-foreground break-all">
            https://yourdomain.com/rss.xml
          </code>
        </div>
        
        <div className="bg-muted rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">Latest in Feed</h3>
          <ul className="space-y-3">
            {posts.slice(0, 5).map(post => (
              <li key={post.slug}>
                <Link 
                  to={`/blog/${post.slug}`}
                  className="text-primary hover:underline"
                >
                  {post.title}
                </Link>
                <span className="text-muted-foreground text-sm ml-2">
                  {new Date(post.date).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  );
};

export default RSS;
