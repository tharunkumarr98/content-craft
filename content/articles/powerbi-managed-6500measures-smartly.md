---
title: "Managed Power BI Semantic Model with 6500+ Measures Smartly"
date: "2026-06-06"
summary: "In recent months I got the chance to work on a model that contains 6500+ DAX measures."
tags: ["Power BI","DAX Measures", "C#"]
image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/0*b6giLE-9n4X3mdBD"
---


Almost two years ago I wrote a blog post explaining how I updated 500+ DAX measures in a semantic model with minimal effort. You can find that blog [here](https://www.techietips.co.in/articles/powerbi-remove-measures-in-bul). In recent months I got the chance to work on a model that contains **6500+ DAX measures**. Why it has that many measures is a story for another day. What I want to share here are my learnings, and how I managed to make complicated changes across thousands of measures with ease. Let’s begin.

Who is this blog for? If you have ever stared at a measure list long enough to lose your scroll position, or asked for a “small” change that quietly turns into a week of clicking, this one is for you.

(The last scenario is the most interesting one, so read it till the end.)

Throughout this blog I am going to use a sample model created from the Northwind dataset. The model view looks something like this:

To keep things reproducible, I’ll demonstrate each scenario on a small sample model rather than the real 6500+ measure beast. The sample holds 126 measures, just enough to show the scripts in action.

## Scenario 1

Often, due to changes in the native SQL statement used to pull data into the semantic model, hundreds of measures end up in an error state. The change could be anything: a column gets removed, a column name changes, and so on. The painful part is that I have to open each broken DAX measure individually just to read its error message.

Some measures break only because another measure they reference is broken. There is no single place where I can see details like “N measures failed for this reason.” Tools like Tabular Editor may have options to show all broken objects along with the failure reason in one place, but in Power BI Desktop this option is not available natively.

In this scenario, **INFO.MEASURES()** should be your best friend. You can run this function in the DAX Query View and it returns a table. It contains many useful columns: the table where the measure lives, the display folder, format string, data type and more. But the hidden gems are the ‘State’ column and the ‘ErrorMessage’ column right next to it. As a rule of thumb, any value in the State column other than 1 can be treated as a broken measure, and the reason sits in the ErrorMessage column. With a single query I was able to identify every unique reason why my DAX measures had failed. Thousands of clicks saved.

In the sample model, I removed the “Quantity” column from the “Order_Details” table, and instantly 67 out of 125 measures broke. That does not mean all 67 have a direct dependency on that one column. I only need to fix the measures with a direct dependency, and the rest will resolve automatically. But imagine someone who is fairly new to this model, how would they know which dependencies are direct and which are indirect? Just run the DAX query below and it will separate the measures directly referencing the column from those failing indirectly.

```DAX
EVALUATE
SELECTCOLUMNS (
    INFO.MEASURES (),
    [Name],
    [Expression],
    [State],
    [ErrorMessage]
)
ORDER BY [State] DESC
```

Indirect:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*lv_ZUZyPBw38aoLlJ-Rtow.png)

Direct:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*NfD6yBRweAGnm6TZmCPhCQ.png)

This clearly shows that I only need to fix 3 out of the 67 broken measures to resolve everything, look at how useful this query is. It saved a ton of clicks and time. Below are the different “State” values applicable to measures.

This clearly shows that I only need to fix 3 out of the 67 broken measures to resolve everything, look at how useful this query is. It saved a ton of clicks and time. Below are the different “State” values applicable to measures.

If a measures state is

1 — Ready — the measure is queryable and has up-to-date data

5 — Semantic Error — the measure expression has a semantic error

7 — DependencyError — Dependency associated with this measure is in an error state =

There are certain other state values which you might observe in other INFO functions however they are not applicable to measures.

Note: The **INFO.CALCDEPENDENCY** function can also help you identify the dependencies of each model object. However, in this scenario **INFO.MEASURES** is more useful because it provides both the state and the error message.

## Scenario 2

I was asked to rearrange the folder structure of the DAX measures. For example, imagine you have one DAX measure for each period horizon: YTD, PY, PY YTD, MTD and so on. Instead of dumping all of them into a single folder, I was asked to split them into separate folders. The reasoning is sound, a never-ending list is painful for self-serve BI users to scroll through, so it absolutely makes sense. BUT, I needed to do this for 6500 measures, and that is the real concern.

Not anymore, I created C# code that handles this with ease.

To show how I solved this with C# code, I prepared 125 measures in the sample model.

![captionless image](https://miro.medium.com/v2/resize:fit:496/format:webp/1*H_a000Qy8k7NIcw3uyEuog.png)

It includes different types of KPIs, sales, quantity, discount and so on, and each of these metrics is created across different period horizons like YTD, MTD, MOM and PY. So I prepared the C# script below using vibe coding.

```C#
// Measure Folder Reorganiser
// Builds a proper 2-level folder hierarchy:
//   Parent  = metric type  (Sales, Orders, Quantity ...)
//   Child   = time period or modifier (YTD, MTD, PY ...)
//             OR "Base" if no period keyword is found
// Run this in Tabular Editor -> Advanced Script Editor
// 1. Metric keyword -> Parent folder
//    Order matters: more specific phrases first
var metricFolders = new Dictionary<string, string> {
    { "Discount",       "Discount"       },
    { "Freight",        "Freight"        },
    { "Fulfillment",    "Orders"         },
    { "Shipment",       "Orders"         },
    { "Shipped",        "Orders"         },
    { "Late",           "Orders"         },
    { "Order",          "Orders"         },
    { "Quantity",       "Quantity"       },
    { "Revenue",        "Sales"          },
    { "Sales",          "Sales"          },
    { "Customer",       "Customers"      },
    { "Units",          "Inventory"      },
    { "Stock",          "Inventory"      },
    { "Inventory",      "Inventory"      },
    { "Product",        "Products"       },
    { "Employee",       "Employees"      },
    { "Category",       "Categories"     },
    { "Running Total",  "Running Totals" },
    { "Moving Avg",     "Moving Average" },
    { "Rank",           "Ranking"        },
    { "Share",          "Share"          },
    { "Growth",         "KPI"            },
    { "Target",         "KPI"            },
    { "Indicator",      "KPI"            },
    { "Status",         "KPI"            },
    { "Achievement",    "KPI"            },
    { "Trend",          "KPI"            }
};
// 2. Period / modifier keyword -> Sub-folder
//    Order matters: compound periods before their components
var periodFolders = new Dictionary<string, string> {
    { "PY YTD",  "PY YTD"         },
    { "PY MTD",  "PY MTD"         },
    { "PY QTD",  "PY QTD"         },
    { "YTD",     "YTD"            },
    { "MTD",     "MTD"            },
    { "QTD",     "QTD"            },
    { "YOY",     "YOY"            },
    { "MOM",     "MOM"            },
    { "QOQ",     "QOQ"            },
    { "PY",      "PY"             },
    { "PM",      "PM"             },
    { "PQ",      "PQ"             },
    { "3M",      "Rolling"        },
    { "6M",      "Rolling"        },
    { "12M",     "Rolling"        },
    { "Rank",    "Rank"           },
    { "Rate",    "Rate"           },
    { "Running", "Running Total"  },
    { "Moving",  "Moving Average" },
    { "Avg",     "Average"        },
    { "Share",   "Share"          },
    { "%",       "Ratio"          }
};
// 3. Name of the catch-all sub-folder for measures with no period match
string baseFolderName  = "Base";
// 4. Target table
string targetTableName = "KeyMeasuresTable";
var table = Model.Tables[targetTableName];
if (table != null)
{
    foreach (var m in table.Measures)
    {
        string name = m.Name;
        // --- Resolve parent folder ---
        string parentFolder = "General";
        foreach (var metric in metricFolders)
        {
            if (name.IndexOf(metric.Key, StringComparison.OrdinalIgnoreCase) >= 0)
            {
                parentFolder = metric.Value;
                break;
            }
        }
        // --- Resolve sub-folder ---
        string subFolder = baseFolderName; // default - always assigned
        foreach (var period in periodFolders)
        {
            if (name.IndexOf(period.Key, StringComparison.OrdinalIgnoreCase) >= 0)
            {
                subFolder = period.Value;
                break;
            }
        }
        // --- Build final folder path - always 2 levels deep ---
        m.DisplayFolder = parentFolder + "\\" + subFolder;
    }
}
```

I ran this script from Tabular Editor.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*TcK6glgl7Jq-UcLKTROiaw.png)

And that’s it, my measures are organized perfectly.

![captionless image](https://miro.medium.com/v2/resize:fit:372/format:webp/1*F_d_HSPn-GfUh1pt5LjAiA.png)

## Scenario 3

There are inconsistencies in the way measures are named. For example, the period horizons are sometimes wrapped in round brackets and sometimes not. This may sound trivial, but in an enterprise self-serve semantic model it matters. And once again, doing this manually across a monster model is a painful task. Not anymore, I created C# code for this too.

In my sample model there are many measures with period horizons (YTD, MTD, MOM etc.) in their names.

![captionless image](https://miro.medium.com/v2/resize:fit:412/format:webp/1*YY82tJKGG1AJekv2_AaTLA.png)

I prepared a C# script to wrap those period horizons in parentheses.

```C#
// Measure Name Normaliser
// Wraps period horizon keywords in brackets in measure names
// e.g. "Total Sales YTD"    -> "Total Sales (YTD)"
//      "Total Orders PY YTD" -> "Total Orders (PY YTD)"
// Run this in Tabular Editor -> Advanced Script Editor
// 1. Period keywords to wrap in brackets
//    Order matters: compound periods before their components
var periodKeywords = new List<string> {
    "PY YTD",
    "PY MTD",
    "PY QTD",
    "YTD",
    "MTD",
    "QTD",
    "YOY",
    "MOM",
    "QOQ",
    "PY",
    "PM",
    "PQ"
};
// 2. Target table
string targetTableName = "KeyMeasuresTable";
var table = Model.Tables[targetTableName];
if (table != null)
{
    foreach (var m in table.Measures)
    {
        string originalName = m.Name;
        string newName      = originalName;
        foreach (var keyword in periodKeywords)
        {
            // Skip if already wrapped in brackets
            if (newName.Contains("(" + keyword + ")"))
                continue;
            // Replace " KEYWORD" with " (KEYWORD)"
            newName = newName.Replace(" " + keyword, " (" + keyword + ")");
        }
        if (newName != originalName)
            m.Name = newName;
    }
}
```

I ran this code from Tabular Editor and it worked perfectly.

![captionless image](https://miro.medium.com/v2/resize:fit:598/format:webp/1*qAiQ7fCVoHDXVBDHyC1tAg.png)

Now comes the last and most interesting scenario.

## Scenario 4

Across all the measures, the [SUMMARIZECOLUMNS](https://learn.microsoft.com/en-us/dax/summarizecolumns-function-dax) function is used in more than 60% of them. We all know the syntax of this function.

```DAX
SUMMARIZECOLUMNS( <groupBy_columnName> [, < groupBy_columnName >]…, [<filterTable>]…[, <name>, <expression>]…)
```

I was given a task to add one additional group-by column to this function. A few complexities made this harder: the group-by column I needed to add differed from measure to measure, depending on the columns already present in the summarize block. And on top of that, I only needed to update a specific set of measures, not all of them. With all these complexities stacked together,

Initially I thought this would take at least a full week to complete. I was also a little scared of making manual errors along the way. So I created C# code that does the job with 100% accuracy. I built it so that it would:

1.  Find all the target measures
2.  Update those measures appropriately
3.  Create a CSV file on my local machine listing which measures were updated, what the original logic was, and how it changed

The CSV creation is purely optional, I added it only because I can use it for validation.

In the sample model there are a good number of measures using this pattern, calling SUMMARIZECOLUMNS to aggregate at a different grain.

![captionless image](https://miro.medium.com/v2/resize:fit:690/format:webp/1*jJh5he2czZBLIoxqij0apA.png)

To change the aggregation granularity of all those measures in one go, that is, to add one more column to the aggregation, I prepared the C# script below.

```C#
// SUMMARIZECOLUMNS Group-By Column Injector
// Adds an additional group-by column into SUMMARIZECOLUMNS for target measures
// only if that column is not already present.
// Also logs every change to a CSV for validation.
// Run this in Tabular Editor -> Advanced Script Editor
// 1. Log file path - change this to your local folder
string logFilePath = @"C:\Users\RTKTechieTipsInc\Documents\DAX_Update_Log.csv";
// 2. The column to inject as the first group-by argument
string columnToInject = "DimDateTable[Year]";
// 3. Target display folders - only measures in these folders will be updated
var targetFolders = new List<string> {
    "Sales\\Base",
    "Orders\\Base",
    "Quantity\\Base"
};
// 4. Measures to explicitly exclude (these already have specific group-by columns
//    that would conflict, or are simple aggregates not using SUMMARIZECOLUMNS)
var excludedMeasures = new List<string> {
    "Total Sales",
    "Gross Sales",
    "Total Discount Amount",
    "Total Revenue Incl Freight",
    "Total Orders",
    "Total Quantity",
    "Shipped Orders",
    "Pending Orders",
    "Total Sales - Germany",
    "Total Sales USA",
    "Total Sales (UK)",
    "Total Sales France",
    "Total Orders - Germany",
    "Total Orders USA",
    "Total Orders (UK)",
    "Total Orders France",
    "Sales Target Achievement",
    "Sales Trend Indicator",
    "Fulfillment Status"
};
// 5. Safety token - skip if already present inside SUMMARIZECOLUMNS block
string safetyToken = "DimDateTable[Year]";
// ----------------------------------------------------------
var logLines = new List<string>();
logLines.Add("Measure Name,Old Expression,New Expression");
foreach (var m in Model.AllMeasures)
{
    string name   = m.Name;
    string folder = m.DisplayFolder ?? "";
    string dax    = m.Expression   ?? "";
    if (string.IsNullOrEmpty(dax)) continue;
    // Skip excluded measures
    if (excludedMeasures.Contains(name)) continue;
    // Check measure is in one of the target folders
    bool inTargetFolder = false;
    foreach (var f in targetFolders)
        if (folder.Equals(f, StringComparison.OrdinalIgnoreCase))
        { inTargetFolder = true; break; }
    if (!inTargetFolder) continue;
    // Find SUMMARIZECOLUMNS
    int funcPos = dax.IndexOf("SUMMARIZECOLUMNS", StringComparison.OrdinalIgnoreCase);
    if (funcPos < 0) continue;
    int openParenPos = dax.IndexOf("(", funcPos);
    if (openParenPos < 0) continue;
    // Safety check - skip if column already present
    string snippet = dax.Substring(openParenPos, Math.Min(300, dax.Length - openParenPos));
    if (snippet.IndexOf(safetyToken, StringComparison.OrdinalIgnoreCase) >= 0) continue;
    // Inject column as the first group-by argument
    string oldExpression = dax;
    string injection     = "\n        " + columnToInject + ",";
    string part1 = dax.Substring(0, openParenPos + 1);
    string part2 = dax.Substring(openParenPos + 1);
    m.Expression = part1 + injection + part2;
    // Log the change
    logLines.Add(string.Format("\"{0}\",\"{1}\",\"{2}\"",
        name,
        oldExpression.Replace("\"", "\"\""),
        m.Expression.Replace("\"", "\"\"")));
}
// Write log
if (logLines.Count > 1)
{
    System.IO.File.WriteAllLines(logFilePath, logLines);
    (logLines.Count - 1 + " measure(s) updated. Log saved to: " + logFilePath).Output();
}
else
{
    "No measures were updated.".Output();
}
```

I ran the code from Tabular Editor.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*x50lbYlwuapCA8kTj6VS5Q.png)

It worked perfectly

![captionless image](https://miro.medium.com/v2/resize:fit:650/format:webp/1*WbgeaFFB12OhWQG84iaODQ.png)

It also prepared the Excel file listing every measure it updated, and not just the names, it includes the before and after expressions too.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6rtltChqsi5w1Txdi3haow.png)

This is one of those critical activities that would take weeks to complete manually. With the script, it took just minutes.

## Final thoughts

1.  Each scenario above might look like a minor enhancement to the model, but as I said, when the model holds 6500+ measures, the time it would take to do this work without these scripts and tools is enormous.
2.  Tools like the [Power BI Modeling MCP](https://learn.microsoft.com/en-us/power-bi/developer/mcp/mcp-servers-overview) might be able to do this even more efficiently (I have not tested it). That said, I would still recommend the C# script approach for two reasons. First, exposing direct access to your model to an LLM carries some risk, depending on how sensitive your data is. Second, you can develop these C# scripts easily by giving an LLM minimal context, which lets you avoid that security risk, reduce token usage, and ultimately cut costs.

Have you ever faced scenarios like these? If so, how did you tackle them efficiently? Let me know your approach in the comments, I would love to learn from you.

Hope you learned something new.

Happy learning!!!