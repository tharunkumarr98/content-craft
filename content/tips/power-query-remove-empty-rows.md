---
title: "Power Query: Remove Empty Rows Fast"
date: "2025-01-14"
summary: "Clean your data instantly by removing all empty rows in Power Query."
tags: ["Power Query", "Data Cleaning", "Quick Wins"]
---

## Remove Empty Rows

In Power Query, removing empty rows is straightforward:

```powerquery
= Table.SelectRows(Source, each not List.IsEmpty(List.RemoveMatchingItems(Record.FieldValues(_), {"", null})))
```

### Alternative Method

For simpler cases, use the built-in filter:

1. Select all columns
2. Go to **Home → Remove Rows → Remove Blank Rows**

This instantly cleans your dataset!