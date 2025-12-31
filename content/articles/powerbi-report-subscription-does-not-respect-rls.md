---
title: "Power BI Report subscriptions does not respect RLS"
date: "2025-03-02"
summary: "Power BI report subscriptions don’t always respect RLS, In some scenarios, users might receive data they shouldn’t see! In my latest blog, I break down a real-world example and show how Dynamic Subscriptions can solve this issue."
tags: ["Power BI", "Report", "Subscriptions", "RLS"]
---

You have built a Power BI semantic model and created a report on top of it. To ensure users see only relevant data, you implemented [Row-Level Security (RLS)](https://learn.microsoft.com/en-us/fabric/security/service-admin-row-level-security) using a user table that maps email IDs to respective countries.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*Gjz9CKXzEq9BgN2r)

You mapped this table in such a way that it will filter the whole model and show the relevant countries data to the end users. As per the above table

*   Aditya should see data from India, Japan, and the United States.
*   Chris should see data from the United States and Great Britain.

After the modelling the data model looks like below

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*gVk1aSj7aDy7pphk)

You created a RLS role, and your logic is as follows

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*a2CrxY3iin5ps9Di)

After modelling the relationships correctly, you tested the RLS in Power BI Desktop using the “View as” option. Everything worked as expected.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*gFcNB4naNTraWL8P)![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*NRwcF_eP-UJBoeJJ)

You then published the report to Power BI Service, assigned users to the respective security roles,

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*vYcL1ESeat62-bxT)

and shared the report.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*uCbUYq74wjaY8j6g)

Aditya, who is well-versed in Power BI, tested the report and confirmed that the security filters were working correctly.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*faGDJpQHVUIHNi2M)

He then set up a personal subscription to receive periodic updates.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*tXTzrkQboSmGhbN9)

When he received the email, the data was still filtered correctly according to his RLS settings.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*Cn52RmQ7WVOMf6sW)

However, Chris is a business user with limited Power BI knowledge, he requested an automated report. As a report developer, you created a “Standard Subscription” and added his email to the recipients list.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*qfPFE_ZUjgiXsm-0)

When Chris received the email and opened the email, he was shocked! Instead of seeing only United States and Great Britain, he could see all countries data.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*Rn3wJIJ1NEypakLp)

This is a serious security concern, as the expectation was that RLS would be enforced in the subscription, just like it is within the report. But Power BI report subscriptions are not respecting the RLS on the semantic model.

Isn’t it?

In my opinion it is respecting the Row level security, otherwise when Aditya created a subscription on his own, he would have received the data of all the countries not just the data of India, Japan and United States.

The problem is subscriptions will consider the security filters of the person who created the subscription rather than the recipient. I believe that is how they are designed.

It would be great if Microsoft provided a warning when someone adds a recipient on the report subscription creation page, especially for reports with RLS implemented.

A simple, low-code approach to handle this scenario is to use [Dynamic Report Subscriptions](https://learn.microsoft.com/en-us/power-bi/collaborate-share/power-bi-dynamic-report-subscriptions) instead of standard subscriptions.

Add a duplicate of the user email column in your user’s table.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*CvweNoP3iqOkl7Vk)

Publish the Report to Power BI Service. Instead of selecting Standard Subscription, choose Dynamic Report Subscription.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*YIsJRUhyds9d8_iu)

Use the same semantic model since the users table is the same semantic model and select the user email field.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*tQhiyfBvj6nIOwJ6)

Instead of entering email addresses manually, select “Get from Data” and map it to the Email ID column.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*wAkEf4W_BpV9U00Z)

Add a Dynamic Filter based on the RLS settings.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*LQJoMrrvqufLB7mG)

Once the subscription is configured, it looks like this

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*4X2rUktPWl1t270Y)

Aditya will now receive data filtered to his assigned countries.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*DN8HvmKvzFSsQ5LJ)

Chris will only receive data from the United States and Great Britain, as expected.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*U5K40V9P8YXucDIG)

## Points to Remember

1. Dynamic Subscriptions work only in Premium or Fabric capacity backed Workspaces.

2. To implement a similar approach for static row-level security (RLS) implementation, create one subscription for each RLS role and configure the security filters accordingly. The recipient’s email address should also be added manually.

3. I created a suplicate of email address column in the users table before configuring the dynamic subscriptions, because a column cannot be filtered by itself.

## Conclusion

Power BI Dynamic Subscriptions provide a robust way to ensure report security while automating data distribution. Have you ever faced this challenge? How did you tackle it? Have you used Dynamic Subscriptions before?

Share your experiences in the comments — I’d love to learn from you!

Happy Learning!!!