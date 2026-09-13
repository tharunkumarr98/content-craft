---
title: "Power BI Smart Table Visual: Excel style Column Filtering, Dynamic Column Headers, Grouping Columns"
date: "2026-09-13"
summary: "Overcome the limitations of Power BI Table visual using Smart Table"
tags: ["Power BI", "Report", "Custom Visual"]
image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*nEC48dBfwvlyoX3DyNN00w.png"
---

The Table is the most commonly used visual in Power BI. Anyone who has spent years in Excel expects to click a header and filter that column. They expect related columns to sit under a common heading. The native table visual does none of this.

There are grid visuals in the Microsoft visual app source that do. Most developers never get to use them, for two reasons that have nothing to do with the features. The good ones are licensed per developers or user, and that cost has to be justified to someone. The free ones are usually not Microsoft certified, which means an uncertified third party script is running inside your report, and that is a fair thing for a security team to say no to.

So I built one. It is called Smart Table, and I built it with Claude. This post walks through what it does.

## 1. Excel style column filtering

Every column header carries a funnel button in its own divided cell. Click it and you get what you would expect from Excel: sort, a set of conditions appropriate to the column’s type, and a searchable checkbox list of that column’s values. The menu names the column it belongs to, counts what you have ticked, and stays open while you sort.

The conditions follow the column type rather than offering one generic list:

![captionless image](https://miro.medium.com/v2/resize:fit:1390/format:webp/1*tqIJ8CZ7nb1ceRI8hc1UAA.png)

### Sync: does the filter stay in the grid or reach the report

Sync is on by default. Filters applied in the header are pushed to the model, so every other visual on the page responds, exactly as if the user had used a slicer. Turn Sync off: Filtering then narrows this grid only.


### Global search

The toolbar has a search box with its own operator dropdown: contains, is exactly, starts with, ends with, does not contain. It searches across every column at once.


<iframe src="https://www.youtube.com/embed/biYBDeVU8xw" title="Smart Table Excel Style Column Filtering" allowfullscreen></iframe>

[Click here](https://www.techietips.co.in/dashboards/Smart-Table-Excel-Style-Column-Filtering)

## 2. Dynamic column headers, driven by a measure

A column header name is normally a static label. Here it can be a DAX measure.

Arrival Month is set to April, and the Key Metrics headers read Lead Time (Avg: 30.00), Room Nights (Avg: 1.00), ADR (Avg: 160.50). Change the month and they recompute.

The header honors the filter context, including the filters applied inside the grid itself. Filter Property down to Resort Hotel with the funnel and the averages in the header follow.

<iframe src="https://www.youtube.com/watch?v=CRxdEWsqfzs" title="Smart Table Dynamic column headers, driven by a measure" allowfullscreen></iframe>

[Click here](https://www.techietips.co.in/dashboards/Smart-Table-dynamic-column-headers) to interact with the visual

## 3. Column groups, without any extra tables

Four groups across eleven columns: Reservation, Channel, Room Type, Key Metrics. Each one is a spanning header above its columns with its own colour.

The thing to notice is what is not involved. No disconnected table. No field parameters. No two table visuals stacked on top of each other. No shapes placed in the background: which means your column groups move to the right along with your cursor.

<iframe src="https://www.youtube.com/watch?v=xFi8LUcKWig" title="Smart Table Dynamic column grouping" allowfullscreen></iframe>

[Click here](https://www.techietips.co.in/dashboards/Smart-Table-column-groups) to interact with the visual

## Known limits

All of these come down to one idea: some filtering reaches the model and some is local to the grid.

*   **30,000 rows.** That is the Power BI cap for a table mapping with this data reduction algorithm. Header filters push a real model filter, so filtering down to a workable set works fine. Do not point it at an unfiltered fact table.
*   **Value lists cap at 2,000 distinct values per column**, built from the loaded rows. On a high cardinality column like a guest name, use the search box in the menu.
*   **Ends with, Does not end with, and blank selections filter the grid only.** Power BI’s advanced filter operators have `StartsWith` and `Contains` but no `EndsWith`, and a blank has no equivalent in a model side `In` list. The menu tells you when you pick one of these.
*   **Bookmarks restore the data but not the ticked checkboxes.** The model filter is persisted by Power BI, so the rows come back correctly. The header checkboxes just will not show as ticked.

I wrote this to make one point: the gaps in the built-in visuals are not permanent. Build your own, and with vibe coding that is no longer a months-long project.

I am not sharing the .pbiviz file. It is an experiment, not tested for production grade reports. Feel free to checkout my [website](https://www.techietips.co.in) and reach out to me if you are interested to do these experiments along with me,

I would like to continue developing this visual and will write detailed blogs in features explaining its features and implementations.

I hope you learned something new. Feel free to share your thoughts in the comments section.

Happy Learning!!!