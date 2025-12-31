---
title: "SVG based Power BI Semantic Model Columns and Measures are great but there is a Problem!"
date: "2025-01-05"
summary: "The ability to use SVG specifications in Power BI opens up endless possibilities for creating stunning visuals. However, there are a few challenges you might face. "
tags: ["Power BI", "Report", "SVG"]
---
SVG specifications in semantic model measures and columns can help you bypass a few limitations of Power BI’s default visualizations, enabling the creation of insightful and customised visualizations. Here are some examples of how SVGs can be incredibly useful:

## Example 1:

Suppose you want to use a font and animation that Power BI does not natively support. By creating SVG specifications, you can apply unique fonts and other design elements that elevate your visualizations and make them more engaging.

For instance,

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*pwk-snnJh9gvihQIfteW-w.gif)

## Example 2:

You’re presenting enrolled date, completed dates, current date and expiry date of a learning course in a table or matrix, adding an SVG-based timeline bar can convey the information more effectively. Instead of showing plain dates, a visual timeline helps users immediately grasp the duration and sequence of events without needing additional explanations.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*neOHR7bD2Sj0rUz4)

Each icon represents an event

![captionless image](https://miro.medium.com/v2/resize:fit:1276/format:webp/0*n0e7HPLnIEvTCaMD)

While SVG specifications open up exciting possibilities — enabling unique customization and enhanced insights — they also introduce challenges that could hinder the user experience. Let’s explore two significant problems and their respective solutions:

## Problem 1: Tooltip Displays SVG Code in Matrix Visuals

When you use SVG-based columns or measures in a matrix visual, hovering over them often displays the SVG code in the tooltip. This can be confusing and unintuitive for end users, as they might not understand the raw SVG specifications being displayed.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*u0Jz6YDh9Vg9GO00)

## Solution

1. Use Custom Tooltips: Create a report page to serve as a tooltip, which will replace the default tooltip with a more informative and user-friendly alternative. Custom tooltips can show relevant insights instead of the SVG code.

2. Disable the tooltip : If custom tooltips are causing performance issues, consider disabling the tooltip. This will eliminate tooltips entirely, ensuring the SVG code is not displayed to end users. While this removes additional information that tooltips might provide, it keeps the visualization clean and intuitive.

‘Format your Visual’ -> General -> Tooltip

![captionless image](https://miro.medium.com/v2/resize:fit:680/format:webp/0*aNZe0jO175W8ibVk)

You can also solve this problem by making the background colour of the tooltip 100% transparent.

## Problem 2: SVG Code Appears in Exported Data

When exporting a matrix or table visual that includes SVG-based measures or columns, the exported data contains the raw SVG code. This is not user-friendly and can be especially problematic for stakeholders who are unfamiliar with SVG specifications.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*idLV5woG5hnQpvHD)

Unfortunately there is no proper solution for this problem, you have to train the report users to ignore the SVG code. There might be few scenarios where this would become even more problematic. For example: When you add a column created with SVG specifications into a table visual

![captionless image](https://miro.medium.com/v2/resize:fit:836/format:webp/0*EkEaXUeJleeBAOS9)

And when you try exporting this visual then it will only have one column with the SVG code

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*_2zdKaQm9e-fVSxy)

One possible workaround would be adding the actual column along with the SVG based custom column

![captionless image](https://miro.medium.com/v2/resize:fit:1076/format:webp/0*ri9ru_ES3eMFo0JC)

And hide it some how, as you can see I disabled the text wrap and reduced the width of this column as much as possible

![captionless image](https://miro.medium.com/v2/resize:fit:832/format:webp/0*mAT-t_R-xf2xXR0Y)

It would appear like this and after exporting the data from this visual user will find both the SVG based custom column and the actual column.

![captionless image](https://miro.medium.com/v2/resize:fit:832/format:webp/0*7lfetrN-ZPmNfdsO)

It’s important to note that SVGs based columns and measures need to be categorized as Image URLs. This means they can only be used in visuals that support images, such as matrix, table and the new card visual — not in all visual types.

For more information how to create use SVG based measures and columns then I would highly recommend watching this [video](https://www.youtube.com/watch?v=JG5EbW1wr70) posted by SQL BI YouTube channel.

Have you been using SVGs in your Power BI reports? If yes, how are you tackling the two problems stated above? I would love to learn from your experiences! Please share your thoughts and solutions in the comments below.

Happy Learning!!!