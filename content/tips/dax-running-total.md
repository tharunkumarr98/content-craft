---
title: "Quick DAX: TOP N Items"
date: "2025-12-30"
summary: "A quick pattern to show Top n items without using visual level 'TOP N' filter or RANKX or RANK function based measure"
tags: ["Power BI", "DAX"]
---

## Top N Items Pattern
Lets say you have a **SalesAmount** measure
```dax
SalesAmount = 
SUMX(
    sales_rawtransactions,
    sales_rawtransactions[quantity_sold] * sales_rawtransactions[product_price]
)
```

To get top n items you can use this DAX pattern can avoid using visual level **TOP N** filter or `RANKX` or `RANK` function based measure:

```dax
Top N Products = 
VAR __TopNTable = 
TOPN(
    5,
    ALLSELECTED(sales_rawtransactions[product_name]),
    [SalesAmount],
    DESC
)
VAR __Result = CALCULATE(
    [SalesAmount],
    KEEPFILTERS(__TopNTable)
)
RETURN
    __Result

```

## When to Use

- To get topn items without `RANK` or `RANKX` function based measure
- To get topn items without visual level **TOP N** filter

## Pro tip
Sometimes visual level measure filtes causes performance issues, avoid this kind of patterns to avoid those scenarios.