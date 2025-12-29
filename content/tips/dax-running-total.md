---
title: "Quick DAX: Calculate Running Total"
date: "2025-01-15"
summary: "A quick pattern for calculating running totals in Power BI using DAX."
tags: ["DAX", "Power BI", "Quick Wins"]
---

## Running Total Pattern

Use this DAX pattern for a cumulative running total:

```dax
Running Total = 
CALCULATE(
    SUM(Sales[Amount]),
    FILTER(
        ALL(Calendar[Date]),
        Calendar[Date] <= MAX(Calendar[Date])
    )
)
```

### When to Use

- Sales cumulative totals
- Year-to-date calculations
- Inventory tracking

**Pro tip**: Always ensure your date table is marked as a date table for best performance.