---
title: "Invoke Multiple Forms in a Single Power App from a Power BI Report"
date: "2025-07-13"
summary: "Workaround for two known limitations, triggering specific forms from Power BI and fixing the app visual's rendering issue, all without compromising user experience."
tags: ["Power Apps","Power Fx", "Power BI", "DAX"]
---

Recently, I was asked to integrate a Power App form into a Power BI report to enable **write-back functionality** for end users. While working on this task, I encountered two interesting challenges. In this blog, I’ll walk you through what those challenges were and how I worked around them.

## The Business Scenario

A company maintains insurance records for its global assets using an Excel workbook. These include both **insurance premium payments** and **claims** filed due to business disruptions or calamities. The company wanted to:

*   Formalize data entry using a Power App
*   Build a Power BI dashboard to visualize and analyze this data

We created:

*   A **Power BI dashboard** with two pages: “Premiums” and “Claims”
*   A **Power App** with two main forms: one for premiums and one for claims

At first glance, it seemed straightforward but during integration, I hit two roadblocks.

## Challenge 1: Triggering the Right Form Based on Report Page

To test integration, I designed a Power App with five screens:

*   Landing
*   Create New Premium Record
*   Edit Existing Premium Record
*   Create New Claim Record
*   Edit Existing Claim Record

Then I embedded this app in both report pages using the Power Apps visual.

**The problem:**
Regardless of the Power BI report page, the embedded app **always loaded the landing page**. There was no native way to make the app load a specific form based on which report page it was embedded in.

**Finding:**
After some research, I learned Power BI **does not support deep linking to different app screens via the visual itself**. This was my first challenge.

## Challenge 2: Power App Visual Rendering Bug

If you’ve ever used the Power Apps visual in Power BI, you’ve likely seen this odd behavior:

*   When the report page loads, the visual takes a few seconds to render.
*   During this time, a screen appears saying “Let’s get started,” asking users to select an app **even though the app is already configured.**
*   After a second or two, the actual form finally appears.

This may seem harmless, but stakeholders were unhappy with the poor user experience. I reached out to the Power BI community, and learned this is a **known issue with no current fix**.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Kd_wz0Q-CH0wP0-h5K9kKQ.gif)

_If you observe the above gif, you will observe both the challenges I explained above. Both the Premiums report page and in the claims tab, the default page is the landing page and the app rendering is showing “Lets get started” page for a fraction of second._

## Solution: Use App URL Parameters

Let me be clear I’m not an expert in Power Apps. But here’s how I managed to solve both problems with a simple workaround:

**Step 1: Add index columns**

I added an **index column** to both the **premiums** and **claims** tables in Power BI. This unique ID helps identify individual records.

**Step 2: Use DAX to generate app URLs**

I removed the Power Apps visual from both report pages and replaced it with a **DAX measure** that generates a clickable **URL** in a table visual.

Power Apps supports [**URL parameters**](https://community.dynamics.com/blogs/post/?postid=1f3d92b7-8fff-4c3c-9cd2-1f8ad0a21e0d), which means we can pass values (like IDs) directly to the app.

Example:

*   For the “Premiums” page, I passed the PremiumsItemID
*   For the “Claims” page, I passed the ClaimsItemID

```DAX
ClaimsAppURL = "https://apps.powerapps.com/play/e/<EnvironmentId>/a/<AppId>?PremiumsItemID=&ClaimsItemID=" & SELECTEDVALUE('RISK Management Claims'[ID]  )

PremiumsAppURL = "https://apps.powerapps.com/play/e/<EnvironmentId>/a/<AppId>?PremiumsItemID=" & SELECTEDVALUE('RISK Management'[ID]) & "&ClaimsItemID=" & ""
```
![captionless image](https://miro.medium.com/v2/resize:fit:1248/format:webp/1*plqpj6xucKgRyG5KzBa-qA.png)

**Step 3: Read Parameters in Power App**

Inside the app, I created two **global variables**:

```PowerFx
Set(PremiumsItemID, Param("PremiumsItemID"));
Set(ClaimsItemID, Param("ClaimsItemID"));
```

These capture the values passed via the URL.

**Step 4: Add a Loading Screen**

I created a **“Loading Screen”** in Power Apps with:

*   A loading GIF
*   A `Timer` control with a short delay (e.g., 100ms)

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*EEmqVnwFBC7IYD1XGwRj4Q.png)

**Step 5: Navigate Automatically Based on Passed Parameter**

For the timer’s `OnTimerEnd` property, I added the following logic:

```PowerFx
If(
    ClaimsItemID <> "" And PremiumsItemID<>"",
    Navigate('StartScreen'),
    If(
        ClaimsItemID <> "",
        Navigate('Edit Claims Record'),
        Navigate('Edit Premiums Record')
    )
)
```

When the app loads:

*   The loading screen is shown first
*   The timer triggers after 100ms
*   Based on the passed ID, it navigates to the appropriate form

## Benefits of This Approach

- ✅ One Power App handles multiple forms
- ✅ App opens the right screen based on data selected in Power BI
- ✅ No rendering delay or confusing “Let’s get started” prompt
- ✅ Improved UX and performance

## A Note on Best Practices

I understand this workaround doesn’t strictly follow the idea of **embedded write-back** using the Power Apps visual. But given the **limitations** I encountered, this was a practical and scalable solution.

## Final Thoughts

With this approach, we achieved:

1.  Seamless navigation from Power BI to specific Power Apps forms based on user interaction
2.  Elimination of known rendering bugs in the Power Apps visual

If you’ve encountered similar issues or have other solutions, I’d love to hear them drop your thoughts in the comments.

Thanks for reading!
Happy building.