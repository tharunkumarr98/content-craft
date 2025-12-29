---
title: "Power BI TMDL View: Tasks You Can Finally Do Without External Tools"
date: "2025-11-23"
summary: "Explore how the new TMDL view in Power BI Desktop lets you perform advanced modeling tasks directly inside Power BI—eliminating the need for external tools."
tags: ["Power BI", "Semantic Model", "TMDL"]
---


Before the introduction of TMDL (Tabular Model Definition Language), modeling tasks in Power BI Desktop was almost entirely GUI-driven. Any advanced tabular modeling tasks required external tools like Tabular Editor, ALM Toolkit, or SQL Server Management Studio. These tools are not created by Microsoft, many organizations do not allow them, and some require additional licensing. In this blog, let’s talk about a few tasks that the new TMDL view enables directly inside Power BI Desktop—tasks that were not possible using the GUI at the time of writing.

## Changing the Storage Mode

Before TMDL, switching a table from **Import** to **DirectQuery** wasn’t possible in the GUI. TMDL makes it simple:

1. Open your semantic model.  
2. Switch to the TMDL view.  
3. Select the table in the Model Explorer on the right.  
4. Click **Script TMDL → Script** tab.  
5. A new tab will open with the TMDL script for creating or replacing the table.  
6. Scroll down to the partition definition and find the `mode` attribute.  
7. Change the value to the desired storage mode and click **Apply**.

![Changing Storage Mode](/content-craft/images/blog/tmdl-view/tmdl-change-storage-mode.png)


That’s it—the storage mode is now updated.  
**Note:** If switching from DirectQuery to Import, remember to refresh the table so that data loads into the model. You can also switch to other modes like Dual.

## Object-Level Security Implementation

Before TMDL, implementing **Object-Level Security (OLS)** required tools like Tabular Editor or SSMS. Now it can be done directly in Power BI Desktop.

Below is an example that creates a role called `RestrictEmployeeId` and hides the `employeeId` column in the `Employee` table:

```tmdl
createOrReplace
 role RestrictEmployeeId
  modelPermission: read

   tablePermission Employee
    metadataPermission: read

     columnPermission employeeId = none
