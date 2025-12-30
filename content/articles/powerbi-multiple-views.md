---
title: "One Power BI Report, Multiple Default Views"
date: "2025-05-11"
summary: "Explained how bookmarks can be used to to create multiple default views in a single report."
tags: ["Power BI", "Report", "Bookmarks"]
---

You’ve built a Power BI report, and you have two distinct audiences. Each group expects to see **different default slicer/filter selections** when they open the report.

To give you more context, in our recent project we created a Power BI report. This reporting solution is intended to help different forum groups and each group is interested to see different KPIs and different products information. Few members of these groups are not well versed in Power BI and many of them are using it for the first time. We wanted to make their report navigation as easy as possible. So we decided to create a dedicated landing page, In the landing page we included the names of each forum group and under each group we inserted buttons to access the report. Obviously the report URL that we attached under those buttons are the key for navigation.

The problem is, we have only one report. Which means irrespective of the forum the end user belongs to, the report navigation URL will take everyone of them to the same report and will reflect same filters the we have saved before publishing the report. ( This will also depend on the persistent filters, but for now lets assume that persistent filters are disabled ) Users have to change the selections in the slicers on the report page in order to see the insights that they are interested in. To avoid that, we wanted to implement something which will automatically change the slicer selections depending on the forum specific report button that they click.

First option that came to my mind is passing report filters using [query string parameters](https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-url-filters) within report URL. Let me explain how query string parameters works,

As you might already know, a Power BI report URL contains two important GUIDs, group id (Workspace Id) and report id. ( Reports in personal workspace contains “me” in the place of group id)

```URL
https://app.powerbi.com/groups/<groupid>/reports/<reportid>
```

These report URLs does support query string parameters, which means you can pass a report level filter by appending a query string to the report URL. For example, the below query string

```URL
?filter=Table/Field eq 'value'
```

can add a report level filter, as you can see I am appending the above query string to the report URL

```URL
https://app.powerbi.com/groups/<groupid>/reports/<reportid>?filter=profile/country eq 'JP'
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*QF7-dE6brCwoFZiiQ99qvg.png)

As soon as I hit enter, it added a page level filter

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*s4c-fv4UIDJe74-76Wb83w.png)

make sure your data model contain the table and the column you included in the query string. Refer the query string parameter documentation if you want to know more about different type of filters that you can pass. As far as I know [cross report drill through](https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-cross-report-drill-through) functionality in Power BI also works by leveraging query string parameters.

The problem with this approach is that, it will add a report level filter in the filter panel. This is not the requirement that I stated, I want my URL to change the selections in the slicer visual.

I was able to implement that functionality using bookmarks, Yes! you read it right. Bookmarks. Let me explain how.

I created two bookmarks, I am naming them as Japan and India. Both these bookmarks will save the state of the report page including the selection within the country slicer. ( for illustration purposes, I included only one slicer )

_Do not forget to enable the “Data” option, as it is required in order to save the current filter selections_

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*iU_roVFX7tKKsApK9UDaJA.png)

Now its the time to reveal the secret, each bookmark in a power bi report will have a unique identifier, and you will be able to see those identifiers in your browser URL section, every time you click on the bookmark button or when you access a specific bookmark from the bookmark panel. Here is the pattern: ?bookmarkGuid=<bookmarkId>

```URL
https://app.powerbi.com/groups/<groupid>/reports/<reportid>?bookmarkGuid=<bookmarkId>
```
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Pi8ca8o6PITnOMDYHwo8mQ.png)

I copied these Ids from the browser and created different forum specific report URLs, each URL contains dedicated forum specific bookmark id appended to the report URL. Thats it! Task is accomplished.

With this approach, we avoided the necessity of creating one report for each forum group.

You might be wondering, why go through the effort of embedding bookmark IDs directly into the report URLs, especially when Power BI offers built-in bookmark navigation buttons? While that’s true, there’s more to the story. This reporting solution contains multiple reports, not just one, and all of them are curated within a single Power BI app. Our landing page serves as the central hub, where we provide direct report URLs along with other useful context about the reporting solution. However, as you may know, Power BI’s native bookmark navigation buttons only work within the same report, they can’t navigate across different reports.

**Important points to remember**

1.  When you implement this approach, [persistent filters](https://www.youtube.com/watch?v=5PG6b7v6Zgg) functionality will not work.
2.  If a user accesses the report from a **workspace**, **shared link**, or **report list**, and **not** through your bookmark-enhanced link, they’ll see the default view of the report (not the customized bookmark view).
3.  I have taken a normal report URL as an example, if you are accessing the report through an app then report URL will look a bit different

```URL
https://app.powerbi.com/groups/me/apps/<appId>/reports/<reportId>
```

AppId is not same as workspace Id/group Id. Where as the report Id is same even when open it from the app. Apart from this change, the remaining functionalities that I have explained will work in the same way even from the app as well.

4. When you are passing parameters along with the URL, you should put “?” and then you can keep the parameter filter, from the second parameter onwards the separator between the paramters would be “&”

5. Apart from the report id, group id (workspace Id), bookmark id and query string parameters, you might also find other values within the url for example:
“experience=power-bi” — represents the persona
“reportsection”, — represents the identifier of a report page
“ctid” — represents session id

6. There are many ways to copy the bookmark id, page id or visual id. If you are using latest version of Power BI desktop then you can copy it from the desktop application as well
[https://powerbi.microsoft.com/en-us/blog/power-bi-march-2025-feature-summary/#post-29214-_Toc193819890](https://powerbi.microsoft.com/en-us/blog/power-bi-march-2025-feature-summary/#post-29214-_Toc193819890)

Or you can also save your report in PBIP format and open the folder from visual studio and there you can find these ids.

Thank you for reading my blog. I hope I added some value to your knowledge. 

Happy Learning!