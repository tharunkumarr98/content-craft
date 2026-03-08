---
title: "Power BI: Per-Value-Column Sorting in a Matrix"
date: "2026-03-08"
summary: "Pro tip to sort a matrix with a field in columns well."
tags: ["Power BI", "DAX"]
---

## Problem Statement

I have a Matrix visual with the **“Continent”** column placed in the **Rows** well, the **“Time Calc”** column (in this scenario column is taken from a calculation group table, however same workaround can be used even when the column is taken from a normal table) placed in the **Columns** well, and **“Sales Amount”** placed in the **Values** well, as shown below.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Ef9OJqoFCTa6tlvTIBU-gA.png)

I wanted to sort the **Continents** based on the **QTD** value in **descending order**.

By default, the Matrix visual does **not support per-value sorting**. In this scenario, you can follow the trick below to achieve this.

## Procedure

1.  Create a a new DAX measure

```DAX
SortingMeasure = 
Var __CYRank = RANK(DENSE, ALLSELECTED(Customer[Continent]), ORDERBY(Sales[Sales Amount],DESC))
Var __CalcItem = SELECTEDVALUE('Time Intelligence'[Ordinal],0)
Var __ReturnOnlyIfCY = IF(__CalcItem = 3, __CYRank)  // For QTD the ordinal value is 3
Return __ReturnOnlyIfCY 
```

2. Add this measure to the Matrix Values well

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*2pKesQx0qSv8MSiqhYB4mQ.png)

3. Sort the Matrix visual based on **SortingMeasure**.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*c7MSKo-aXTCRDeGV79md5A.png)

4. Once the desired sorting is achieved, it is very important to **hide the sorting measure** from the Matrix.

5. Change the **format string** of `SortingMeasure` to **Dynamic** and use the following expression:

```DAX
UNICHAR(127)
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*UMM_1G_SYoaVQ1ampewjSQ.png)

This hides the value of the sorting measure.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*FLv8IcuY4jis76dLyIy3RQ.png)

6. At the visual level, rename **SortingMeasure**, **Sales Amount**, and **Continent** to a blank space, and rename the **Time Calc** column to “Continent”.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*UurVkL8NszeVnTsMJbTH7A.png)

That’s it! You are now able to perform **per-value sorting in a Matrix visual**.

## Note

1.  This workaround can be applied even when you have a normal column in Columns well, not only when you have a Calculation group column.
2.  RANK function used for sorting does support multi criteria, which means even when two continents have same QTD value it will check the second criteria to give the least rank among those two continents.
3.  This is a **workaround** to implement per-value sorting in a Matrix, as this functionality is **not natively available**. In certain scenarios — such as when users export the data, the invisible characters used in this method might cause confusion. Therefore, test it thoroughly before implementing it in **production reports**.

Happy Learning!!!