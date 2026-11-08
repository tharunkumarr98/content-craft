---
title: "Your Fabric Notebook Is Paying for a Cluster It Doesn’t Use"
date: "2026-11-08"
summary: "I show how a single DAX UDF function can cater all your numeric format string requirements."
tags: ["Fabric", "Notebook", "Capacity Consumption"]
---

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*L31gYjC2lX5OWf_nTkE7OQ.png)

Fabric notebooks are my go-to for pulling data from APIs. I’m a Power BI developer learning data engineering, and I realized I was wasting a lot of capacity (CUs), because my scripts never needed the compute Fabric was giving them.

Fabric charges CUs for the resources you **allocate**, not the resources your code **needs**. It’s like a taxi: the meter keeps running while the car waits outside the shop.

In this post I show how the default Spark settings can eat your capacity, and how configuring them based on the task you are trying to achieve would cut CU usage by a large margin.

## The test

I wrote a PySpark notebook that calls the [USGS earthquake API](https://earthquake.usgs.gov/fdsnws/event/1/), fetches about 1M rows, and stores them in a Delta table.

I ran it in a brand new workspace on a Fabric trial capacity (F64), the default Starter Pool. Nothing was tweaked.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ScGqM00hetL6Rj6pzmf4xg.png)

and with Runtime 2.0 ([Spark 4.1 and Delta 4.2](https://learn.microsoft.com/en-us/fabric/data-engineering/runtime-2-0))

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*sgQFd4wpknptGN6eoWNFIw.png)

To measure each run exactly, I logged its operation ID (to find its CU usage in the capacity metrics, [Chris Webb has written a detailed blog about how to find the total CU usage of an operation using operation ID from the capacity metrics app](https://blog.crossjoin.co.uk/2025/09/14/how-to-get-the-details-of-power-bi-operations-seen-in-the-capacity-metrics-app/)) and added timers in the code. The durations below cover my code only, not session start-up.

## Run 1: default settings


This is what my notebook reported for the default session:

```text
Spark Cluster Config
vorder.default : false
driver         : 8 cores, 56g
executor       : 8 cores, 56g
executors      : 1 - 9
```

**Execution Duration**

*   Data Fetching: 169.64 s
*   Transforming (json to spark df): 18.75 s
*   Write to delta table: 80.22 s
*   **Total: 279.21 s**

**Total CUs consumed: 3,236.2**

## Run 2: small custom environment

Same notebook, no code changes. This time I created a new environment with a custom pool: node size **Small**, and dynamic allocation set to **1**. Native execution engine turned off.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*sdMJKW3jfVKTwia1HynKxw.png)

```text
Spark Cluster Config

vorder.default : false
driver         : 2 cores, 14g
executor       : 2 cores, 14g
executors      : 1 - 1
```

Note: since I selected number of executors as 1, the 4 core 28GB node is split into 2 cores and 14 GB each, one for the driver and one for the executor, since the same node acts as driver and executor.

I ran the notebook and below are the results.

**Duration**

*   Data Fetching: 192.46 s
*   Transforming (json to spark df): 21.97 s
*   Write to delta table: 34.67 s
*   **Total: 255.01 s**

**Total CUs consumed: 575.6**

Note: When you are using custom spark pools there would be a delay in spinning up the cluster anywhere between 2 to 5 mins, because these small sized nodes are not available all the time by default. Until the spark session is initialized it will not start incurring CUs. However, you can make them available all the time by enabling the [live pool option](https://learn.microsoft.com/en-us/fabric/data-engineering/custom-live-pools-overview) under spark settings in your environment. I would not recommend turning it on unless you have workloads that keep running at any given point of time. In the above durations I did not consider that delay in spinning up the small-sized node cluster.

### Why the difference?

Fabric converts compute to CUs with a simple rule: [2 Spark vCores equal 1 CU](https://community.fabric.microsoft.com/t5/Data-Engineering/Does-the-2-VCores-1-CU-conversion-also-hold-for-Python/m-p/4990932).

1.  The Starter Pool uses [Medium nodes](https://learn.microsoft.com/en-us/fabric/data-engineering/configure-starter-pools): 8 cores and 56g each for the driver and for every executor. That’s 4 CU per node, every second, whether your code uses it or not. With the minimum of one executor, a driver plus an executor is 8 CU just to exist.
2.  For about 160 seconds my notebook was only waiting for API pages. During that time one node did the work and the other sat idle, and both were billed.
3.  In the custom environment I used [Small nodes](https://learn.microsoft.com/fabric/data-engineering/create-custom-spark-pools) (4 cores, 28g) and a single node doing both driver and executor work. That’s 2 CU.
4.  Same code, same data, same table. Only the allocation changed.

## Can we go even lower?


Think about what this notebook really does: call an API, flatten the JSON, write a Delta table. There are no complex transformations. That doesn’t need Spark.

A Python notebook runs on a single small container with [2 vCores by default](https://community.fabric.microsoft.com/t5/Data-Engineering/Does-the-2-VCores-1-CU-conversion-also-hold-for-Python/m-p/4990932), which is 1 CU.

## How do you write a Delta table without Spark?

Python notebooks use [delta-rs, DuckDB and Polars](https://learn.microsoft.com/fabric/get-started/delta-lake-interoperability) instead of Spark’s Delta writer. I used Polars, which is preinstalled and writes Delta through delta-rs. I learned this from [Fabric Guru](https://hashnode.com/posts/working-with-delta-tables-in-fabric-python-notebook-using-polars/675002a84da983c67d1710ee).

```Python
import polars as pl
df = pl.DataFrame(records)
path = (
    "abfss://<workspace-id>@onelake.dfs.fabric.microsoft.com/"
    "<lakehouse-id>/Tables/<Schemaname>/<TableName>"
)
df.write_delta(path, mode="overwrite")
```

The result is a normal Delta table that Spark and every other Fabric engine can read.

I kept the API fetch code as it was, switched the notebook to Python, and replaced the Spark-specific parts (the Spark DataFrame and the Delta write) with Polars.

*   Data Fetching: 160.8 s
*   Transforming (json to spark df): 6.39 s
*   Write to delta table: 3.99 s
*   **Total: 176.43 s**

**Total CUs: 198.4**

To rule out noise, I ran each setup three times (duration, total CUs):

*   **Spark Notebook (Default Settings):** Run 1: 279.21 s, 3,236.2 CUs | Run 2: 229 s, 2,326.0 CUs | Run 3: 243 s, 2,384.3 CUs
*   **Spark Notebook (Small sized node):** Run 1: 255.01 s, 575.6 CUs | Run 2: 265 s, 531.4 CUs | Run 3: 126 s, 253.9 CUs
*   **Python Notebook:** Run 1: 198.4 s, 198.4 CUs | Run 2: 201 s, 201.0 CUs | Run 3: 207 s, 207.0 CUs

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*xXPJL5MTbVRdZe0dUFymtQ.png)

On an average, default about 2,649 CU(s), small sized node about 454, Python about 202. That gives roughly **13x** (default vs Python), **2x** (small vs Python) and **5.8x** (default vs small).

Note: I added a cell at the end of each notebook to stop the session right after execution. Interactive Spark sessions expire after 20 minutes of inactivity by default, and billing continues until the session stops or expires, so leaving it open would add CU(s) to the run. The stop cell makes sure the numbers reflect only the run.

## The catch


*   **The path matters.** Write to the wrong path and your files land in an [“Unidentified” folder](https://community.fabric.microsoft.com/t5/Data-Engineering/write-deltalake-with-Python-Notebook-is-creating-an-quot/m-p/4407839) instead of showing as a table. Use the full ABFS path, including the schema name.
*   Big joins and heavy transformations still belong in Spark, and Microsoft recommends falling back to PySpark when a [Delta feature isn’t available in Python notebooks](https://learn.microsoft.com/fabric/get-started/delta-lake-interoperability).

## What about V-Order?


Python notebooks can’t write [V-Ordered tables](https://community.fabric.microsoft.com/t5/Fabric-Ideas/Write-V-Ordered-delta-lake-tables-using-Polars/idc-p/4918604), so you might think that’s a dealbreaker. For this job it isn’t.

V-Order is a write-time optimization that lays out Parquet files for faster reads, mostly useful when Power BI reads the table. The price is slower writes, [about 15% on average according to Microsoft](https://learn.microsoft.com/fabric/data-engineering/delta-optimization-and-v-order). That’s why it is **disabled by default** in new workspaces, and my notebook confirmed it: `vorder.default : false`.

To get V-Order in Spark you have to turn it on yourself, either with the `spark.sql.parquet.vorder.default` session setting or by switching the workspace to the [readHeavyForPBI resource profile](https://learn.microsoft.com/en-us/fabric/data-engineering/resource-profiles-overview). The default profile, `writeHeavy`, keeps it off.

And in a medallion architecture, fetching data and storing it is a **bronze** job. Bronze is a landing zone: raw data goes in, and the next job reads it. Nobody builds reports on it, so paying extra write time for faster report reads makes no sense there. V-Order belongs in the layer that reports read, usually gold. So losing it in a Python notebook costs me nothing here. (If a Direct Lake model reads a table you write from Python, test it first: Fabric Guru covers [how file layout affects Direct Lake](https://hashnode.com/posts/delta-lake-tables-for-optimal-direct-lake-performance-in-fabric-python-notebook/675397a2ee6243740f4d01ba).)

## Which one should you use?

Well, the intention of this blog is not to conclude that spark notebooks are bad and python notebooks are good. Each variant has its own benefits, so choose the one that fits the task.

*   Fetching data from APIs or files, small data: **Python notebook**.
*   Need Spark features, small data: **Spark with a small custom environment**.
*   Big joins and transformations of data: **Spark, sized for the job**.

## Conclusion

Fabric bills for what you allocate, not what you use. Check your notebooks that mostly call APIs, because they’re probably paying for a cluster they never use.

I hope you learned something new with this blog, please share your thoughts in the comments section.

Happy Learning!!