---
title: "This One Matrix Setting Can Kill Your Power BI Report Performance"
date: "2025-04-07"
summary: "A real-world scenario where a Power BI report was taking 4+ minutes to load, despite having a lightweight model and basic visuals. How I slashed the load time from 4 minutes to just 3 seconds"
tags: ["Power BI", "Report", "Matrix", "SVG"]
---
Recently, I came across a Power BI report page that took over 3 to 4 minutes to load. I began investigating and got some interesting findings. In this blog, I’m going to share what I discovered.

To reproduce the scenario, I created a PBIX file and loaded a few high-resolution stock images taken from [Kaggle](https://www.kaggle.com/datasets/anandaramg/unsplash-image-download-data).

Then, I created a simple Matrix visual to display basic information about each image, such as the photographer’s name, the number of times the image had been downloaded from the platform, and how many times it had been viewed.

I published this report to the Power BI Service and tried opening it. It took around 52 seconds to load.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*R2K-QiZMBvtXqIgI)
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*OTiF3hWWBYk2wgML)

Let’s see if we can reduce this time.

Everything seemed normal in the semantic model:

*   PBIX file size: 95 MB
*   Data volume: Barely 25,000 rows
*   Measures: Only 3, all with simple logic
*   Relationships: Just one — a straightforward one-to-many
*   Custom visuals: None
*   Hosting environment: F64 (P1) capacity

I converted the PBIX file into PBIP format to peek into the underlying files. That’s when I noticed something odd:

The report.json file — which normally holds layout and visual metadata — was 46 MB.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*CF6VO3bC7UgwhtjZ)

For a report with just:

*   One page
*   One Matrix visual
*   One text box

…this file size made no sense.

Looking deeper into the Matrix visual container, I found Base64-encoded image strings embedded directly within the file.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*CAEEvILKNtVWKX1P)

Isn’t that strange?

The report.json file should contain metadata about the report — like pages, bookmarks, themes, visuals, and their configurations. However, in this case, it was storing actual data.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*m2cK3cpcymbes-PD)

After multiple experiments, I traced the issue to one very specific setting:

The problem occurred only when the “Auto-size width” option was disabled in the Matrix visual.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*MFCiZl1DGdQKYTnQ)

Disabling this option means we are fixing the width of each column and not allowing it to auto-adjust. I suspect this causes Power BI to store every value in the “Columns” field of the Matrix visual — including Base64 strings, which are very large.

When this setting is turned off, Power BI remembers the width of every individual column value. If your column contains Base64-encoded images, Power BI stores these massive strings in the report definition itself — which explains the inflated report.json file.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*n5oFZQZzYPowrIDr)

But when I re-enabled Auto-size width, the file size dropped dramatically.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*gLnwUIljTQe6p1Vj)

**Results**

*   Old report.json size: 46 MB, rendering duration — 52 seconds
*   New report.json size: 5 KB, rendering duration — 7 seconds

And, of course, it no longer stores Base64 strings inside the file.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*d00n_qSSW2jgHQHzF6JGkA.png)

**Final Recommendations**

1.  Avoid disabling the Auto-size width option Not only does this prevent your data from being saved in the report.json file, but it also improves performance. There’s another critical reason: files with embedded Base64 data do not support Microsoft Purview sensitivity labels. If you are working with sensitive data, storing it in a file without protection labels can pose a security risk.
2.  If disabling Auto-size width is necessary and if you’re okay with embedding data inside report.json, then avoid placing Base64 columns in the “Columns” section of the Matrix visual. Instead, you can: Place a simpler (non-Base64) column in the “Columns” field Move the Base64 column to the “Values” field (after applying an aggregation) Or use it in the Row headers field

I hope this blog adds some value to your knowledge. Let me know your thoughts.

Happy Learning!!!