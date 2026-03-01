---
title: "Unlock Unlimited Fonts in Power BI — No Installs, No Custom Visuals, No Theme Changes"
date: "2026-02-28"
summary: "I show how to unlock unlimited fonts in Power BI using SVG and embedded WOFF2 — no installs, no custom visuals, no theme modifications."
tags: ["Power BI", "Report", "Custom Fonts"]
---
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*lgSsuKdGeR6uAZyBpJ7sbg.png)



We all know that Power BI provides only a limited set of built-in fonts. To overcome this limitation, report developers often install custom fonts locally and modify the theme JSON file to use them.

However, this approach introduces a significant dependency: For report users to see the custom font correctly, the same font must also be installed on their device. Considering that report consumers may access reports from Windows, Mac, tablets, Power BI mobile app in Android, or iOS devices, maintaining such a dependency is not practical. In most real-world scenarios, this prevents developers from using custom fonts.

In this blog, I will explain a workaround that allows you to use any font in Power BI reports:

*   Without installing fonts on the user’s machine
*   Without using custom visuals
*   Without relying on external web dependencies

## Important Notes
 

1.  This approach uses the SVG specification, so it works only in places where SVG images are supported
2.  SVG-based solutions have limitations and performance considerations. I have discussed those in previous blogs, you can read them [here](https://www.techietips.co.in/articles/powerbi-svg-based-semanticmodel-columns-and-measures) and [here](https://www.techietips.co.in/articles/powerbi-one-matrix-setting-can-kill-the%20-performance).
3.  Read the full article carefully before applying this method in enterprise reports.

## High-Level Steps


1.  Download font files
2.  Convert `.ttf` files to `.woff2`
3.  Convert `.woff2` files into Base64 strings
4.  Store the Base64 strings in DAX measures
5.  Create a reusable [DAX UDF](https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-user-defined-functions-overview) for SVG generation
6.  Apply the font to columns or measures

## Implementation


## Step 1 — Download the Font Files

You can download fonts from trusted sources such as, [Google Fonts](https://fonts.google.com/)

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*i_6FYbgC1eKqUJ172f-BEg.png)

Search for your desired font, open it and click on “Get font” button, it will add your font to the cart. Go to the cart then you will be able to download the fonts. I am downloading 5 fonts: Montseratt, Lato, Ralway, Inter and Roboto.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*mI1_Mr6E5wEKjatRO0hYZw.png)

After unzipping, each font will have its own folder

![captionless image](https://miro.medium.com/v2/resize:fit:1082/format:webp/1*IDBKAhLr5j1Flc8fueEPqw.png)

containing multiple styles (Light, Bold, Italic, etc.) in `.ttf` format. Identify and list only the styles you actually need in your report.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*YPCJc7V22atkyXfZIjPDkQ.png)

Although `.ttf` files can technically be embedded, they are relatively large in size. To optimize performance, we will convert them to `.woff2` format in the next step.

## Step 2 — Convert .ttf to .woff2

Open [Tansfonter](https://transfonter.org/) site

Upload the selected `.ttf` files using **“Add fonts”**.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*M-j9fKHcPM9hWkbHv6wuoA.png)

Click **Convert**. Download and unzip the output.

Inside the extracted folder, you will find the `.woff2` files.

![captionless image](https://miro.medium.com/v2/resize:fit:1318/format:webp/1*C3bgx_cOe3LLZ3YsIzby3g.png)

We cannot directly upload these files into Power BI. So next, we convert them into Base64 strings.

## Step 3 — Convert .woff2 to Base64

Open [Base64](https://base64.guru/converter/encode/file)

Upload the `.woff2` file. Click **Encode file to Base64**.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*k-Y_1q77zTjeV16l5ut01g.png)

Download the generated Base64 string. Save each Base64 string locally. Note: Files must be converted one by one.

## Step 4 — Store Base64 in DAX Measures

Create a new measure in Power BI and paste the Base64 string:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*2lJSE2NYLPwWv1A0YAEAHQ.png)

Repeat this for each font style you want to use.

![captionless image](https://miro.medium.com/v2/resize:fit:490/format:webp/1*_OnUxC_om30uzi4NYMyloQ.png)

## Step 5 — Create a Reusable SVG User Defined Function (UDF)

Instead of rewriting the SVG structure repeatedly, centralize it using a **DAX User-Defined Function (UDF)**:

```DAX
DEFINE
 FUNCTION applyFont = (tex: string, font: string, fontName:string, alignment:string) =>
  VAR __Result =
      "data:image/svg+xml;utf8,
      <svg xmlns='http://www.w3.org/2000/svg' width='200' height='30'>
      <style>
      @font-face {
       font-family:'"&fontName&"';
       src: url('data:font/woff2;base64,"
        & font &
        "') format('woff2');
      }
      text {
       font-family: '"&fontName&"';
       font-size: 14px;
       fill: black;
       text-anchor: "&alignment&";
      }
      </style>
      <text x='50%' y='50%' dominant-baseline='middle'>"
        & tex &
        "</text>
      </svg>"
   RETURN 
    __Result 					
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*P0724IfC5YfDbIoj6i9Qmg.png)

## Step 6 — Apply the Font

Apply to a Calculated Column

```DAX
CountrywithFont = 
applyFont(financials[Country], [fontMontserrat], "Montserrat", "middle")
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*qY4bLR51419_S9UxNtQJ8Q.png)

Set the column’s **Data Category** to **Image URL**.

Apply to a Measure

```DAX
CountryWithLatoFont = 
Var __SelectedCountry = SELECTEDVALUE(financials[Country])
Var __Result = applyFont(__SelectedCountry, [fontLato], "Lato","middle")
RETURN __Result
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*mCDhvzj1jOY4ge0znr89Iw.png)

Also categorize the measure as **Image URL**.

When placed in a table visual, the custom fonts render correctly.

![captionless image](https://miro.medium.com/v2/resize:fit:890/format:webp/1*vPRJ6boh9aUhUyWX37V1pw.png)

Similarly when I place all the fonts I apply all the fonts to Country column and place them in one visual, it looks like this

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*5ZnpHavotbZ6_1o1WB9L4g.png)

I created this report on a **Windows machine**, published it to power bi service, Then I opened it on a **Mac device** that did not have these fonts installed. The report rendered exactly the same as it did in Power BI Desktop. This confirms that the font is embedded inside the SVG, eliminating machine-level dependency.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*THiAfvgh9n6NapFJC6tmGw.png)

## Final Thoughts

This workaround is powerful, but it is not suitable for every scenario. I am sharing this purely for **knowledge-sharing purposes**. Please validate thoroughly before implementing in production environments.

Hope you learned something new. Please share your thoughts using the comments section below.

Happy Learning!!!