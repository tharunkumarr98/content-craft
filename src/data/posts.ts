export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  readingTime: number;
  content: string;
}

// Sample blog posts - in a real static site, these would be loaded from markdown files
export const posts: BlogPost[] = [
  {
    slug: "getting-started-with-microsoft-fabric",
    title: "Getting Started with Microsoft Fabric: A Complete Guide",
    date: "2024-12-20",
    summary: "Learn the fundamentals of Microsoft Fabric, from lakehouse architecture to data pipelines. This comprehensive guide covers everything you need to start building modern data solutions.",
    tags: ["Microsoft Fabric", "Data Engineering", "Tutorial"],
    readingTime: 12,
    content: `
Microsoft Fabric is revolutionizing how organizations handle their data analytics needs. In this comprehensive guide, we'll explore the core concepts and get you up and running with your first Fabric project.

## What is Microsoft Fabric?

Microsoft Fabric is an all-in-one analytics solution for enterprises that covers everything from data movement to data science, Real-Time Analytics, and business intelligence. It's built on a foundation of Software as a Service (SaaS), which means it's easy to get started and scales effortlessly.

### Key Components

1. **Data Factory** - For data integration and ETL
2. **Synapse Data Engineering** - For big data processing
3. **Synapse Data Science** - For machine learning workloads
4. **Synapse Data Warehouse** - For enterprise data warehousing
5. **Real-Time Analytics** - For streaming data scenarios
6. **Power BI** - For business intelligence and visualization

## Setting Up Your First Lakehouse

Let's create a simple lakehouse and load some data using PySpark:

\`\`\`python
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, when, lit

# Create a simple DataFrame
data = [
    ("Product A", 100, "Electronics"),
    ("Product B", 250, "Clothing"),
    ("Product C", 75, "Electronics"),
]

df = spark.createDataFrame(data, ["product_name", "price", "category"])

# Apply transformations
df_transformed = df.withColumn(
    "price_tier",
    when(col("price") < 100, "Budget")
    .when(col("price") < 200, "Mid-Range")
    .otherwise("Premium")
)

# Write to lakehouse
df_transformed.write.format("delta").mode("overwrite").save(
    "Tables/products"
)
\`\`\`

## Querying Data with SQL

Once your data is in the lakehouse, you can query it using familiar SQL syntax:

\`\`\`sql
SELECT 
    category,
    COUNT(*) as product_count,
    AVG(price) as avg_price,
    SUM(price) as total_value
FROM products
WHERE price > 50
GROUP BY category
ORDER BY total_value DESC;
\`\`\`

## Creating DAX Measures

When building Power BI reports on top of your Fabric data, you'll need DAX measures:

\`\`\`dax
Total Sales = 
SUMX(
    Sales,
    Sales[Quantity] * Sales[UnitPrice]
)

YoY Growth = 
VAR CurrentYear = [Total Sales]
VAR PreviousYear = 
    CALCULATE(
        [Total Sales],
        SAMEPERIODLASTYEAR('Date'[Date])
    )
RETURN
DIVIDE(CurrentYear - PreviousYear, PreviousYear)
\`\`\`

## Power Query for Data Transformation

For simpler transformations, Power Query (M) is incredibly powerful:

\`\`\`powerquery
let
    Source = Sql.Database("server", "database"),
    FilteredRows = Table.SelectRows(Source, each [Status] = "Active"),
    AddedColumn = Table.AddColumn(
        FilteredRows, 
        "FullName", 
        each [FirstName] & " " & [LastName]
    ),
    ChangedTypes = Table.TransformColumnTypes(
        AddedColumn,
        {{"FullName", type text}}
    )
in
    ChangedTypes
\`\`\`

## Best Practices

- **Use medallion architecture** - Organize your data into Bronze, Silver, and Gold layers
- **Implement incremental refresh** - Don't reload all data every time
- **Monitor capacity usage** - Keep an eye on your compute consumption
- **Version control notebooks** - Use Git integration for your code

## Conclusion

Microsoft Fabric provides a unified platform for all your analytics needs. By understanding its core components and following best practices, you can build robust, scalable data solutions.

In the next article, we'll dive deeper into building real-time analytics solutions with Fabric's streaming capabilities.
`
  },
  {
    slug: "advanced-dax-patterns-time-intelligence",
    title: "Advanced DAX Patterns: Time Intelligence Deep Dive",
    date: "2024-12-15",
    summary: "Master complex time intelligence calculations in DAX including YTD, QTD, rolling averages, and comparison periods. Includes real-world examples and performance tips.",
    tags: ["DAX", "Power BI", "Time Intelligence"],
    readingTime: 15,
    content: `
Time intelligence is one of the most powerful features in DAX. In this deep dive, we'll explore advanced patterns that go beyond simple year-to-date calculations.

## Prerequisites

Before diving in, ensure you have:
- A proper date table with no gaps
- Relationships set up correctly
- Basic understanding of CALCULATE and filter context

## Building a Robust Date Table

First, let's create a comprehensive date table:

\`\`\`dax
DateTable = 
VAR StartDate = DATE(2020, 1, 1)
VAR EndDate = DATE(2025, 12, 31)
RETURN
ADDCOLUMNS(
    CALENDAR(StartDate, EndDate),
    "Year", YEAR([Date]),
    "Month", MONTH([Date]),
    "MonthName", FORMAT([Date], "MMMM"),
    "Quarter", "Q" & CEILING(MONTH([Date]) / 3, 1),
    "YearMonth", FORMAT([Date], "YYYY-MM"),
    "WeekNum", WEEKNUM([Date]),
    "DayOfWeek", WEEKDAY([Date]),
    "IsWeekend", IF(WEEKDAY([Date]) IN {1, 7}, TRUE, FALSE)
)
\`\`\`

## Year-Over-Year Comparison

The classic YoY comparison with proper handling of incomplete periods:

\`\`\`dax
YoY % Change = 
VAR CurrentValue = [Total Sales]
VAR PriorYearValue = 
    CALCULATE(
        [Total Sales],
        SAMEPERIODLASTYEAR(DateTable[Date])
    )
VAR Result = 
    DIVIDE(
        CurrentValue - PriorYearValue,
        PriorYearValue
    )
RETURN
IF(
    NOT ISBLANK(PriorYearValue),
    Result,
    BLANK()
)
\`\`\`

## Rolling Averages

Calculate a 3-month rolling average:

\`\`\`dax
Rolling 3M Average = 
AVERAGEX(
    DATESINPERIOD(
        DateTable[Date],
        MAX(DateTable[Date]),
        -3,
        MONTH
    ),
    CALCULATE([Total Sales])
)
\`\`\`

## SQL for Data Preparation

Sometimes it's more efficient to prepare time-based aggregations in SQL:

\`\`\`sql
WITH monthly_sales AS (
    SELECT 
        DATE_TRUNC('month', sale_date) as month,
        SUM(amount) as total_sales,
        COUNT(DISTINCT customer_id) as unique_customers
    FROM sales
    WHERE sale_date >= DATEADD(year, -2, GETDATE())
    GROUP BY DATE_TRUNC('month', sale_date)
),
with_lag AS (
    SELECT 
        *,
        LAG(total_sales, 12) OVER (ORDER BY month) as sales_last_year,
        AVG(total_sales) OVER (
            ORDER BY month 
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ) as rolling_3m_avg
    FROM monthly_sales
)
SELECT 
    month,
    total_sales,
    unique_customers,
    rolling_3m_avg,
    (total_sales - sales_last_year) / NULLIF(sales_last_year, 0) as yoy_growth
FROM with_lag
ORDER BY month DESC;
\`\`\`

## Performance Considerations

When working with time intelligence:

1. **Avoid iterating over large date ranges** - Use variables to store intermediate results
2. **Use CALCULATE instead of FILTER** when possible
3. **Mark your date table** as a date table in Power BI
4. **Consider pre-aggregating** at the data source level for very large datasets

## Conclusion

Mastering time intelligence in DAX opens up powerful analytical capabilities. Practice these patterns with your own data to become proficient.
`
  },
  {
    slug: "power-query-performance-optimization",
    title: "Power Query Performance: Tips for Faster Data Loading",
    date: "2024-12-10",
    summary: "Optimize your Power Query transformations for better performance. Learn about query folding, best practices for large datasets, and common performance pitfalls.",
    tags: ["Power Query", "Performance", "Power BI"],
    readingTime: 10,
    content: `
Slow Power Query performance can be frustrating. In this article, we'll explore techniques to dramatically speed up your data loading.

## Understanding Query Folding

Query folding is the process where Power Query translates transformations into native queries that run on the source system. This is crucial for performance.

### Check if Folding is Happening

Right-click on any step and look for "View Native Query". If it's grayed out, folding has stopped.

## Optimizations That Preserve Folding

Here's a pattern that maintains query folding:

\`\`\`powerquery
let
    // Good: These operations typically fold
    Source = Sql.Database("server", "database"),
    
    // Filtering early is crucial
    FilteredByDate = Table.SelectRows(
        Source, 
        each [OrderDate] >= #date(2024, 1, 1)
    ),
    
    // Column selection reduces data transfer
    SelectedColumns = Table.SelectColumns(
        FilteredByDate,
        {"OrderID", "CustomerID", "OrderDate", "Amount"}
    ),
    
    // Sorting at the source is efficient
    SortedRows = Table.Sort(
        SelectedColumns,
        {{"OrderDate", Order.Descending}}
    )
in
    SortedRows
\`\`\`

## Operations That Break Folding

Be aware of these folding-breakers:

\`\`\`powerquery
let
    Source = Sql.Database("server", "database"),
    
    // Warning: Table.Buffer breaks folding
    Buffered = Table.Buffer(Source),
    
    // Warning: Custom functions often break folding
    AddedCustom = Table.AddColumn(
        Source, 
        "Custom", 
        each CustomFunction([Column])
    )
in
    AddedCustom
\`\`\`

## Python for Heavy Processing

For complex transformations, consider using Python in Fabric:

\`\`\`python
import pandas as pd
import numpy as np

def optimize_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Apply memory-efficient transformations."""
    
    # Use categorical for low-cardinality columns
    for col in ['Status', 'Category', 'Region']:
        if col in df.columns:
            df[col] = df[col].astype('category')
    
    # Downcast numeric types
    for col in df.select_dtypes(include=['int64']).columns:
        df[col] = pd.to_numeric(df[col], downcast='integer')
    
    for col in df.select_dtypes(include=['float64']).columns:
        df[col] = pd.to_numeric(df[col], downcast='float')
    
    return df

# Apply optimizations
df = optimize_dataframe(df)
print(f"Memory usage: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
\`\`\`

## Key Takeaways

1. **Filter early** - Reduce row count as soon as possible
2. **Select only needed columns** - Don't bring unnecessary data
3. **Preserve query folding** - Check native query availability
4. **Use Table.Buffer strategically** - Only when necessary
5. **Consider source-side processing** - Move logic to SQL when possible

With these optimizations, you can significantly reduce refresh times and improve the overall user experience.
`
  },
  {
    slug: "sql-window-functions-guide",
    title: "SQL Window Functions: From Basics to Advanced Analytics",
    date: "2024-12-05",
    summary: "A practical guide to SQL window functions including ROW_NUMBER, LAG, LEAD, and running totals. Learn how to solve complex analytical problems with elegant solutions.",
    tags: ["SQL", "Analytics", "Tutorial"],
    readingTime: 14,
    content: `
Window functions are one of SQL's most powerful features for analytics. They allow you to perform calculations across related rows without collapsing the result set.

## What Are Window Functions?

Unlike aggregate functions (SUM, COUNT, AVG), window functions don't group rows. Instead, they compute values across a "window" of related rows while preserving individual row detail.

## Basic Syntax

\`\`\`sql
function_name() OVER (
    PARTITION BY column1, column2
    ORDER BY column3
    ROWS BETWEEN start AND end
)
\`\`\`

## ROW_NUMBER, RANK, and DENSE_RANK

These ranking functions are essential for many analytical queries:

\`\`\`sql
SELECT 
    product_name,
    category,
    price,
    ROW_NUMBER() OVER (ORDER BY price DESC) as row_num,
    RANK() OVER (ORDER BY price DESC) as rank,
    DENSE_RANK() OVER (ORDER BY price DESC) as dense_rank,
    ROW_NUMBER() OVER (
        PARTITION BY category 
        ORDER BY price DESC
    ) as category_rank
FROM products;
\`\`\`

## LAG and LEAD for Row Comparisons

Compare values with previous or next rows:

\`\`\`sql
SELECT 
    sale_date,
    daily_revenue,
    LAG(daily_revenue, 1) OVER (ORDER BY sale_date) as prev_day,
    LEAD(daily_revenue, 1) OVER (ORDER BY sale_date) as next_day,
    daily_revenue - LAG(daily_revenue, 1) OVER (ORDER BY sale_date) as day_over_day_change,
    ROUND(
        100.0 * (daily_revenue - LAG(daily_revenue, 1) OVER (ORDER BY sale_date)) 
        / NULLIF(LAG(daily_revenue, 1) OVER (ORDER BY sale_date), 0),
        2
    ) as pct_change
FROM daily_sales
ORDER BY sale_date;
\`\`\`

## Running Totals and Moving Averages

\`\`\`sql
SELECT 
    transaction_date,
    amount,
    SUM(amount) OVER (
        ORDER BY transaction_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) as running_total,
    AVG(amount) OVER (
        ORDER BY transaction_date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as seven_day_avg,
    SUM(amount) OVER (
        PARTITION BY EXTRACT(MONTH FROM transaction_date)
        ORDER BY transaction_date
    ) as monthly_running_total
FROM transactions;
\`\`\`

## Practical Example: Customer Analytics

\`\`\`sql
WITH customer_orders AS (
    SELECT 
        customer_id,
        order_date,
        order_total,
        ROW_NUMBER() OVER (
            PARTITION BY customer_id 
            ORDER BY order_date
        ) as order_number,
        SUM(order_total) OVER (
            PARTITION BY customer_id 
            ORDER BY order_date
        ) as lifetime_value,
        AVG(order_total) OVER (
            PARTITION BY customer_id
        ) as avg_order_value,
        DATEDIFF(
            day,
            LAG(order_date) OVER (
                PARTITION BY customer_id 
                ORDER BY order_date
            ),
            order_date
        ) as days_since_last_order
    FROM orders
)
SELECT *
FROM customer_orders
WHERE order_number <= 5  -- First 5 orders per customer
ORDER BY customer_id, order_number;
\`\`\`

## Performance Tips

1. **Index the PARTITION BY and ORDER BY columns**
2. **Limit the window frame when possible** - ROWS BETWEEN is often faster than RANGE
3. **Pre-filter data** before applying window functions
4. **Consider materialized views** for frequently used window calculations

Window functions are indispensable for modern data analytics. Master them, and you'll write cleaner, more efficient SQL.
`
  }
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find(post => post.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostsByTag(tag: string): BlogPost[] {
  return posts.filter(post => post.tags.includes(tag)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  posts.forEach(post => post.tags.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}
