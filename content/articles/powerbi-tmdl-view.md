---
title: "Power BI TMDL View: Tasks You Can Finally Do Without External Tools"
date: "2025-11-23"
summary: "Explore how the new TMDL view in Power BI Desktop lets you perform advanced modeling tasks directly inside Power BI—eliminating the need for external tools."
tags: ["Power BI", "Semantic Model", "TMDL"]
---


Before the introduction of TMDL ([Tabular Model Definition Language](https://learn.microsoft.com/en-us/analysis-services/tmdl/tmdl-overview?view=sql-analysis-services-2025)), modeling tasks in Power BI Desktop was almost entirely GUI-driven. Any advanced tabular modeling tasks required external tools like Tabular Editor, ALM Toolkit, or SQL Server Management Studio.

These tools are not created by Microsoft, many organizations do not allow them, and some require additional licensing. In this blog, let’s talk about a few tasks that the new TMDL view enables directly inside Power BI Desktop tasks that were not possible using the GUI at the time of writing.

Changing the Storage Mode
-------------------------

Before TMDL, switching a table from Import to DirectQuery was not possible in the GUI. TMDL makes it simple.

1.  Open your semantic model.
2.  Switch to the TMDL view.
3.  Select the table in the Model Explorer on the right.

![captionless image](images/blog/TMDL-View/1.png)

4. Click Script TMDL to → Script tab.

![captionless image](images/blog/TMDL-View/2.png)

5. A new tab will open with the TMDL script for creating or replacing the table.

6. Scroll down to the partition definition and find the mode attribute

![captionless image](images/blog/TMDL-View/3.png)

7. Change the value to the desired storage mode and click Apply.

![captionless image](images/blog/TMDL-View/4.png)

That’s it, the storage mode is now updated.

![captionless image](images/blog/TMDL-View/5.png)

Note:

1.  If you switch from DirectQuery to Import, remember to refresh the table so that data loads into the model.
2.  You can use the same approach to switch to other modes like Dual.

Object-Level Security Implementation
------------------------------------

Before TMDL, implementing [OLS](https://learn.microsoft.com/en-us/fabric/security/service-admin-object-level-security?tabs=table) required Tabular Editor or SSMS. Now it can be done directly in Power BI Desktop.

Below is an example that creates a role called RestrictEmployeeId and hides the employeeId column in the Employee table:

```TMDL
createOrReplace
 role RestrictEmployeeId
  modelPermission: read
  tablePermission Employee
   metadataPermission: read
   columnPermission employeeId = none
```

Another example that hides the entire Employee table:

```TMDL
createOrReplace
 role RestrictEmployeeTable
  modelPermission: read
  tablePermission Employee
   metadataPermission: None
```

Write your own script based on your model and run it in the TMDL view.

![captionless image](images/blog/TMDL-View/6.png)

You can see the created roles in Model Explorer.

![captionless image](images/blog/TMDL-View/7.png)

Creation of Perspectives
------------------------

If you have used the [Personalized Visuals](https://learn.microsoft.com/en-us/power-bi/create-reports/power-bi-personalize-visuals?tabs=powerbi-desktop) feature, you may already know what Perspectives are. They are used to provide a simplified, focused view of a model.

Earlier, creating perspectives required Tabular Editor. TMDL now supports it directly.

The example below creates a perspective called EmployeePerspective that includes selected columns from two tables:

```TMDL
createOrReplace
 perspective EmployeePerspective
  perspectiveTable Employee
   perspectiveColumn birthDate
   perspectiveColumn employeeId
  perspectiveTable DimDateTable
   perspectiveColumn Date
```

Run a similar script based on your model in the TMDL view.

![captionless image](images/blog/TMDL-View/8.png)

Your perspective will appear in Model Explorer.

![captionless image](images/blog/TMDL-View/9.png)

Addition of Cultures and Translations
-------------------------------------

If you have created multi-language Power BI reports, you may already know about [Cultures](https://learn.microsoft.com/en-us/power-bi/guidance/multiple-language-locale).

Previously, adding a new language or translation required [Translation Builder](https://github.com/PowerBiDevCamp/TranslationsBuilder) or Tabular Editor. With TMDL, you can define cultures directly.

Example: Adding Spanish (es-ES) language and translating several objects:

```TMDL
createOrReplace
  cultureInfo es-ES
     translations
       model Model
	 table KeyMeasuresTable
           measure _LastRefreshDate
	     caption: Fecha de última actualización
	 table Employee
	   caption: empleado
	   column birthDate
	     caption: fecha de nacimiento
```

Run the script in the TMDL view.

![captionless image](images/blog/TMDL-View/10.png)

The culture will appear in Model Explorer.

![captionless image](images/blog/TMDL-View/11.png)

Configuration of Detail Rows Expressions
----------------------------------------

If you build self-service datasets for Excel users, you may already know about [Detail Rows](https://www.sqlbi.com/articles/controlling-drillthrough-in-excel-pivottables-connected-to-power-bi-or-analysis-services/). This property controls exactly which columns are returned when users drill through in Excel PivotTables connected to your Power BI semantic model.

Before TMDL, setting this property required Tabular Editor. Now it can be done in Desktop.

The example below creates a measure EmployeeCount and defines a Detail Rows expression for it:

```TMDL
createOrReplace
  ref table KeyMeasuresTable
    measure EmployeeCount = ```
			    COUNTROWS(Employee) 
				```
      formatString: 0
      detailRowsDefinition =
			SUMMARIZE(Employee,
                    Employee[employeeId],
                    Employee[EmployeeName],
                    Employee[workAddress_emailAddress],
                    Employee[companyName]
                    )
```

Run this script in the TMDL view.

![captionless image](images/blog/TMDL-View/12.png)

To validate the property, you can run a DAX query:

```DAX
EVALUATE DETAILROWS([EmployeeCount])
```
![captionless image](images/blog/TMDL-View/13.png)

Creating Custom Table Partitions
--------------------------------

Before TMDL, splitting a table into custom partitions required Tabular Editor or other external tools. Now this can be done directly in Desktop.

Script your table into TMDL view, locate the partition section, and modify it as needed.

Example: Splitting the Employee table into two partitions:

```TMDL
  partition EmployeeBefore2000 = m
   mode: import
   source = 
     let
      Source = Sql.Database(
       HostName,
       DBName,
       [        Query = "Select * from
              Employee where birthDate < '"
         & DateTime.ToText(#datetime(2000, 1, 1, 0, 0, 0), 
                         [Format = "yyyy-MM-dd hh:mm:ss"])
         & "'"   
       ]
      )
     in
      Source
  partition EmployeeAfter2000 = m
   source = 
     Sql.Database(
      HostName,
      DBName,
      [       Query = "Select * from
              Employee where birthDate >= '"
        & DateTime.ToText(#datetime(2000, 1, 1, 0, 0, 0), 
                          [Format = "yyyy-MM-dd hh:mm:ss"])
        & "'"
      ]
     )
```

Run the script in the TMDL view.

![captionless image](images/blog/TMDL-View/14.png)

You will see the new partitions under the table in Model Explorer.

![captionless image](images/blog/TMDL-View/15.png)

I hope you find this information useful, If I missed any other TMDL capabilities that were not possible through the Power BI Desktop GUI, please share them with me.

Note: After updating the partitions, refresh the data in the table.

I hope you find this information useful, If I missed any other TMDL capabilities that were not possible through the Power BI Desktop GUI, please share them with me.