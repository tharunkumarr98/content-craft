---
title: "Mastering Power BI Developer Mode"
date: "2024-07-06"
summary: "Dive into a Mahabharata-inspired story on Power BI Developer Mode. Learn how to tackle real-world challenges with limited resources."
tags: ["Power BI","PBIP", "Developer Mode"]
---
In the company of **Hastina**, which uses Microsoft Power BI to build insightful dashboards, Drona was the manager leading the Data Analytics department. One day, he called his teammates and informed them about the new Sales dashboard that their company wants to have. He explained to them about the current status of the report development and then he assigned them a few tasks:

1.  Bheema — Add a new page and create a Map visual to represent country-wise-revenue.
2.  Dharma — Connect to the datasource and retrieve **Order_details** data into the semantic model and add a relationship between **Orders** table and **Order_details** table on **OrderID** column.
3.  Ashwathama — Leverage bookmarks and add a functionality in the summary page which the users can use to change the decimal points.

After assigning the tasks, Drona asked for their estimated completion times. Bheema said it would take three working days. Drona was shocked and asked why it would take so long. Ashwathama explained, “Sir, as you are aware, we are a small organisation and we don’t have Power BI Premium or Fabric capacity. We only have Power BI Pro licenses, so we can’t integrate our Power BI service workspaces with Azure Repos. We also don’t have Azure DevOps licenses. So, we can’t work in parallel and have to work one after the other.”

Drona understood Ashwathama’s reasoning but ordered them to take the latest file from the shared folder and work in parallel, completing their tasks by evening. After finishing, they were to upload their PBIX files to different subfolders named after them and notify him in the Teams channel.

Drona then went to his favourite team member, Arjuna, and explained everything. He gave Arjuna the task of integrating the changes into the master file and ensuring the dashboard was ready by the next morning. Drona knew Arjuna loved Power BI and followed every new feature released by Microsoft.

Ashwathama, Bheema, and Dharma completed their tasks. Now, it was Arjuna’s turn.

Arjuna opened his Power BI Desktop and enabled the PBIP, TMDL, and PBIR format options in preview features.

![Preview Features](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*NURh0Vy15BGjHTDB)

Then, he opened the master PBIX file and saved it as a PBIP. He did the same with the other files uploaded by his teammates.

![PBIP Format](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*QzjE4Atrg-5DKgPj)

Before starting the integration, he opened the Master PBIP folder with Visual studio and examined each and every file.

![Visual Studio Code](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*dV0s9xuW0F642fU-)

## Integration

1.  Arjuna wanted to integrate Bheema’s work into the master file, He opened master PBIP folder and Bheema’s PBIP folder in two windows. Bheema’s task was to add a new report page with Map visual, Arjuna has opened “<PBIP Folder>/<ReportName>.Report/definition/pages” folder

![Left: Master File & Right: Bheema’s File](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*GyFvv1lacjttWyJ1)

He copied the new page folder in Bheema’s PBIP folder to the Master PBIP folder. He is also observed that there is a file called ‘Pages.json’ which has pageOrder and activePageName information.

pageOrder signifies the order of all the report pages and activePageName represents the page which was opened while saving the file.

![Left: Master File & Right: Bheema’s File](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*VeFggtb0_YSVDhpf)

Arjuna has updated the Pages.json file in master PBIP folder with the details of the new page folder that he copied from Bheema’s PBIP folder. He saved all the changes and opened the master ‘.pbip’ file and he could see the new page.

![Master .pbip](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*qGgXn4ec_H8WmpGc)

2. Now Arjuna wants to integrate Dharma’s work into the master PBIP folder. Dharma task was asked to add a new table ‘Order_details’ into the semantic model and add a relationship between that table and ‘Orders’ table over ‘OrderID’ column. Arjuna has opened Dharma’s PBIP folder and navigated to

“<PBIP Folder>/<ReportName>.SemanticModel/definition/pages” folder. He identified the newly added table in Dharma’s PBIP folder

![Left: Master File & Right: Dharma’s File](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*DHBHPodNcVPaHcrj)

He copied ‘Order_Details.tmdl’ file into the master PBIP folder. Now, to add the relationship, he opened the ‘relationships.tmdl’ file and observed the differences.

![Left: Master File & Right: Dharma’s File](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*KDGgJHr3MR0JZSM1)

After adding the relationships into the master PBIP folder, he opened another file ‘diagramLayout.json’. Now you might be wondering why Arjuna opened this file. As the name suggests, ‘diagramLayout.json’ file contains the information of semantic model view layout, which means the coordinates and size of tables placed in the Model view.

Observe the highlighted part on the left, you will find the coordinates and size of ‘Key Measures’ table. You can observe one more thing, the details of ‘Order_details’ table are missing on the left side, Now Arjuna will be copying that information from the Dharma’s file which is on the right.

![Left: Master File & Right: Dharma’s File](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*lLAYQtE80U5wWnmk)

To verify the integration, he opened the master pbip file. He saw few warning messages, considering he added a completely new table and made changes to the semantic model. He need to refresh the file data once to avoid such warnings.

![Warning message](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*SI_e1Sb-B9xaTh1H)

After the data refresh, he opened the model view and he could see the ‘Order_details’ table and also the newly added relationship. It is placed as per the coordinates copied from Dharma’s file. :)

![Model View](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*j79n72hNLgP7TZLV)

3. Now it’s time for Arjuna to integrate Ashwathama’s work into the master PBIP folder. Ashwathama’s task is to add a toggle to the main page using which users can change the decimal points. Ashwathama leveraged bookmarks to add this functionality.

Arjuna opened Ashwathama’s PBIP folder from VS and navigated to

“<PBIP Folder>/<ReportName>.Report/definition” folder. He identified all the bookmarks in Ahwathama’s folder and copied them to the master PBIP folder

![Left: Master File & Right: Ashwathama’s File](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*Y5RP9-uHKX5lYHbz)

Arjuna is aware that Ashwathama has also added bookmark navigator into the first page, so to copy the bookmark navigator element, Arjuna opened

“<PBIP Folder>/<ReportName>.Report/definition/pages/<Page — 1 ID>/visuals” folder. He identified the newly added visuals in page 1 along with the bookmark navigator.

![Left: Master File & Right: Ashwathama’s File](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*T8FTAH8gcCBI-iBm)

He copied all the visuals added by Ashwathama into master PBIP folder and opened the master pbip file just for the final validation. He could see the bookmark navigator in page 1.

![Master PBIP](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*PfFlcd-Pro_-PSg7)

Now that he integrated all the changes, he saved the PBIP as PBIX and published into the service and informed his manager Drona.

## Points to remember

This article is to explain you about the different files in PBIP format and how you can leverage it with limited resources. I would recommend you to use git integration feature and build the CI/CD pipelines for smooth integration between different environments.

I would like to thank [Rui Romano](https://www.linkedin.com/in/ruiromano?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAALWDywB9c6Gn0_KgodALqsO-wFYG9PvaOk) and Microsoft Power BI team for bringing this feature.

Happy Learning!!!