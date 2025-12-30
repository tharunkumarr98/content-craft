---
title: "Hybrid Tables in Power BI Explained: Speed Up Your Reports"
date: "2025-09-14"
summary: "How Hybrid Tables combine Import and DirectQuery to deliver both speed and freshness, with real test results and key considerations."
tags: ["Power BI", "Semantic Model", "Hybrid Tables"]
---
You might have come across use cases where Power BI dashboards need data refreshed with latency as low as minutes. In these scenarios, developers often choose the Direct Query storage mode. However, this approach typically creates a bottleneck in dashboard performance, resulting in slow visual load times.

When investigating poor load times, you’ll find that each visual on the report canvas sends one or more queries to the database engine, with these execution times contributing most to the total load time. Here are several techniques you can implement to optimize these queries and reduce their number:

1.  Using a composite model instead of complete direct query mode, where dimension tables are in dual storage mode and fact tables remain in direct query mode.
2.  [Increasing the maximum number of connections](https://blog.crossjoin.co.uk/2022/06/12/how-the-maximum-connections-per-data-source-property-on-power-bi-directquery-datasets-can-affect-report-performance/) to the data source and [increasing Max parallelism per query.](https://blog.crossjoin.co.uk/2023/03/19/directquery-parallelisation-in-power-bi-some-examples/)
3.  [Implementing user-managed aggregations](https://learn.microsoft.com/en-us/power-bi/transform-model/aggregations-advanced) and [enabling auto aggregations](https://learn.microsoft.com/en-us/fabric/enterprise/powerbi/aggregations-auto).
4.  [Enabling horizontal fusion](https://powerbi.microsoft.com/en-in/blog/announcing-horizontal-fusion-a-query-performance-optimization-in-power-bi-and-analysis-services/)

Depending on your data model, these workarounds can help reduce load times. However, there’s another option that developers often overlook, which I’ll discuss in this blog.

## Hybrid Tables

[Hybrid Tables](https://powerbi.microsoft.com/en-sg/blog/announcing-public-preview-of-hybrid-tables-in-power-bi-premium/) feature was released a few years ago as an enhancement to the incremental refresh option. Currently, it only works when the semantic model is hosted in a workspace backed by a premium capacity or a fabric capacity.

To implement hybrid tables, you simply need to enable the direct query partition while configuring the incremental refresh policy. That’s it!

Let’s understand how this works:

I took one fact table containing transactional data and configured incremental refresh like below

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*AmbHRiHKDZ3gSUaa)

Archive: last 4 years | Import: last 4 days | Direct query: 1 day

After pushing the semantic model to Power BI service, I refreshed it. As we know, a table with an incremental refresh policy loads all historical data during the first refresh. Similarly, hybrid tables also load all data during the first refresh and create multiple partitions. These partitions hold data for corresponding years, quarters, months, and days. We cannot see these partitions from either Power BI Desktop or Power BI Service. However, when I connected to the semantic model from Tabular Editor through the XMLA endpoint, I could see the partitions:

![captionless image](https://miro.medium.com/v2/resize:fit:800/format:webp/0*hc6FpCI5eWv7mnHk)

You can observe the refresh policy of the table, Few interesting objects that you can observe are:

IncrementalGranularity: Day | IncrementalPeriods: 4 | IncrementalPeriodOffset: -1

Mode: Hybrid | RollingWindowGranularity: Year | RolingWindowPeriods: 4

**Note** : Normally, when we enable incremental refresh policy without direct query partition then Mode will be Import

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*k46mB-wpq83iUH9L)

The current day’s partition will be in direct query mode,

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*9mUI2kUXVnNdGeU7)

while all historical data partitions will be in import mode.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*eL6TJF1syMpvZ-Mo)

From now on, every time you refresh the semantic model, the last 4 days of data (except the current day) will be refreshed.

Let’s explore how Hybrid mode offers advantages over standard Direct Query storage.

I created a small Power BI semantic model containing two fact tables and four dimension tables.

I created three versions of the same model, storage modes of each table in those versions are like below:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*e345nYY9oAt7Mzjg)

**Quick Tip** : Converting tables from Import mode to Direct Query or Dual mode was previously challenging, but TMDL now makes this process much easier. I’ll explain this in detail in my next blog.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*n4VoZr00hQSR6-9Q)

Here are the screenshots of three models

**Import Mode**

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*N273LIdOX3EoThl-)

**Direct Query Mode**

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*jVmBpvOlvSpeqkx_)

**Hybrid Mode**

Refresh Policy: Archive: 4 years | Refresh: 4 days | Direct Query: 1 day

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*MIxw1EGwo_kp_96K)

I published all three models into power bi service and performed the data refresh (First load)

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*FEXC1672_OlJJuRr)

Now, I will connect to these semantic models through XMLA endpoint from DAX studio. I will run a DAX query against each semantic model and will compare the results:

(I captured the below visual dax query from performance analyzer)

```DAX
DEFINE
	VAR __DS0FilterTable = 
		TREATAS({"'DimDate'[Year]"}, 'TrendParameter'[TrendParameter Fields])
	VAR __DS0FilterTable2 = 
		TREATAS({"Net Profit"}, 'KPIName'[KPI])	
    VAR __DS0FilterTable3 = 
		TREATAS({"Internet"}, 'KPIParameter'[Value4])	
    VAR __DS0Core = 
		SUMMARIZECOLUMNS(
			'DimDate'[Year],
			__DS0FilterTable,
			__DS0FilterTable2,
			__DS0FilterTable3,
			"InternetSalesNetProfit", 'KeyMeasuresTable'[InternetSalesNetProfit]
		)	
    VAR __DS0BodyLimited = 
		SAMPLE(3502, __DS0Core, 'DimDate'[Year], 1)
EVALUATE
	__DS0BodyLimited
ORDER BY
	'DimDate'[Year]
```

**Note**: Its always a good practice to enable ‘server timings’ and ‘clear cache on run’ when you are doing such performance testing.

**Hybrid Mode**

Execution Time: 391 milli seconds | # of Scans: 1 | # of SQL queries: 1

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*Yh6Ft0ZMW1K_or3i)

There is one Scan (Import) and one SQL (DirectQuery). You can also observe the where clause in the sql statement, it is only querying for 13th September which is current date.

**Import Mode**

Execution time: 17 milli seconds | # of Scans: 1 | # of SQL Queries: 0

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*2uDoZQPSnof2ugL1)

**Direct Query Mode**

Execution time: 630 milli seconds | # of Scans: 0 | # of SQL Queries: 1

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*RWB1E8Chwg_5aorU)

For better results I took the average of three attempts, Here are the results:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*QC6fXqgLnWywTS-J)

As you can see, Hybrid mode execution time is less compared to Direct Query. This is because the Hybrid mode query only fetches results for the lastest day, while the Direct Query mode scans the entire table without filters.

I’d also like to share another important detail: Hybrid tables send a query every time you refresh visuals, regardless of the filter context. This means even when you’re looking at historic data that should come from archived partitions, a query still runs against the database to check for matching rows in the current day partition. This is expected behavior.

For example, I’ll run one more simple query with a date filter added

```DAX
//Hybrid 
EVALUATE 
	SUMMARIZECOLUMNS(
			DimDate[Year],
			DimDate[MonthName],
			DimProduct[EnglishProductName],
			FILTER(DimDate, DimDate[Year] = 2023),
			"sales", [InternetSalesAmount]
			)
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*eZ5TTqavfIPUtL7n)

As you can see, this time I ran the query to see results from 2023 only. Even though this data is in the archived partition, the system still queries the database. The good thing is that the query includes a WHERE clause, which improves efficiency.

## Final Thoughts

1. Hybrid technique might not be helpful if your historic data keeps changing.

2. In this article I might have referred ‘Hybrid Tables’ as Hybrid Mode, however it is not a storage Mode like Import, Direct Query, Dual, Push and Direct Lake. It is just an enhancement to the incremental refresh option which allows us to enable partitions under an Import mode table to direct query.

I’ve encountered several issues while enabling hybrid partition for tables retrieved using Native SQL statements. Fortunately, the new TMDL view helped me solve these problems and significantly reduced the time needed to convert between import, direct query, hybrid, and dual modes. I’ll explain this topic in detail in my next blog.

I hope you learned something new from this blog. Please share your thoughts in the comments section — I would love to read your feedback.