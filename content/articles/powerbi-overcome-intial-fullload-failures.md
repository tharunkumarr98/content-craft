---
title: "Overcome Initial Full Load Failures in Power BI Incremental Refresh with Bootstrapped Initial Refresh"
date: "2025-10-20"
summary: "Explained how using the Bootstrapped Initial load and sequentially loading data into partitions technique can effectively overcome these issues."
tags: ["Power BI", "Semantic Model", "Incremental Refresh"]
---

Building an insightful Power BI dashboard for large volumes of transactional data often requires balancing performance and efficiency. Loading the complete dataset into the semantic model each time new records are added to the data warehouse can be time-consuming and resource-intensive.

In most transactional systems, historical data remains unchanged, meaning there is little value in reloading it repeatedly. To address this, Power BI provides an **Incremental Refresh policy**, which allows only recent data to be refreshed while preserving the historical portion. You can learn more about this feature in the [official Microsoft documentation](https://learn.microsoft.com/en-us/power-bi/connect-data/incremental-refresh-configure).

Once the policy is configured and the model is published to the Power BI Service, the first refresh performs a full data load. Subsequent refreshes are incremental, appending new data to the existing historical data. While this approach works well in most cases, certain scenarios make the initial full load difficult or leads to failure.

## Scenarios That Cause Initial Full Load Failures

1.  **Power BI Refresh Time Limits** Power BI imposes refresh time limits. In Pro workspaces, the limit is two hours, while Premium capacities allow up to five hours. If your database cannot return the entire dataset within this window, the refresh will fail with a timeout error. Reference: [Power BI Refresh Time Limits](https://learn.microsoft.com/en-us/power-bi/connect-data/incremental-refresh-overview#time-limits)
2.  **Power BI Command Memory Limit** Power BI enforces a maximum amount of memory that a semantic model can use during refresh. If the refresh process exceeds this limit, it will fail. Reference: [Command Memory Limit](https://learn.microsoft.com/en-us/fabric/enterprise/powerbi/troubleshoot-xml-analysis-endpoint#resource-governing-command-memory-limit-in-premium)
3.  **Power BI Command Timeout Limit** Each Power Query (M) expression has a 10-minute command timeout limit. If the underlying data source cannot return data within this period, the refresh will fail. Reference: [Power Query Timeouts](https://blog.crossjoin.co.uk/2021/12/12/troubleshooting-power-bi-timeouts-part-2-timeouts-specified-in-power-query-functions/)
4.  **Database Workload Management (WLM) Rules** Database administrators often enforce workload management policies to balance resource usage across teams. Two such common rules that affect Power BI incremental refresh are:

*   Concurrent Query Limit: If Power BI sends more queries than the allowed threshold, the database may terminate them automatically.
*   Query Scan Volume Limit: This rule restricts the amount of data a single query or user can scan at a time. It often affects refresh operations when the RollingWindowGranularity in the incremental refresh policy is large.

During the initial full load, Power BI sends multiple queries to the data source. Some of these may scan a significant amount of data, triggering one or more of the limits above and causing the load to fail.

Modifying these limits may not be possible for model developers. This raises an important question — can we load all data incrementally instead of performing one large initial load? The answer is **yes**, using a technique called [**Bootstrapped Initial Refresh**](https://learn.microsoft.com/en-us/power-bi/connect-data/incremental-refresh-xmla#prevent-timeouts-on-initial-full-refresh).

## What is Bootstrapped Initial Refresh?

Bootstrapped Initial Refresh allows you to create all necessary partitions in your semantic model without performing a full data load. Instead, you load an empty dataset during the initial refresh, avoiding timeout and memory issues.

Let’s look at how this can be implemented.

## Step 1: Prepare the Semantic Model

In this example, we connect to a SQL Server database containing a table of sales transactions.

**Base Query**

```SQL
SELECT [profit_margin],
       [quantity_sold],
       [customer_name],
       [customer_email],
       [purchase_date],
       [payment_method],
       [shipping_address],
       [product_name],
       [product_category],
       [product_price]
FROM [dbo].[sales_rawtransactions]
```

We then create two parameters, **RangeStart** and **RangeEnd**, required for the incremental refresh policy, and add them to the WHERE clause.

```SQL
WHERE [purchase_date] >= 'RangeStart'
  AND [purchase_date] < 'RangeEnd'
```

## Step 2: Bootstrap the Table

To bootstrap the table, we introduce a filter condition that always evaluates to false, such as `1 = 2`. This ensures the query returns no rows during the initial load.

```SQL
WHERE 1 = 2
  AND [purchase_date] >= 'RangeStart'
  AND [purchase_date] < 'RangeEnd'
```

After applying this condition, the table becomes empty.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*jHHte7b1rqkU-6jnuM9Xog.png)

You can now load it into Power BI and configure the incremental refresh policy.

![captionless image](https://miro.medium.com/v2/resize:fit:1190/format:webp/1*qM6n6TjSb171Jjbzjdyyzw.png)

When the model is published to the Power BI Service and the initial refresh is triggered, it completes quickly because no rows are returned.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*RskOxhA8f4r22Hz7x9-zhA.png)

However, Power BI still creates all necessary partitions based on the defined refresh policy.

![captionless image](https://miro.medium.com/v2/resize:fit:354/format:webp/1*qVwhGety640vmbC_vtsKbg.png)

This approach ensures the model structure is created without consuming significant resources or triggering the limits mentioned earlier.

## Step 3: Remove the Filter Using the XMLA Endpoint

Once the initial load completes successfully, the next step is to remove the false condition (`1 = 2`). You cannot do this from Power BI Desktop because republishing the model would overwrite it and re-trigger the full load. Instead, you can use **SQL Server Management Studio (SSMS)** and connect to the **XMLA Endpoint** of the workspace.

1.  In SSMS, choose _Analysis Services_ as the connection type and authenticate using Microsoft Entra credentials.

![captionless image](https://miro.medium.com/v2/resize:fit:944/format:webp/1*NpXv0lAPFUyyCowcpN2RXg.png)

2. In Object Explorer, right-click your semantic model and select: **Script Database as → Create or Replace To → New Query Editor Window**

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*EszqvOmECvEbbMMjrc8JVA.png)

3. Locate the M expression containing your query, remove the `1=2` condition,

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*86j4otAEttfCHNZg4GDHeg.png)

and execute the script.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*U4Jueu8sqWPpeRph7fh-gA.png)

This updates the dataset definition without replacing the model.

## Step 4: Load Data into All Partitions

Since the initial load produced an empty table, none of the partitions contain data. Triggering a standard refresh now will only refresh the most recent partition, as defined by the incremental policy. To populate the historical partitions, you must refresh them in batches.

Several options are available for this:

*   [Enhanced Refresh APIs](https://learn.microsoft.com/en-us/power-bi/connect-data/asynchronous-refresh)
*   [SQL Server Management Studio](https://stuffbyyuki.com/refresh-tables-and-partitions-in-power-bi-using-ssms/)
*   [Tabular Editor](https://docs.tabulareditor.com/onboarding/refresh-preview-query.html)

Refreshing all partitions simultaneously may again exceed resource limits. Therefore, batching refresh operations is essential.

## Automating Partition Refreshes with Python

To simplify the process, I developed a Python-based tool that automates partition refreshes.

_Download link is in the bottom_

It comes in two versions:

*   **Version 1:** Runs from a local machine
*   **Version 2:** Runs from a Microsoft Fabric Notebook using the [Semantic Link library](https://learn.microsoft.com/en-us/fabric/data-science/semantic-link-overview)

Both versions use the **Enhanced Refresh API** to refresh partitions efficiently.

## Version 1: Local Python Tool

This version includes three key files:

*   `config.py`
*   `utils.py`
*   `main.py`

**Requirements:**

*   Service Principal ID, Secret, and Tenant ID
*   Dataset ID and Workspace ID

**Configuration Steps:**

1.  Open `config.py` and provide the required values. Adjust parameters such as delay, batch size, maximum parallelism, retry count, and timeout based on your environment.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*zAY8WpTZq2SO8HwtLEgjxw.png)

2. In `main.py`, specify the table name and incremental refresh policy details.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*sGTjb3Z80KITUsvJ-_N4eA.png)

3. Execute main.py script.

**How It Works:**

*   The tool automatically calculates partition names based on the policy.
*   It divides partitions into batches as per the defined batch size.
*   It checks if any refresh is in progress, then triggers batch refreshes sequentially.
*   Each batch executes only after the previous one completes successfully.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*u_SnGv1XovtGhQieUO5LTw.png)

You can monitor progress through Power BI Service refresh history

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*xIZiD1amj3RmRLBb5Y_QaA.png)

or verify partition data in SSMS by expanding the table’s _Partitions_ node.

![captionless image](https://miro.medium.com/v2/resize:fit:746/format:webp/1*WJeuby1EUnIyCaCv3dGaYQ.png)![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*B4-tFRXMrFoFci8KOgDCVA.png)

After completing all the batches, it will stop the execution like below

![captionless image](https://miro.medium.com/v2/resize:fit:884/format:webp/1*Sg2dC-9OtFvFbvC82PYeTQ.png)

All the partitions are loaded successfully

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ZTxk3mth4YmoVw9jsoDcDA.png)

You might have observed, the first batch started at 8:26 AM and last batch completed at 11:00 AM. The whole process took 2.5 hours and the script did the whole job on its own. 🙂

## Version 2: Microsoft Fabric Notebook

The second version is a Microsoft Fabric Notebook (Bootstrapped Data Load.ipynb) and leverages the [**Semantic Link**](https://learn.microsoft.com/en-us/fabric/data-science/semantic-link-overview) library.

![captionless image](https://miro.medium.com/v2/resize:fit:1366/format:webp/1*FcfaMjlwFo8lSdKUvYylOQ.png)

It does not require a Service Principal since it uses the current user’s identity. The user running the notebook must have appropriate permissions in the workspace hosting the semantic model.

Provide the necessary configuration values in the designated notebook cell and execute it.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*vBvkX__Q5Nu7JTw3HD8RZg.png)

Similar to Version 1, it refreshes partitions sequentially in batches.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*kGUAhNH7lnjLQa1HtDNVMw.png)

## Points to Remember

1.  The automation tool supports **Task 2 only** refreshing partitions in batches.
2.  Parameters such as `maxParallelism`, `batchSize`, `delay`, `timeout`, and `retryCount` should be tuned according to your environment.
3.  The tool refreshes one table at a time. For models with multiple fact tables using incremental refresh, run the process separately for each table.
4.  In Version 1, verify that the automatically generated partition names match your model configuration before triggering the refresh.
5.  In Version 1, bearer token expiry has been handled which means even when the bearer token expires during the batch processing it will regenerate a token on its own.
6.  In Version 2, note that the Fabric notebook remains active during execution, which can increase compute consumption. If Fabric workloads are restricted in your organization, use Version 1 instead.
7.  You might have observed that the intermediate log messages shows the current refresh status as ‘Unknown’, it is an expected behavior with Enhanced Refresh APIs

## Conclusion

The Bootstrapped Initial Refresh technique is an effective way to overcome the limitations of the initial full load in Power BI incremental refresh. By first creating an empty table and then refreshing partitions in controlled batches, you can establish your model structure without encountering timeout, memory, or workload management issues.

This method ensures a smooth onboarding of large datasets into Power BI while maintaining optimal resource usage and performance.

You can download the tool from my [git repository](https://github.com/tharunkumarr98/Power-BI-Incremental-Refresh). I am not an expert in python, please feel free to correct my code or suggest any enhancements.

Hope you learned something new from this blog, do share your thoughts in the comments section.

Happy Learning!!!