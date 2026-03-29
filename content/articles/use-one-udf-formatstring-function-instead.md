---
title: "Power BI — Stop Writing Format Strings for Every Measure | Use This One DAX UDF Function Instead"
date: "2026-03-29"
summary: "I show how a single DAX UDF function can cater all your numeric format string requirements."
tags: ["Power BI", "Fromat String", "User Defined Function"]
---

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*L1u6buNlL0vscbQnYz_LCw.png)

## Problem Statement
If you’ve built more than a handful of Power BI semantic models, you know the fact that the requirements of numeric format strings are different in different scenarios. One needs currency symbol prefix ($, or ₹ etc). One needs thousand separator, one needs values to be in multiples of thousand like (K, M, B, T) and one needs the negative numbers to be in brackets and one needs an arrow or a delta symbol after the value. Likewise the requirements are a ton. In such scenarios often developers rely on [FORMAT](https://learn.microsoft.com/en-us/dax/format-function-dax) function and change the formatting which could convert the number measure into text and degrades the performance as well. Or they rely on [Dynamic Format String](https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-dynamic-format-strings) which is lot better than FORMAT function, however, hardcoding the format strings in each and every measure can also cause problems, what if your customer asks you to change the currency symbol from dollar to Euro, you need to update each and every format string manually or use TMDL view to update them in bulk.

## Solution
What if I tell you that I wrote one model independent DAX [User Defined Function](https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-user-defined-functions-overview) which can cover all the scenarios of numeric value formatting and you can use it in every model? Yes you read it right, lets understand how it works.

I am taking a numeric column with values ranging from negative 1 trillion to positive 3 trillion to demonstrate this.

![captionless image](https://miro.medium.com/v2/resize:fit:1092/format:webp/1*CcBoTFwVjzqnUh6OPc2Pfg.png)

I created a DAX measure called **NumericValue** and set its format string to dynamic.

```DAX
NumericValue = SUM(NumbericTable[Number])
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*rwGYvmZB0IOfjdB21fUfFA.png)

Now I will show you how the function “**GetNumericDynamicFormatString”** applies different format strings to this measure just by passing different combination of argument values — without writing any additional code.


The function accepts 10 arguments:

*   **Val** _(ANYREF)_ — The numeric value passed to the function.
*   **numberOfDecimalPlaces** _(NUMERIC)_ — Number of decimal places you want to show.
*   **currencyName** _(STRING)_ — Name of the currency you want to prefix. Supported values are “United States Dollar”, “Indian Rupee”, “Europe Euro”, “Chinese Yuan” and “Japanese Yen”.
*   **thousandSeperator** _(BOOLEAN)_ — Set to TRUE() to add comma separators.
*   **multiplesOfThousand** _(BOOLEAN)_ — Set to TRUE() to auto-scale the number and display it as K, M, B or T depending on its value.
*   **negativeNumbersBracket** _(BOOLEAN)_ — Set to TRUE() to display negative numbers as (value) instead of -value.
*   **truncateZero** _(BOOLEAN)_ — Set to TRUE() to display zero as plain 0, ignoring all other formatting.
*   **deltaIconRequired** _(BOOLEAN)_ — Set to TRUE() to append a trend icon after the value.
*   **preferredPositiveDeltaIcon** _(STRING)_ — The icon to show after positive values. Works only when deltaIconRequired is TRUE(). You can pass any symbol like ↑, 📈 or ✓.
*   **preferredNegativeDeltaIcon** _(STRING)_ — The icon to show after negative values. Works only when deltaIconRequired is TRUE(). You can pass any symbol like ↓, 📉 or ✗.

## Scenario 1: Increase the number of decimal places to 4.
Set **numberOfDecimalPlaces** to 4, leave everything else off.

```DAX
getNumericDynamicFormatString(SELECTEDMEASURE(), 4, "", FALSE(), FALSE(), FALSE(), FALSE(), FALSE(), "","")
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*oiULrrTE3zo5kH2jLIMJsQ.png)

## Scenario 2: Indian Rupee currency symbol 
Pass “Indian Rupee” as **currencyName** and the ₹ symbol gets prefixed automatically.

```DAX
getNumericDynamicFormatString(SELECTEDMEASURE(), 4, "Indian Rupee", FALSE(), FALSE(), FALSE(), FALSE(), FALSE(), "","")
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*w4-N52A2xPEMErKdXF4baA.png)

## Scenario 3: Thousand Separator

Set **thousandSeperator** to TRUE() and commas appear in the right places.

```DAX
getNumericDynamicFormatString(SELECTEDMEASURE(), 4, "Indian Rupee", TRUE(), FALSE(), FALSE(), FALSE(), FALSE(), "","")
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*mLpkqcQL5ikp1LCSc7yyXg.png)

## Scenario 4: Auto scale to K, M, B, T 
Enable **multiplesOfThousand** and the function checks the absolute value at runtime and decides whether to show K, M, B or T. No separate measures, no IF conditions in your format string.

```DAX
getNumericDynamicFormatString(SELECTEDMEASURE(), 4, "Indian Rupee", TRUE(), TRUE(), FALSE(), FALSE(), FALSE(), "","")
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*gmpuHWVIresqzWgt2-bV7w.png)

## Scenario 5: Bracket style negatives 
Set **negativeNumbersBracket** to TRUE() and your negatives render as (1,234) instead of -1,234. Finance teams will stop complaining.

```DAX
getNumericDynamicFormatString(SELECTEDMEASURE(), 4, "Indian Rupee", TRUE(), TRUE(), TRUE(), FALSE(), FALSE(), "","")
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*vC6_EDr0NDtGu2e5sidwYw.png)

## Scenario 6: Clean zero display. 
Enable **truncateZero** and zeros show as plain 0 without any decimal clutter around it.

```DAX
getNumericDynamicFormatString(SELECTEDMEASURE(), 4, "Indian Rupee", TRUE(), TRUE(), TRUE(), TRUE(), FALSE(), "","")
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*8UHLdDgbYR-2r1ELF9frkg.png)

## Scenario 7: Delta icons 
Set **deltaIconRequired** to TRUE() and pass your preferred symbols. Positives get ↑, negatives get ↓ — embedded directly in the format string. Your measure stays numeric throughout, no text conversion.

```DAX
getNumericDynamicFormatString(SELECTEDMEASURE(), 4, "Indian Rupee", TRUE(), TRUE(), TRUE(), TRUE(), TRUE(), "↑","↓")
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*b0Bojlf6YXcfYWhwYWjs4Q.png)

Likewise you can mix and match these arguments to get any combination you need from a single function call. Please note, at present it is not possible to set user defined function arguments as optional, which means you need to enter appropriate values for each argument in order to use them. Otherwise it throws an error.

## Source Code
Just copy it, paste it into your Power BI file and run it once and make sure the function got created.
```TMDL
createOrReplace

	function getNumericDynamicFormatString =
			(Val: ANYREF, numberOfDecimalPlaces: NUMERIC, currencyName:STRING , thousandSeperator: BOOLEAN, multiplesOfThousand: BOOLEAN, negativeNumbersBracket: BOOLEAN, truncateZero: BOOLEAN, deltaIconRequired: BOOLEAN, preferredPositiveDeltaIcon: STRING, preferredNegativeDeltaIcon: STRING) =>
					VAR __AbsVal = ABS(Val)
					VAR __decimalPart = IF(
						numberOfDecimalPlaces > 0,
						"." & REPT(
							"0",
							numberOfDecimalPlaces
						),
						""
					)
					VAR __MultiplesOfThousand = IF(
						multiplesOfThousand,
						SWITCH(
							TRUE(),
							__AbsVal >= 1e12, ",,,," & __decimalPart & "T",
							__AbsVal >= 1e9, ",,," & __decimalPart & "B",
							__AbsVal >= 1e6, ",," & __decimalPart & "M",
							__AbsVal >= 1e3, "," & __decimalPart & "K",
							"" & __decimalPart
						),
						"" & __decimalPart
					)
					VAR __Currency = SWITCH(
						currencyName,
						"","",
						"Chinese Yuan", "¥",
						"Europe Euro", "€",
						"Indian Rupee", "₹",
						"Japanese Yen", "¥"
					)
					VAR __DigitWithThousandSeperator = "#,0"
					VAR __DigitWithoutThousandSeperator = "0"
					VAR __NumericFormatString = IF(
						thousandSeperator,
						__DigitWithThousandSeperator & __MultiplesOfThousand,
						__DigitWithoutThousandSeperator & __MultiplesOfThousand
					)
					VAR __PositiveFormatString = __Currency & __NumericFormatString & IF(
						deltaIconRequired,
						" " & preferredPositiveDeltaIcon,
						""
					)
					VAR __NegativeFormatString = IF(
						negativeNumbersBracket,
						";(" & __Currency & __NumericFormatString & ")",
						";-" & __Currency & __NumericFormatString
					) & IF(
						deltaIconRequired,
						" " & preferredNegativeDeltaIcon
					)
					VAR __FormatString = __PositiveFormatString & __NegativeFormatString & IF(
						truncateZero,
						";"& __Currency &"0",
						""
					)
					RETURN
						__FormatString
```


![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*n8FLdrk8toR0Rxhmd56RIg.png)

Then you can start using that function to format your numeric DAX measures or columns. No additional configuration needed.

I have also made this [FormatString](https://daxlib.org/package/Tharun.FormatString/) function available in the SQL BI DAX library platform along with all my other DAX functions: [Font](https://daxlib.org/package/Tharun.Font/) and [TimeConversion](https://daxlib.org/package/Tharun.TimeConversion/). All functions are platform independent so you can use them in any semantic model without any issues. Hope you find this useful, would love to hear your thoughts below.

Happy Learning!