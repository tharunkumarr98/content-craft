---
title: "Power BI load-testing notebook that won Microsoft Fabric Semantic Link Developer Experience Challenge 2026 🏆"
date: "2026-05-10"
summary: "How to perform Power BI Semantic Model lost testing based on realistic User activity."
tags: ["Power BI", "Semantic Model", "Load Test"]
---

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*YMEEnp6F5FyLmWStRSh-2Q.png)

Load testing Power BI semantic models has always been a pain. Most developers skip it. Not because they don’t care, but because:

*   There’s no native functionality for it in Power BI
*   Community approaches need heavy configuration
*   They’re never realistic. You don’t know how end users actually interact with the reports, or what DAX queries Power BI is really generating behind the scenes.

So how do you load-test something when you don’t even know what the real workload looks like?

That was the question I kept hitting, and the one I built a solution around.

The result is a single Fabric notebook that lets developers run realistic load tests against their models with almost no configuration. The workload isn’t synthetic; it’s the actual queries your users have been generating. And the output doesn’t stop at “this query was slow.” It tells you exactly which visual, on which page, of which report is going to hurt under load.

I submitted it to the Microsoft Fabric Semantic Link Developer Challenge 2026, and I’m glad to share that it was [recognized as the Best QA solution](https://community.fabric.microsoft.com/t5/Power-BI-Community-Blog/Announcing-the-Winners-of-the-Fabric-Semantic-Link-Developer/ba-p/5176792). 🏆


I recently had the opportunity to judge the Fabric Semantic Link Developer Experience Challenge, and the submissions…

[Announcement](https://www.linkedin.com/embed/feed/update/urn:li:share:7457577790960447489?source=post_page-----75d8579c1af0---------------------------------------)

In this blog post I’ll walk through how to set it up, what you get out of it, and how it actually works.

## Prerequisites

1.  The semantic model you want to test should reside in a workspace backed by Fabric capacity.
2.  Your workspace should have [Workspace Monitoring enabled](https://learn.microsoft.com/en-us/fabric/fundamentals/workspace-monitoring-overview)
3.  All Power BI reports pointing to this semantic model should be in PBIR format. _(Optional — only needed if you want the report → page → visual details.)_

## Setup

1.  Download the notebook from [this GitHub repository](https://github.com/tharunkumarr98/semanticLinkChallenge2026).
2.  Import it into your Fabric workspace.
3.  In Section 2 — Parameters, set:workspace_name and dataset_name : the model you want to testmonitoring_kusto_uri : the _Query URI_ of your Workspace Monitoring Eventhousemonitoring_database : typically, “Monitoring Eventhouse”
4.  Run the notebook.
5.  That’s it.

## What you get

After the run completes, the notebook renders an interactive Plotly dashboard inline:

**Summary KPIs**: four big-number tiles: queries ran, regressions flagged, worst delta %, and total queue wait time. The “at a glance” answer to _did anything break?_

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ZANwZNGsQndr-1NMC5ETnw.png)

**Top regressions under load**: a horizontal bar chart of the worst offenders, hover over any bar to see baseline duration, load-test duration, queue wait time, and a DAX preview.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*8f2z1oNxyO-OgbwhPH_rZA.png)

**Baseline vs. load-test scatter**: every dot is one DAX query, plotted against a “no regression” diagonal. Anything _above_ the line got slower under load. Colour-coded by delta %, so the eye finds the problems first.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*8YE3oqoBAYcnB3rWEJZMBw.png)

**Drill-down table**: the full regression list sorted by severity, with Report → Page → Visual → DAX preview for each row. This is the table you hand to whoever owns the report.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*7sdFEKfE1DEn-J-wZauiGw.png)

## How it works

1.  **Extract the real workload from the Workspace Monitoring Eventhouse**

Workspace Monitoring quietly logs every DAX query the engine executes, full query text, duration, CPU, wait time, originating ReportId and VisualId, the lot. The notebook runs a KQL query against the SemanticModelLogs table to pull the last _N_ days of traffic against your model, then picks a workload of the top-N most-frequent + top-N slowest queries(deduplicated). You’re not load-testing fiction, you’re load-testing what your users actually do.

2. **Clear the cache.**

Before rerunning, the notebook calls sempy_labs.clear_cache() on the model. Without this, your second-run results are unrealistically fast, every query benefits from the warmth of the first run.

3. **Rerun the queries in parallel and tag each one so we can find it later.** 

Queries are dispatched through sempy.fabric.evaluate_dax across 8 worker threads using Python’s ThreadPoolExecutor. Each worker opens its own XMLA session, which is exactly how Power BI Service generates concurrency in real life. This is the bit that simulates multiple users hitting the model at once.

But here’s the trick: how do you tell _your_ queries apart from everyone else’s in the trace logs afterwards?

The notebook injects a unique RunID and QueryHash into every query, not as a comment (those get stripped by XMLA normalization, I learned the hard way) but as a DAX VAR containing a string literal:

```DAX
DEFINE
    VAR __DAXLoadTestTag = "-- DAXLoadTest-RunID=<uuid> QueryHash=<md5>"
    -- ...rest of the original query
```

Because it’s a string literal inside the query body, it survives untouched into SemanticModelLogs.EventText. That gives us a bulletproof join key between the queries we sent and the traces we pull back.

4. **Wait for the Eventhouse to catch up.**

SemanticModelLogs ingests asynchronously, typically 2–5 minutes after a query completes. Instead of blindly sleeping, the notebook polls the Eventhouse every 60 seconds and proceeds as soon as ≥90% of the tagged queries appear. That way the test takes as long as it needs to, and no longer.

5. **Compare, diff, and attribute.**

The baseline durations (from before the test) and load-test durations (from after) are joined on QueryHash. Any query whose load-test average is ≥25% slower than baseline (and whose load-test average is at least 250 ms, small queries are too noisy to flag) is marked a regression. Both thresholds are configurable.

Then comes the most useful bit: every regressed query gets enriched with its originating Report → Page → Visualusing sempy_labs.report.ReportWrapper.list_visuals().

That’s the difference between _“some query is slow”_ and _“the map visual on the Executive page of Sales Overview is going to drag under load, go fix it.”_

I got an opportunity to learn a lot while working on this solution. I would request you to test it with your models and share your feedback under the comments section.

Hope you learn something new from my blog.

Happy learning!