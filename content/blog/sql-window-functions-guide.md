---
title: "SQL Window Functions: From Basics to Advanced Analytics"
date: "2024-12-05"
summary: "A practical guide to SQL window functions including ROW_NUMBER, LAG, LEAD, and running totals. Learn how to solve complex analytical problems with elegant solutions."
tags: ["SQL", "Analytics", "Tutorial"]
---

Window functions are one of SQL's most powerful features for analytics. They allow you to perform calculations across related rows without collapsing the result set.

## What Are Window Functions?

Unlike aggregate functions (SUM, COUNT, AVG), window functions don't group rows. Instead, they compute values across a "window" of related rows while preserving individual row detail.

## Basic Syntax

```sql
function_name() OVER (
    PARTITION BY column1, column2
    ORDER BY column3
    ROWS BETWEEN start AND end
)
```

## ROW_NUMBER, RANK, and DENSE_RANK

These ranking functions are essential for many analytical queries:

```sql
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
```

## LAG and LEAD for Row Comparisons

Compare values with previous or next rows:

```sql
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
```

## Running Totals and Moving Averages

```sql
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
```

## Practical Example: Customer Analytics

```sql
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
```

## Performance Tips

1. **Index the PARTITION BY and ORDER BY columns**
2. **Avoid unnecessary window functions** - They add computation overhead
3. **Use CTEs for complex calculations** - Break down complex queries
4. **Consider materialized views** - For frequently-used window calculations

## Conclusion

Window functions are essential tools for any data analyst. Start with simple ranking and gradually explore more complex patterns. The key is practice—try applying these patterns to your own datasets.
