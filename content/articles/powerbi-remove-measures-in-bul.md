---
title: "How to update Power BI measures in bulk"
date: "2024-06-23"
summary: "Exaplained how to update over 500 Power BI measures with new filter values in just one day! 🚀 "
tags: ["Power BI", "Semantic Model", "DAX"]
---

## Introduction

I recently came across a challenging task involving a Power BI semantic model with over 500 measures. Many of these measures contained hardcoded [filter predicates](https://www.sqlbi.com/articles/specifying-multiple-filter-conditions-in-calculate/). The data engineer had updated data in the database, which meant these hardcoded values were no longer valid. My job was to update all the affected measures with new values provided by the data engineer.

The problem was, I didn’t know which measures needed updating, and I had just one day to complete the task. Despite my limited knowledge of this semantic model, I managed to complete the task on time using Power BI external tools. In this blog, I will explain the step-by-step process I followed to achieve this.

## The Problem

Imagine you have a Power BI model with many measures. These measures have DAX code with hardcoded filter values. For example:

```DAX
Red  = CALCULATE ( [Sales Amount], 'Product'[Color] = "Red" )
```

In the above measure, the Product[Color] column is filtered for ‘Red’. What if the data engineer makes a change in the database and replaces the value ‘Red’ with ‘Bright Red’? Then the above measure will not work after refreshing the data. You need to update all the measures where this value is hardcoded. If you do not know the list of measures where this value is hardcoded then it will be difficult for you to manually validate each and every DAX expression.

Before explaining the solution I followed, I will reproduce the issue.

I created a simple semantic model (Power BI Dataset) with three dimension tables, one fact table and one table to keep all the measures.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*toeE9t-Ko_ToiRYV)

Then I created 8 measures and placed them in two different folders. Each of these measures has a hardcoded filter on ‘Orders’[ShipCountry] column. You can find the measures list and the DAX pattern in the below image.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*capZ8rxPBapBoVL0)

Then I placed all of them in a matrix visual and the numbers look like this

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*klzc6H6BjsqlD4-j)

To reproduce the scenario I have replaced ‘Mexico’ with ‘Měxico’ and ‘Austria’ with ‘Äustria’ in ‘Orders’[ShipCountry] column. All the 8 measures in the matrix visual will show blank as a result.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*bSDa3rU0rnYd7kwq)

Now that we reproduced the issue, let’s solve this problem.

## Solution

My first task is to identify the list of measures which references the ‘Orders’[ShipCountry] column. Thanks to the new [INFO functions](https://powerbi.microsoft.com/en-us/blog/dax-query-view-introduces-new-info-dax-functions/) in DAX which helps us to query DMVs in Power BI desktop. I ran the below query and extracted the list of measures from CALCDEPENDENCY DMV.

```DAX
EVALUATE
SELECTCOLUMNS(
	FILTER(
		INFO.CALCDEPENDENCY(),
		[OBJECT_TYPE] = "MEASURE" &&
		[REFERENCED_OBJECT_TYPE] = "COLUMN" &&
		[REFERENCED_OBJECT] = "ShipCountry"
	),
	[OBJECT]
)
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*bj5Tqn2EBD-NyE_f)

Along with the measures names I also need the measure expression, format string and display folder and other details. I had to run another DAX query, this time I queried INFO.MEASURES() function.

```DAX
DEFINE
	VAR __MeasuresList = SELECTCOLUMNS(
		FILTER(
			INFO.CALCDEPENDENCY(),
			[OBJECT_TYPE] = "MEASURE" &&
			[REFERENCED_OBJECT_TYPE] = "COLUMN" &&
			[REFERENCED_OBJECT] = "ShipCountry"
		),
		[OBJECT]
	)
```
```DAX
EVALUATE
	SELECTCOLUMNS(
		FILTER(
			INFO.MEASURES(),
			[NAME] IN __MeasuresList
		),
		[NAME],
		[EXPRESSION],
		[FormatString],
		[DisplayFolder],
		[IsHidden],
		[Description]
	)
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*9y-gZUH4cDcdGant)

You can also extract these details from DAX Studio. After connecting to your semantic model you need to run the below query.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*8voFc5--Ob1WcoCE)

I copied the extracted data into an excel and kept it aside. Then I ran the below C# code in tabular editor and deleted all the measures. Now you might be thinking that I would have manually added the measure names in the below code as a comma separated list. Nah! I loaded the data that I have extracted from DAX query view into Power Query and converted the list into a comma separated list of strings. :)

```DAX
var MeasureNamesToDelete = new List<string>
{    
"Mexico YTD SalesAmount",  
  "Mexico LY SalesAmount",  
  "Mexico LY YTD SalesAmount",  
  "Austria YTD SalesAmount",   
 "Austria LY SalesAmount", 
  "Austria LY YTD SalesAmount",   
 "Austria SalesAmount",  
  "Mexico SalesAmount"
};
foreach (var table in Model.Tables)
{        
foreach (var measure in table.Measures.ToList())   
 {       
 if (MeasureNamesToDelete.Contains(measure.Name))   
     {                measure.Delete();       
 }   
 }
}
```

I opened the excel file where I have copied the extracted data and then replaced ‘Mexico’ with ‘Měxico’ and ‘Austria’ with ‘Äustria’.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*lB7gx2lvnGfHX62Q)

Now I have the DAX expressions, I am ready to recreate the measures. However it is again painful to create these measures one after the other. So, I created another column and generated C# code snippet for creating the measures with the data that is available in the excel.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*oydWPIWuY04WkzSz)

I am attaching the code for creating one measure.

```DAX
Model.Tables["Key Measures"].AddMeasure("Mexico YTD SalesAmount","Calculate([SalesAmount], DATESYTD('Date'[Date]), Orders[ShipCountry] = \"Měxico\")","Mexico");
```

Then I copied the code from the new column, and ran the same in tabular editor.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*G15CV9V0bZDHzq4j)

After updating the model, all my visuals are reflecting the correct numbers like before.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*OeQHn3zv_vOh7F7p)

## Conclusion

Using Power BI external tools, you can quickly and easily update many measures at once. This saves time and reduces the chance of mistakes. Next time you need to update hardcoded filters, try this method and see how much easier it is!

## Points to remember

1.  Be cautious while replacing the values in Excel. If we replace 10 with 9 then incase if you have 100 in your DAX expression then 100 becomes 90. I used REGEX expressions in google sheets instead doing it in excel.
2.  Also, always keep a backup of your semantic model before performing these experiments.
3.  I created these measures just to illustrate the scenario, I would highly recommend Power BI calculation groups and Field parameters to reduce the number of measures.

BIG SHOUTOUT to [Injae Park](https://www.linkedin.com/#), his YouTube video helped me in writing an excel formula for auto generating C# code to create DAX measures.

Have you tried this method? Share your experiences in the comments below!

Happy Learning!!!