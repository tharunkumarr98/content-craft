---
title: "How to Delete Bookmarks in Bulk in Power BI"
date: "2024-09-29"
summary: "Explained how to remove them in bulk in just a few simple steps."
tags: ["Power BI","Report", "Bookmarks"]
---

Have you ever tried deleting multiple bookmarks in one shot? Unfortunately, I was not able to. I tried in multiple ways, but nothing worked. Firstly, there is no direct option to select all the bookmarks. We need to hold CTRL or SHIFT and then select each and every individual multiple bookmark that’s the only option to select all the bookmarks. I know it’s a lot of work. Even after that much of pain you will not have ‘Delete All’ option. :(

Is there any other option? Well, Sadly I could not find any option on web. I went to my dear friend ‘ChatGPT’ and asked for help.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*AcQI-kYwA9fTv-0U)

Let me breakdown all three suggestions:

1.  Use ‘Bookmarks’ pane: We are very well aware of this option and it’s a tedious task.
2.  Use ‘Tabular’ Editor: Tabular editor is read/write/create semantic model. Bookmark is a report level object. Tabular editor does even show bookmarks tab. This option does not make any sense.
3.  Create a macro for simulating mouse clicks: Not sure how this works. I don’t want to pretend that I am aware of everything :)

So, there isn’t any other quick and easy option? Nah! I found an option, and I was able to delete 450+ bookmarks in less than a minute without losing any of my work. Here are the steps I followed.

## Prerequisites:

1.  Install Power BI Desktop and VS Code.
2.  Enable Power BI Developer mode, PBIR and TMDL formats in preview settings, and restart your Power BI desktop before following the below steps. Checkout out my previous blog for more information about [Power BI Developer mode](https://www.linkedin.com/pulse/mastering-power-bi-developer-mode-tharun-kumar-ravikrindhi-7fqac/).

## Points to remember:

1.  PBIR, PBIP and TMDL formats are still in preview and have its own [limitations](https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-report#pbir-considerations-and-limitations). Keep a backup of your PBIX file before implementing the below steps.
2.  For illustration purpose, I have taken a sample power bi report with 30 bookmarks. I will delete 25 bookmarks without effecting the remaining 5

## Procedure:

Step 1: Open your PBIX report file and expand the bookmarks pane. Select the bookmarks which are required and should not be deleted, in my case I would select last 5.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*dCa2TdgyCxOJz5YT)

select required bookmarks

Step 2: Right click and group them. You can also give a meaningful name, I am naming it as ‘Dont Delete’

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*o07RA6x_hazsXvkq)

Grouping bookmarks

Now I do not need any other bookmark which is out of this group. Let’s delete the remaining 25 quickly

Step 3: Save the report in PBIP format.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*ss1FeIQoanOzhRrs)

save as. PBIP

Step 4: Open the PBIP folder with VS Code

Step 5: Navigate to bookmarks folder (). Under this folder you will find one .json file for every bookmark in the report. Name of this json file represents the bookmark id.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*5APX9g0l10RJEoLc)

Step 6: Open bookmarks.json file, here you will find the list of bookmarks in the sequential order. At the end, I can see a portion which represents the bookmarks group that I have created.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*0mMzYabTBIDQ46lB)

Step 7: Now the task is to remove every json file which does not fall under this group.

I would suggest you delete all the bookmark.json files and move them to recycle bin and then restore those bookmarks which are required.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*AbMwdyXMpionX5Sa)

Step 8: In the bookmarks.json file remove all other bookmark ids expect the bookmarks under the group.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*x0RM27sDIh7Sy3Tc)

And that’s it, save the file and open the PBIP file then you will only find the bookmarks that we have grouped.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*FOobwMATzcTN0VC7)

Let me know if you know any better way of deleting bookmarks in bulk.

Happy learning!!!