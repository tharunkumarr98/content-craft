---
title: "Efficiently Processing Massive Data Volumes using Microsoft Fabric: A Comprehensive Guide"
date: "2024-08-14"
summary: "A complete data analytics solution with Microsoft Fabric?"
tags: ["Fabric", "Microsoft", "Data Analytics Solution"]
---

## Introduction

In today’s era of data-driven decision-making, organizations often invest in multiple tools and services to extract, ingest, transform, and analyze data. This can lead to paying for services even when they aren’t fully utilized, especially under subscription-based models. Additionally, data may be duplicated across multiple clouds as these tools are often siloed. Microsoft Fabric addresses these challenges by providing a unified platform where a single license covers all workloads. With Fabric capacity, organizations pay for only what they use, and the compute resources are dynamically allocated across various workloads. Fabric’s architecture follows the principle of maintaining a single copy of data and supports the Delta Parquet format, enabling seamless integration with other tools and services without additional effort. This unified experience brings together data engineers, data analysts, data stewards, and data scientists, fostering collaboration and efficiency.

In this article, you will learn how to process massive volumes of data using Microsoft Fabric.

## Prerequisites

1.  Sample Datasets: [Link](https://excelbianalytics.com/wp/downloads-18-sample-csv-files-data-sets-for-testing-sales/)
2.  [Enable Fabric for your organization](https://learn.microsoft.com/en-us/fabric/admin/fabric-switch)
3.  Fabric Capacity and User license: [Microsoft Fabric License](https://learn.microsoft.com/en-us/fabric/enterprise/licenses), [Buy a Fabric capacity](https://learn.microsoft.com/en-us/fabric/enterprise/buy-subscription)
4.  A virtual machine with On Premises data gateway installed: [Install On Premises data gateway](https://learn.microsoft.com/en-us/data-integration/gateway/service-gateway-install)

## Scenario

Process massive amounts of raw data files located on an on-premises server and build an end-to-end data analytics solution by leveraging various workloads of Microsoft Fabric.

## Overview

This architectural overview represents the various fabric artifacts that we will use during the process.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*19QAMZArido2iiH8)

## Overview

Above architecture follows the guidelines of medallion architecture. The Medallion Lake architecture organizes data in a Lakehouse into distinct layers, following best practices for data management and processing. It comprises three main layers:

1.  Bronze Layer: Raw, unprocessed data is ingested from various sources. This layer serves as a data lake with minimal transformation.
2.  Silver Layer: Data is cleaned and transformed into a more structured format, making it ready for analytics and business intelligence.
3.  Gold Layer: Aggregated and refined data is optimised for reporting and downstream consumption, often used in dashboards and business applications.

## Procedure Overview

1.  Create a Lakehouse to store the raw data and enriched data in delta format.
2.  Create a Data pipeline to copy the raw data from on premises data source to Lakehouse.
3.  Create a Notebook to transform the raw data and to build the staging tables.
4.  Create a dataflow gen 2 to normalise the staging tables.
5.  Create Power BI semantic model and build the report.

## Procedure

**Create a Lakehouse**

1.  Open [app.powerbi.com](http://app.powerbi.com/) or [app.fabric.microsoft.com](http://app.fabric.microsoft.com/) Create a new fabric workspace. Make sure the workspace is hosted in a Fabric/Premium capacity.

![captionless image](https://miro.medium.com/v2/resize:fit:852/format:webp/0*8pRJSw-G4ZAXzAiW)

2. Click on the power bi icon on bottom left and switch to Data Engineering persona. Click on Lakehouse icon to create a new Lakehouse enter name and select the sensiticity label and click on create.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*0qIX-8Zfflhry5kF)![captionless image](https://miro.medium.com/v2/resize:fit:648/format:webp/0*fiwXxmUuwFgZ75Tp)

3. As soon as you click on create, a lakehouse, a SQL analytics endpoint and also a default semantic model will be automatically created.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*zTPr-_NlqNN_H1Gi)

You can click on the three dots icon next to the SQL endpoint and click on ‘Copy SQL analytics endpoint’. Note it your notepad, we will use this info in the next section.

Before creating the pipeline:

1. Make sure your raw data files are on an on-premises server.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*zullLklZ-i3NUMhe)

2. Create an on-premises gateway connection

a. Open [app.fabric.microsoft.com](http://app.fabric.microsoft.com/) and click on the gear icon on top right Click on ‘Manage gateways and connections’ page

![captionless image](https://miro.medium.com/v2/resize:fit:626/format:webp/0*gkoi6uKXVTcRe8Ul)

b. Click on ‘+New’ button on top left and a new connection window will open on the right.

![captionless image](https://miro.medium.com/v2/resize:fit:722/format:webp/0*VkgIenju2DsIsaMK)

After filling all the details of your data source, click on ‘Create’ button.

Note: You can only create an on-premises gateway connection after configuring the on premises gateway machine. Refer the link attached in the prerequisites section for more information.

**Create a Data pipeline**

1. Open your fabric workspace and switch to the data engineering persona click on pipeline icon to create a new data pipeline.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*RRD-BggwS_ij8jV3)

2. Enter the name of your pipelines and select the appropriate sensitivity label and click on create.

![captionless image](https://miro.medium.com/v2/resize:fit:948/format:webp/0*L_YRvU6IicbY9AXL)

3. Open the pipeline on the top menu click on copy data drop down Click on ‘Add to Canvas’

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*fPZENtHbLUqRy0pP)

4. Click on the added ‘Copy data’ activity under ‘General’ section you can enter a meaningful name to your activity.

5. Switch to ‘Source’ section select the on-prem gateway connection from the connection dropdown. Check the box next to ‘Recursively’ Incase if you want to delete the files from on prem server as soon as they moved to the Lakehouse then click on the check box next to ‘Delete files after completion’

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*XUv8CVO7Cdx7ieWY)

6. Switch to ‘Destination’ section From the ‘Connection’ dropdown, select the Lakehouse that was created before Select the ‘File Format’ as binary.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*QbtF8T3zFmykm48J)

7. Run the pipelines and check the Run status and make sure the files are copied the Lakehouse.

Now that data is copied to the Fabric Lakehouse, In the following section we will create a Fabric notebook to transform the data and to build the staging tables.

**Create a Notebook**

1. Switch to Synapse Data Engineering persona click on Notebook icon

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*ITrFr80aKHDpJT09)

2. Select the appropriate sensitivity label and click on ‘Save and continue’

![captionless image](https://miro.medium.com/v2/resize:fit:872/format:webp/0*HqF2OoQriuk-bYZX)

3. Open the Notebook and in the left-hand panel ‘Add’ to link the Lakehouse

![captionless image](https://miro.medium.com/v2/resize:fit:618/format:webp/0*1wlhTV6umiUo5CLa)

4. We created the Lakehouse in the previous steps, so select existing Lakehouse and select the Lakehouse.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*iaxoPWcnn5lwPJT5)

5. Import the necessary libraries required to transform the raw data Initialise the relative path of raw data folder in Lakehouse Initialise the schema variable and include the columns in the csv files

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*KGRcgvXTwthSqt0B)

6. Run the below spark code to load the data from CSV files into spark data frames create staging delta tables.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*W2RFNIN6gUQbh8NP)

7. Make sure delta table is created. You can verify it by expanding the table folder in the left-hand panel.

Raw data has been transformed, lets normalize the fact table using Dataflow gen 2

**Create a Dataflow gen 2**

1. Switch to Data Factory persona and click on the Dataflow Gen2 icon.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*LVQTb42vpKmZN5es)

2. Click on get data and select SQL server Enter the Lakehouse SQL analytics end point in the ‘Server’ section click on next and select the ‘Staging_Sales’ table created before and click on next.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*Yk1oQasKkFjsSo_4)![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*x_sxDbM7TtF9Jc5Z)

3. As per the business logic and keeping the downstream analytics solutions in mind. Normalize the fact table into dimensions and facts.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*IKRngDbpT1zjb5CZ)

4. On the right bottom you will find an option to add Lakehouse as destination, Click on add and select the Lakehouse. Enter the table name and click on Next Choose the update method as append or overwrite depending on the data pipeline strategy.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*P43aVlHTwXyZINHt)

5. Select the appropriate data types for each column and click on ‘Save Settings’

6. Repeat step 4 and step 5 for all other tables and run the dataflow.

7. Once the data refresh is completed, open the Lakehouse or SQL analytics endpoint to validate the newly created delta tables.

Note: To reduce the run time of dataflow, make sure you use ‘Native SQL’ option and include the transformation logic within the SQL statement. For example: In the below query, instead of performing the distinct operation in the dataflow after retrieving whole sales table, we included the distinct operation within SQL statement.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*SUiHgBF-dPUnDskF)

Considering the truncating the staging tables and archive the raw data files in the Lakehouse, as soon as the dataflow refresh is completed. This practice can reduce the running time in the subsequent runs and reduces cost.

**Create a Power BI Semantic model and build the Power BI Report**

1. Switch to Power BI persona open the Lakehouse and on top you will find an option to create a ‘New semantic model’.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*ax3500sx5cRWT9BL)

2. Enter the name for your semantic model and select all the production grade non staging tables and click on confirm.

![captionless image](https://miro.medium.com/v2/resize:fit:1358/format:webp/0*U8D0k7x3bRvB6bLq)

3. Open the new semantic model and establish the relationships between the dimension tables and fact tables.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*sjOqbQVS1eOlQsba)

4. After completing the necessary data modelling, create appropriate measures for building the dashboard.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*wU7OwFRxQUHw07iE)

5. Click on the new report button on the top to create the reports as per the A sample report would look like this

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*kszPoEKRVPaw4q_g)

**Data Refresh**

To refresh all the key data artifacts, instead of scheduling them individually or triggering them manually, orchestrating all the activities in the data pipeline would be the best option. In the same pipeline that we created in the previous steps, include the notebook, dataflow and semantic model refresh activities and schedule the pipeline.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*8uG-crBJ_6Fg1Ah_)

You can also consider including failure alerts, as soon as any activity in the pipeline fails you will be notified with an email.

**Points to Remember**

Depending on the business requirements, you can consider making changes to the configurations explained in the procedure.

You can download the sample data files and pseudo code from [here](https://drive.google.com/file/d/1MpKM-1I_RUYZN3yX_omj1B-IydPdH7kw/view?usp=share_link)

**Conclusion**

In today’s data-driven world, maintaining a robust data estate and maximizing data utilization is crucial for every business. Microsoft Fabric addresses the challenge of data silos by providing a unified experience that brings together data engineers, analysts, and scientists. This solution exemplifies an efficient method for processing large volumes of data using Microsoft Fabric.

Happy Learning!!!