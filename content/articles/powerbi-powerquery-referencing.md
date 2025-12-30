---
title: "Does Referencing Queries in Power Query Really Reduce Database Load?"
date: "2025-12-27"
summary: "Tested some of the most common assumptions about query referencing in the Power Query Editor and shared the actual results along with recommendations."
tags: ["Power BI", "Semantic Model", "Power Query"]
---

Power Query Editor needs no introduction for anyone who works with Excel’s Get Data experience, Power BI Desktop, Power BI and Fabric dataflows, or Power Platform dataflows. This same interface has even been [introduced recently in Paginated Reports](https://learn.microsoft.com/en-us/power-bi/paginated-reports/report-builder/connect-snowflake-databricks-power-query-online#get-started).

![captionless image](https://miro.medium.com/v2/resize:fit:604/format:webp/1*1NTNOJEMbYIZYKT91HVN7w.png)

Referencing Power Query queries is one of the most commonly used techniques in the Power Query Editor. Developers use it to reuse transformation logic, create staging queries, and build layered query structures that are easier to maintain.

Many developers believe that when **Query B** references **Query A**, Power Query evaluates **Query A** first and then reuses its results, avoiding additional database queries.

In this blog, I will test this assumption using a few simple scenarios and show how Power Query actually evaluates queries when one query depends on another.

## Scenario 1: Direct Query Referencing


I created a query named dimaccount in Power Query that reads data from a Fabric Lakehouse using the SQL Analytics endpoint. I then created another query named dimaccountReference, which references the dimaccount query.

**dimaccount**

```M
let
    Source = Sql.Database(HostName, DatabaseName),
    dbo_dimaccount = Source{[Schema="dbo",Item="dimaccount"]}[Data]
in
    dbo_dimaccount
```

**dimaccountReference**

```M
let
    Source = dimaccount
in
    Source
```

**Query Dependency View**

![captionless image](https://miro.medium.com/v2/resize:fit:428/format:webp/1*jIMEtzqR2gb8J3_QAE5Dqw.png)

After loading both queries into Power BI, I used the [Query activity](https://learn.microsoft.com/en-us/fabric/data-warehouse/query-activity) view to observe the database queries executed during refresh.

**Results**

Two queries hit the database:

![captionless image](https://miro.medium.com/v2/resize:fit:1040/format:webp/1*rqg4YCDIOrL-d7ZBDYR_Uw.png)

*   Several metadata and preview queries are executed first. These queries validate object existence, schema access, and permissions.
*   The **dimaccount** table is then queried twice, once for **dimaccount** and once for **dimaccountReference**.

Even though **dimaccountReference** references **dimaccount**, both queries independently execute against the data source.

There is another common assumption that using the **Table.Buffer** function on the referenced query (**dimaccount**) will prevent the referencing query (**dimaccountReference**) from hitting the database again. This assumption is also incorrect. Buffered results are only reused within the scope of a single query evaluation and are not shared across different queries.

In the scenario described above, buffering dimaccount can actually degrade performance, because the results would be loaded into memory twice, once for each query evaluation. More details on this behavior can be found [here](https://learn.microsoft.com/en-us/power-bi/guidance/power-query-referenced-queries#scenario) and [here](https://blog.crossjoin.co.uk/2016/11/20/referenced-queries-and-caching-in-power-bi-and-power-query/).

Let’s explore few more scenarios

## Scenario 2: Appending Queries

In this scenario, I created two queries, dimaccountAssets and dimaccountLiabilities. Both queries read from the same dimaccount table but apply different filters.

**dimaccountAssets**

```M
let
  Source           = Sql.Database(HostName, DatabaseName),
  dbo_dimaccount   = Source{[Schema = "dbo", Item = "dimaccount"]}[Data],
  #"Filtered Rows" = Table.SelectRows(dbo_dimaccount, each ([AccountType] = "Assets"))
in
  #"Filtered Rows"
```

**dimaccountLiabilities**

```M
let
  Source           = Sql.Database(HostName, DatabaseName),
  dbo_dimaccount   = Source{[Schema = "dbo", Item = "dimaccount"]}[Data],
  #"Filtered Rows" = Table.SelectRows(dbo_dimaccount, each ([AccountType] = "Liabilities"))
in
  #"Filtered Rows"
```

I then created a third query that appends these two queries using **Table.Combine**

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*bdH6atDXsZCdi7fHkWmV1g.png)

**Query Dependency View**

![captionless image](https://miro.medium.com/v2/resize:fit:1096/format:webp/1*-Y6zSBhAGFhquDUWsOmxmg.png)

All three queries were loaded into Power BI without disabling any of them.

**Results**

Three queries hit the database:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*q3RUr9OP9JgLUnJtSrhz-Q.png)

*   **dimaccountAssets** queried the table once to retrieve Asset accounts.
*   **dimaccountLiabilities** queried the table once to retrieve Liability accounts.
*   **dimaccountAppended** executed a separate query that scanned the table twice and combined the results using UNION ALL.

![captionless image](https://miro.medium.com/v2/resize:fit:1048/format:webp/1*Q97paHWMTbtiSvPlU-Tbng.png)

The generated SQL clearly shows two filtered scans of the same table, appended together.

Once again, this indicates that the appended query does not reuse the results of the referenced queries. It independently evaluates the logic defined in those queries.

In this case, the append operation successfully folded, which prevented an even worse outcome. If folding had failed, Power Query would have retrieved full datasets and performed the append locally.

## Scenario 3: Merging Queries

In this scenario, I merged the **dimaccount** table with a **factfinance** table to bring an aggregated value into the dimension.

![captionless image](https://miro.medium.com/v2/resize:fit:790/format:webp/1*ugqjq7C-z7bOu3HiMPxH_w.png)

This example is intentional. In a tabular model, this logic should be handled through relationships and measures, not in Power Query. The purpose here is to illustrate query evaluation behavior, not to recommend this pattern.

**factfinance**

```M
let
    Source = Sql.Database(HostName, DatabaseName),
    dbo_factfinance = Source{[Schema="dbo",Item="factfinance"]}[Data]
in
    dbo_factfinance
```

**dimaccount (after merge)**

```M
let
    Source = Sql.Database(HostName, DatabaseName),
    dbo_dimaccount = Source{[Schema = "dbo", Item = "dimaccount"]}[Data],
    #"Merged Queries" = Table.NestedJoin(
        dbo_dimaccount,
        {"AccountKey"},
        factfinance,
        {"AccountKey"},
        "factfinance",
        JoinKind.LeftOuter
    ),
    #"Aggregated factFinance" = Table.AggregateTableColumn(
        #"Merged Queries",
        "factfinance",
        {{"Amount", List.Sum, "Sum of Amount"}}
    )
in
    #"Aggregated factFinance"
```

**Query Dependency View**

![captionless image](https://miro.medium.com/v2/resize:fit:320/format:webp/1*J_xFT-NXNYLfv_6tP62BgA.png)

To measure query execution accurately, I disabled the standalone **factfinance** query and loaded only **dimaccount**.

Results

100 queries hit the database:

*   **dimaccount** was queried once.
*   **factfinance** was queried 99 times.

The reason is straightforward. The **dimaccount** table contains 99 distinct account keys, and for each key, Power Query executed a separate query against the **factfinance** table with a filter on that key.

![captionless image](https://miro.medium.com/v2/resize:fit:1190/format:webp/1*jp27LZswj33sOTMF0pfepQ.png)

While Power Query avoided scanning the entire fact table for each query, this execution pattern is still highly inefficient and illustrates how query dependencies can explode database activity.

You can easily handle this scenario by writing a SQL statement with a join condition and avoid hitting the db these many times, I would still want to suggest an option which I learned from [Chris Webb’s blog post](https://blog.crossjoin.co.uk/2018/03/16/improving-the-performance-of-aggregation-after-a-merge-in-power-bi-and-excel-power-query-gettransform/). Here it is

Using **Table.AddKey** function, add account key column as primary key in **dimaccount** and then perform the merge operation between **factfinance** and **dimaccount** in a different table, in my case I created a table called **dimaccountMerged**, below is the M code

**dimaccount**

```M
let
    Source = Sql.Database(HostName, DatabaseName),
    dbo_dimaccount = Source{[Schema="dbo",Item="dimaccount"]}[Data],
    Custom1 = Table.AddKey(dbo_dimaccount, {"AccountKey"}, true)
in
    Custom1
```

**dimaccountMerged**

```M
let
  #"Merged Queries" = Table.NestedJoin(
    dimaccount,
    {"AccountKey"},
    factFinance,
    {"AccountKey"},
    "factfinance",
    JoinKind.LeftOuter
  ),
  #"Aggregated factfinance" = Table.AggregateTableColumn(
    #"Merged Queries",
    "factfinance",
    {{"Amount", List.Sum, "Sum of Amount"}}
  )
in
  #"Aggregated factFinance"
```

**Query Dependency View**

![captionless image](https://miro.medium.com/v2/resize:fit:956/format:webp/1*BQ99ttJMAnnKFlNCpCZ8jA.png)

This has reduced the number of queries from 100 to 5.

![captionless image](https://miro.medium.com/v2/resize:fit:1116/format:webp/1*m-UB8jx_MFQNCymWUVUF8A.png)

One query to read the data from **factfinance** table

![captionless image](https://miro.medium.com/v2/resize:fit:1094/format:webp/1*D2QSDdU9L6UXdRt5nBO0Ew.png)

The other 4 queries are to perform the complete join operation, Power Query grouped 99 AccountKeys into multiple batches (25 accountKeys per batch) and executed one query per batch. As Chris Webb mentioned in his article, this has significantly reduced the number of queries and can improve the performance.

![captionless image](https://miro.medium.com/v2/resize:fit:1112/format:webp/1*b3MyF21gm3AV_By887_nHw.png)

## Key Observation based on 3 scenarios:


The key takeaway here is this: Each query is evaluated independently and referencing one query in another reuses transformation logic, not query results.

Queries run in parallel, maximum number of queries that run in parallel depends on [maximum number of concurrent jobs](https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-evaluation-configuration#maximum-number-of-concurrent-jobs) settings in Power BI Desktop.

If query referencing does not reduce database calls, how can we do that effectively?

**Using Power BI Dataflows**

You can create a dataflow and move all source queries other queries that contain repetitive transformation logic into it, such as **dimaccount** and **factfinance** in the scenarios discussed above. In your Power BI semantic model, connect to the dataflow and consume the data from there.

With this approach, even if multiple queries reference the same data in the semantic model, the requests are handled by the dataflow rather than being sent to the underlying data source.

While dataflows introduces one more artifact into the solution and increases the maintenance efforts, using it is one of the most effective way to reduce number of queries that hit the db.

## Additional Optimization Recommendations

If dataflows are not an option, the following practices can still help reduce database load and refresh time to some extent:

1.  [Prefer native SQL queries](https://learn.microsoft.com/en-us/power-query/native-database-query) for complex transformations. This reduces dependency on query folding and avoids inefficient execution patterns. In the merge scenario above, a single SQL query could have replaced dozens of individual queries.
2.  Uncheck “[Enable load to report](https://learn.microsoft.com/en-us/power-bi/connect-data/refresh-include-in-report-refresh#managing-loading-of-queries)” for staging queries and any queries that are not directly consumed by the report.
3.  For truly static tables whose data never changes, Uncheck the “[Include in report refresh](https://learn.microsoft.com/en-us/power-bi/connect-data/refresh-include-in-report-refresh#managing-loading-of-queries)” option. This avoids unnecessary database reads while still allowing the table to be used in the model.

In this blog, I shared my observations on how Power Query evaluates queries when using a Fabric Lakehouse SQL Analytics endpoint as the data source. Based on my experience, the behavior is largely consistent across other SQL Server–based sources, though it may vary with other sources like: Databricks, Snowflake and Redshift etc.

**Credits**: Some of the topics discussed in this blog are inspired by [Microsoft](https://www.linkedin.com/company/microsoft/) documentation and the excellent articles written by [Chris Webb](https://www.linkedin.com/in/chriswebb6?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAAAwPx4BeZwdPtuCxugZttKZIrQHWWyePW8). I hope this blog helped clarify some common assumptions and provided a few useful insights. Feel free to share your thoughts, observations, or feedback in the comments section.

Happy learning!!!