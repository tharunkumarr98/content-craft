---
title: "SQL: Quick NULL Handling"
date: "2025-01-13"
summary: "Handle NULL values elegantly with COALESCE and ISNULL functions."
tags: ["SQL", "Data Cleaning", "Quick Wins"]
---

## COALESCE vs ISNULL

Both handle NULLs, but they differ:

```sql
-- COALESCE: Standard SQL, multiple arguments
SELECT COALESCE(column1, column2, 'default') FROM table;

-- ISNULL: SQL Server specific, two arguments only
SELECT ISNULL(column1, 'default') FROM table;
```

### Pro Tip

Use `COALESCE` for portability across different SQL databases.