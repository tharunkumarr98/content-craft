---
title: "Do Not Use Web.BrowserContents"
date: "2025-08-10"
summary: "Explained the common issues you might encounter while scraping data from web pages and shared practical solutions."
tags: ["Power BI", "Semantic Model", "Power Query", "Web.Contents"]
---

Extracting or scraping data from publicly accessible websites is not difficult in Power BI Desktop thanks to its web connector.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*caqlygWopcQeMXqJnqMY4Q.png)

When you use the web connector, the Power Query Editor generates M code that usually contains the `Web.BrowserContents` function.

```M
let
  Source = Web.BrowserContents(
    "https://www.worldometers.info/world-population/population-by-country/"
  ),
  #"Extracted Table From Html" = Html.Table(
    Source,
    {
      {
        "Column1",
        "TABLE.datatable.w-full.border.border-zinc-200.datatable-table > * > TR > :nth-child(1)"
      },
      {
        "Column2",
        "TABLE.datatable.w-full.border.border-zinc-200.datatable-table > * > TR > :nth-child(2)"
      },
      {
        "Column3",
        "TABLE.datatable.w-full.border.border-zinc-200.datatable-table > * > TR > :nth-child(3)"
      },
      {
        "Column4",
        "TABLE.datatable.w-full.border.border-zinc-200.datatable-table > * > TR > :nth-child(4)"
      },
      {
        "Column5",
        "TABLE.datatable.w-full.border.border-zinc-200.datatable-table > * > TR > :nth-child(5)"
      },
      {
        "Column6",
        "TABLE.datatable.w-full.border.border-zinc-200.datatable-table > * > TR > :nth-child(6)"
      },
      {
        "Column7",
        "TABLE.datatable.w-full.border.border-zinc-200.datatable-table > * > TR > :nth-child(7)"
      },
      {
        "Column8",
        "TABLE.datatable.w-full.border.border-zinc-200.datatable-table > * > TR > :nth-child(8)"
      },
      {
        "Column9",
        "TABLE.datatable.w-full.border.border-zinc-200.datatable-table > * > TR > :nth-child(9)"
      },
      {
        "Column10",
        "TABLE.datatable.w-full.border.border-zinc-200.datatable-table > * > TR > :nth-child(10)"
      },
      {
        "Column11",
        "TABLE.datatable.w-full.border.border-zinc-200.datatable-table > * > TR > :nth-child(11)"
      },
      {
        "Column12",
        "TABLE.datatable.w-full.border.border-zinc-200.datatable-table > * > TR > :nth-child(12)"
      }
    },
    [RowSelector = "TABLE.datatable.w-full.border.border-zinc-200.datatable-table > * > TR"]
  ),
  #"Promoted Headers" = Table.PromoteHeaders(
    #"Extracted Table From Html",
    [PromoteAllScalars = true]
  ),
  #"Changed Type" = Table.TransformColumnTypes(
    #"Promoted Headers",
    {
      {"#", Int64.Type},
      {"Country (or dependency)", type text},
      {"Population 2025", Int64.Type},
      {"Yearly Change", type text},
      {"Net Change", type text},
      {"Density (P/Km²)", Int64.Type},
      {"Land Area (Km²)", Int64.Type},
      {"Migrants (net)", type text},
      {"Fert. Rate", type number},
      {"Median Age", type number},
      {"Urban Pop %", Percentage.Type},
      {"World Share", Percentage.Type}
    }
  )
in
  #"Changed Type"
```

If you've noticed `Html.Tables` being used as well, you might wonder why. The answer is simple: the output of `Web.BrowserContents` isn't directly a table or a readable value—it’s a binary value. You need to convert this binary data into something readable, which is where parsing functions come in. That’s why, when you’re pulling data from an API, along with Web.Contents function, functions like `Json.Document`, `Xml.Document`, or `Csv.Document` are invoked depending on the endpoint's data format. Similarly, data from Excel files located in Sharepoint folder will use `Excel.Workbook()`.

## Why Is Html.Tables Needed?

Let’s break this down. Suppose the URL you provided isn’t an Excel file on SharePoint or an API endpoint, but just a publicly accessible webpage. The data is available right on the page itself, which is — naturally — in HTML format. To present tabular data in HTML, developers often use the `<table>` tag. So, when you use a web URL as a source in Power BI Desktop, it’s intelligence identifies the output format and automatically applies the necessary parsing functions to present your data. If the site contains multiple tables (multiple `<table>` tags), the navigation pane displays all of them, allowing you to choose which table you want to import.

Since this data is publicly accessible, anonymous authentication works, and you can refresh the data from the Power BI Service.

## What if the data is not on the web page?

Let’s say you’re interested in the ‘Index of Consumer Sentiment’ data from the University of Michigan’s portal: [https://data.sca.isr.umich.edu/tables.php](https://data.sca.isr.umich.edu/tables.php)

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*cLfslHb1BkrFG2fuak_H6A.png)

You could manually download the file and import it into Power BI Desktop — but that’s tedious. Every data update would require you to download the latest file and refresh your dataset manually.

A better approach is to find the direct file URL from the site, usually by inspecting the anchor (`<a>`) tag hyperlink. Once you have this URL, connecting directly works—until you realize there is a unique file’s ID, month and year with in the URL as query parameter.

```M
https://data.sca.isr.umich.edu/get-table.php?
c=YB&y=2025&
m=6&n=1a&
f=pdf&
k=a01fbcbe6e713ac1a6d67875f5e19fc2
```

It indicates every month the URL parameter value changes. So, you’re back to square one.

Time to roll up the sleeves and brainstorm a solution.

## Using Web.Contents and Text.FromBinary

When you use the graphical interface and supply the web page URL, the first navigation window will show you the table it has identified but it will not show the underlying anchor tag URLs.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*fZvrRyPHs5uwvJOhQRbsVA.png)

M expression will look similar to this:

```M
Web.BrowserContents("https://data.sca.isr.umich.edu/tables.php")
```

If you go this route, refreshing the dataset from the Power BI Service fails due to two main reasons:

1.  [Dynamic Data Source Limitation](https://learn.microsoft.com/en-us/power-bi/connect-data/refresh-data#refresh-and-dynamic-data-sources)
2.  Web.BrowserContents does not support data refresh from power bi service

## Solution

1. Replace `Web.BrowserContents` with `Web.Contents`, and split your web URL into a root URL and a query parameter.

```M
Web.Contents("https://data.sca.isr.umich.edu", [RelativePath="tables.php#"])
```![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*yQMUas1qboWZxjmE10BL0g.png)

This modification avoids issues with dynamic data sources and browser engine requirements.

2. Extract the HTML using Web.Contents(), As we all know the output of this function is binary value, convert this binary to text using `Text.FromBinary`.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*qaoDuXDHoVBqWfCI6dZoAA.png)

As you can see we are able to extract the underlying HTML, the next task to identify the file url within this code. Here’s where things get tricky. As far as I know, there’s no M function that reads anchor elements directly.

But we have workarounds! Either we can use text manipulation function like Text.BetweenDelimiter OR we can use Html.Table function. Second option would require HTML knowledge to identify the class and identifier names of different elements in the code. Since we only need one link and to keep things simple, lets solve this using text manipulation functions

We can use functions like `Text.PositionOf` to locate the exact file URL. For example, in my scenario, the relative file URL is found between two position markers. As a result, you can dynamically extract the file URL.

```M
Text.BetweenDelimiters(
  Text.BetweenDelimiters(
    Text.FromBinary(
      Web.Contents("https://data.sca.isr.umich.edu/tables.php#")), 
        "The Index of Consumer Sentiment", "                 </div>"),
          " href=", ">")
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*l4ROVIZoQ-m9PGFDSvM6eA.png)

Now, pass this file URL to `Web.Contents` , Since there are multiple parameters in the URL, some transformation logic is needed to capture all parameters into a power query list object.

```M
List.Transform(
    Text.Split(
      Text.AfterDelimiter(
        Text.BetweenDelimiters(
          Text.BetweenDelimiters(
            Text.BetweenDelimiters(
              Text.FromBinary(Web.Contents("https://data.sca.isr.umich.edu",  [RelativePath = "tables.php"])),
              "The Index of Consumer Sentiment",
              "                 </div>"
            ),
            " href=",
            ">"
          ),
          """",
          """"
        ),
        "get-table.php?"
      ),
      "&"
    )
```

Use appropriate parsers (such as `Pdf.Document`) to convert binary data into a readable table format. This method is compatible with Power BI Service data refresh. The final code will look like this

```M
let
  scrappedHtml = List.Transform(
    Text.Split(
      Text.AfterDelimiter(
        Text.BetweenDelimiters(
          Text.BetweenDelimiters(
            Text.BetweenDelimiters(
              Text.FromBinary(Web.Contents("https://data.sca.isr.umich.edu",  [RelativePath = "tables.php"])),
              "The Index of Consumer Sentiment",
              "                 </div>"
            ),
            " href=",
            ">"
          ),
          """",
          """"
        ),
        "get-table.php?"
      ),
      "&"
    ),
    each Text.AfterDelimiter(_, "=")
  ),
  c = scrappedHtml{0},
  y = scrappedHtml{1},
  m = scrappedHtml{2},
  n = scrappedHtml{3},
  f = scrappedHtml{4},
  k = scrappedHtml{5},
  Source = Pdf.Tables(
    Web.Contents(
      "https://data.sca.isr.umich.edu", 
      [Query = [c = c, y = y, m = m, n = n, f = f, k = k],RelativePath= "get-table.php"]
    ),
    [Implementation = "1.3"]
  ),
  Table002 = Source{[Id = "Table002"]}[Data]
in
  Table002
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*TZHdb2nRSCXwqaKpBVGGEw.png)

Thats it! We were able to capture the file URL placed on a web page dynamically. Imported the data from that file. We did not hardcode the URL. With no manual interventions the data gets updated in the upcoming months.

## Final Thoughts

If the website owner changes the page layout, the underlying HTML will change, which may break your semantic model’s refresh. Keep in mind, some websites discourage scraping  do your due diligence and respect site policies. This blog does not explicitly recommend scraping against such policies.

There are likely many other methods to accomplish this, but my intent here was to demonstrate a fully Power BI Desktop–based approach from start to finish.

What do you think of this approach? Have you encountered similar challenges? Do you know an easier way? Please share your thoughts below!