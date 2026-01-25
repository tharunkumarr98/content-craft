---
title: "Power BI: The Hidden Meaning of Percent Option in Rules Based Conditional Formatting"
date: "2026-01-25"
summary: "Percent option in Rules based conditional formatting is range based, not value based."
tags: ["Power BI", "Conditional Formatting", "Percent Option"]
---


Imagine a Power BI table visual with a column called **Product** and a measure called **Profit %**. The **Profit %** measure is formatted as a percentage.

![captionless image](images/blog/percent-option/1.png)

**Rules** based conditional formatting is applied on the **Profit %** measure to change the font color based on thresholds. The rules are defined using the **Percent** option, with the expectation that values between 15 percent and 16 percent should be in orange.

![captionless image](images/blog/percent-option/2.png)

However, the result is incorrect. A value that clearly falls between 15 percent and 16 percent is shown in green instead of orange.

![captionless image](images/blog/percent-option/3.png)

Well, I agree with the fact that the **%** is just a formatting thing and the actual result of the **Profit %** measure is a decimal value and to achieve my desired result I need to apply the same logic using **Number** rather than **Percent**.

Switched the rule type from **Percent** to **Number** and defined the thresholds using decimal values such as 0.15 and 0.16.

![captionless image](images/blog/percent-option/4.png)

the result becomes correct.

![captionless image](images/blog/percent-option/5.png)

So far, this explains how to fix the issue. But it does not answer the bigger questions.

What is the purpose of **Percent** option in **Rules** based conditional formatting?

Why does it behave this way?

Let’s find the answer

## What Does Percent Actually Mean in Rule Based Formatting

**Percent** option actually takes rule boundaries as a percent of the overall range of values from minimum to maximum. Then it checks whether that value falls in between the rule boundaries.

In other words, **Percent** is range based, not value based. It is not the format of the value you enter.

Let’s understand this **percent of the overall range of values** with the below example, a table visual with Product and Units Sold

![captionless image](images/blog/percent-option/6.png)

Here is the formula to calculate percent of overall range

((Value − MinValue) ÷ (MaxValue − MinValue)) * 100

In this example:

MinValue = 146,847

MaxValue = 338,238

For the product VTT:

((168,782–146,847) ÷ (338,238–146,847)) * 100 = 11.46

This means **VTT** sits at approximately 11.46 percent of the overall range.

Similarly, to calculate the same for all other products, the following DAX measure can be used:

```DAX
Percent of Overall Range = 
Var __Value = [Units Sold Measure]
Var __MinValue = MINX(ALLSELECTED(financials[Product]), [Units Sold Measure])
Var __MaxValue = MAXX(ALLSELECTED(financials[Product]), [Units Sold Measure]) 
Var __Result = DIVIDE(__Value - __MinValue, __MaxValue - __MinValue)
RETURN __Result
```

![captionless image](images/blog/percent-option/7.png)

I applied the below formatting rule to **Units Sold** font color

![captionless image](images/blog/percent-option/8.png)

the results align exactly with the percent of overall range values.

![captionless image](images/blog/percent-option/9.png)

Now that we understand how **Percent** option works in Rules based formatting,

Let us now apply the same logic to the **Product** and **Profit %** example.

The conditional formatting logic we applied for that example is

![captionless image](images/blog/percent-option/10.png)

When we calculate the percent of the overall range for **Profit %** across all products,

![captionless image](images/blog/percent-option/111.png)

it becomes clear why the formatting behaves the way it does. Now we can understand why only one product that **Velo** font color is in Red whereas remaining are green and no other products **Profit %** font color is in orange color.

## Takeaway

**Percent** in rules based conditional formatting does not refer to the format of the value. It represents the relative position of a value within the overall range from minimum to maximum.

This also explains why negative values cannot be entered when **Percent** is selected. A range-based percentage cannot be negative.

![captionless image](images/blog/percent-option/12.png)

In my opinion, calling this option Percent is misleading. A more accurate name would be **RangePercent**. Interestingly, when looking into the report definition in PBIR format, the internal name used for this option is **RangePercent**, which perfectly describes its behavior.

![captionless image](images/blog/percent-option/13.png)

## Conclusion

If you want to apply conditional formatting based on actual percentage values, always use the **Number** option and define thresholds using decimal values.

Use the **Percent** option only when you want relative, overall range-based comparisons.

What are your thoughts on this behavior? Feel free to share them in the comments.

Hope you learned something new.

Happy learning.