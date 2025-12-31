---
title: "Unlocking the Power of Power BI Goals (Metrics): A Hidden Gem"
date: "2024-11-10"
summary: "Explains how to streamline KPI tracking across multiple dashboards all told through a story. 📊📈"
tags: ["Power BI","Goals", "Metrix", "KPI"]
---
Initially, Power BI Metrics were called Goals. Later, Microsoft renamed them to Metrics. With the launch of Fabric Metrics layers, they are reverting to their original name, Goals. Throughout this blog post, I will refer to both term Goals and Metric as necessary for clarity. Check out [this blog post](https://powerbi.microsoft.com/en-us/blog/power-bi-september-2024-feature-summary/#post-28098-_Toc177480335) for more information.

Ram is the CEO of a large mobile manufacturing company called CellVerse Inc. With multiple departments operating under its umbrella, CellVerse Inc. relies heavily on various data sources and dashboards to keep the business running smoothly. Each department has its own KPIs to monitor, and these metrics are critical for making strategic decisions.

For Ram, tracking the performance of the entire company is no simple task. Imagine the challenge: opening dashboard after dashboard, manually noting down the current values of key performance indicators, comparing them to their targets, checking the status, and identifying who is responsible for any decline or growth. Given the scale and complexity of the company, this process is not only time-consuming but also inefficient.

He called for Abhi, the Head of Data Analytics, to discuss a better way forward. “Abhi! we need a smarter solution to monitor our KPIs across all departments. I want a dashboard that brings everything together a single place where I can instantly see which departments are on track and which are falling behind. Each KPI should be tagged with the relevant stakeholder, so we know who is accountable for what.”

Abhi nodded, understanding the weight of the responsibility. But Ram wasn’t done. “One more thing,” he added. “I want to know if these stakeholders are actually monitoring their metrics”

Abhi realized that Power BI Metrics had all the features his boss was asking for. Without wasting a moment, he began identifying the key KPIs critical for CellVerse Inc.’s success.

Here’s the process Abhi followed to create Power BI Metrics:

## Opening the Metrics Hub

He opened the Metrics Hub, a central place to manage and track all metrics. In the Metrics Hub, Abhi noticed that if no metrics had been previously created or assigned, only sample metrics would appear.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*VcPgsKo-PqbI1RpT)

## Creating a New Scorecard

Abhi clicked on the “+ New Scorecard” button at the top right corner. He then customised the scorecard settings:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*IggBPTnTLw85nReI)

Clicked the Settings gear icon and provided a meaningful name and description for the scorecard. Abhi then customized the statuses for his metrics, removing unnecessary ones and keeping only “Behind,” “On Track,” and “Completed.”

## Adding Metrics

He started by creating his first metric. Named it Sales and assigned it to Emma. For the “Current Value,” he linked it to the report visual he had already created, instead of entering it manually. This way, every time the semantic model data refresh happens, the numbers in the scorecard will also get updated automatically.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*zqdbchRLZKAva2kE)![captionless image](https://miro.medium.com/v2/resize:fit:1248/format:webp/0*_9DVDkCHWzexK95b)![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*kYLnxQ6mSfXTCX06)

For the “Final Target,” he also linked it to the Target KPI in his report visual.

Abhi defined rules for the metric status, ensuring it reflected the performance accurately. This will remove the manual intervention and when the metric value changes the status of the KPI will get changed according to the rules defined.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*qC3HvttYOgeANQIq)![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*DqmGsnqekV0PwT-m)

He carefully set the start and end dates and saved his changes. He also observed that he as an option to enable tracking preferences, this option will percentage or absolute change in the KPI over the certain period of time.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*fVj3DomquIfJHr3W)

To demonstrate the full functionality, Abhi created another metric and assigned it to John, using the same process.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*7tDMdifA8tyiNNP2)

Assigning Metrics to Individuals or Teams

With the metrics set, Abhi needed to share them with Emma and John. He knew there were two ways to share: either the entire scorecard or individual metrics. He decided to share individual metrics for clarity.

## Setting Up Permissions

Abhi clicked the Settings gear icon and opened the Permissions tab.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*kwKfaLO6QcDuIamH)

He created roles for both Emma and John:

**Emma’s Role:** Granted permissions for viewing, updating notes, and setting future sub-metrics automatically. He skipped permissions for status and current value, as those were dynamically linked to the semantic model.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*FM93_F5x4PvGYZ3w)

**John’s Role**: Similar permissions were set for John.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*omk4qcGeWxwtbXlW)

**Sharing the Scorecard**

Abhi clicked on the Share button, either sending an email notification or copying a link to distribute.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*eXntEVvr0VfJl-VM)

Now, it’s time to verify whether Emma can access and see this, Emma.

As you can see Emma can see her goal.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*OK_TpNbyCjCYmLIQ)

Emma is a business user; she can only perform the check in if we give status permissions to her role. Abhi updated her role permissions and added ‘Update status permissions and now she can add the check in.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*kR3KlZNCXkmgcBWu)

Just as Abhi shared the individual metrics with Emma and John each being responsible for their respective KPIs — he also shared the complete scorecard with his boss, Ram. This comprehensive view meant that Ram no longer had to sift through multiple dashboards to track different KPIs. Instead, he could now monitor the performance of various departments at a glance, including the check-ins from KPI owners. This capability allowed him to see whether KPI owners were actively engaging with their metrics, ensuring accountability across the board.

With the Power BI Goals in place, Ram felt confident that his team was aligned and focused, paving the way for informed decisions that would drive Cellverse towards success.

Licensing Requirements:

1.  Power BI Pro license is required to create metrics, Power BI (Fabric) Free license is sufficient to view or act on a metric.
2.  Power BI goal hierarchies would require Premium per User license, or the workspaces should be hosted in premium capacity/Fabric capacity.

For more information about Power BI goals, please go through the [official documentation](https://learn.microsoft.com/en-us/power-bi/create-reports/service-goals-introduction).

Happy Learning!!!