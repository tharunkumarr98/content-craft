---
title: "Send Customized Emails Using Fabric Data Pipelines"
date: "2025-06-15"
summary: "Showed how to built a simple automation that notifies employees when their weekly working hours fall below a threshold, no Power Automate, no external tools. All done within the Fabric ecosystem"
tags: ["Fabric","Data Pipeline", "SQL"]
---

**Imagine this:** You’re a data engineer, and you’ve been asked to implement an automated mechanism to notify employees whose weekly working hours fall below a defined threshold say, 35 hours. The ask is simple:

*   Every week, after the data load completes, an email should be sent to each such employee.
*   The email should be personalized and neatly formatted.
*   Additionally, there must be a way to log and track which employees were notified.

Sounds like something that can be done using Power Automate or another workflow tool, right?

But here’s the twist, you’re a **data engineer**, not an automation expert.
Wouldn’t it be great if you could do all of this within your existing skillset, inside a tool you already know like Fabric Data Pipelines?

Well, let’s do just that!

**The Data Source**

Every week, the employee attendance system exports a flat **.csv** file with working hours of employees.

![captionless image](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*j2vF9ryt6xsWuLTW1EwEEA.png)

A pre-existing Fabric (ADF) pipeline ingests this file and loads it into a **Delta table** within a **Fabric Lakehouse**.

![captionless image](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*WA-gHauwYwZ5EYJtHylefA.png)

**Filter the Data**

Now, we want to add logic to the same pipeline to identify only those employees who have logged less than **35 hours** in the current week.

To do this, I added a **Lookup activity** in the pipeline, which runs the following SQL:

```SQL
SELECT 
    EmployeeId, 
    EmployeeName, 
    SUM(WorkingHours) AS TotalWorkingHoursOfTheWeek
FROM 
    employeeworkinghours
WHERE 
    Date > (SELECT DATEADD(DAY, -7, GETDATE()))
GROUP BY 
    EmployeeId, 
    EmployeeName
HAVING 
    SUM(WorkingHours) < 35;
```

![captionless image](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*3WuPInv8r07ajMgnXjVR9Q.png)

**Email Template**

Here’s a sample of the email we’re going to send:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6rCaHns6b_iipYSMCUi2XA.png)

Take note of the placeholders like **employee name**, **hours worked and date** these will be dynamically injected from the dataset.

This is base html required to create such email

```HTML
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
      line-height: 1.6;
    }
    .container {
      width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #e0e0e0;
      background-color: #f9f9f9;
    }
    .header {
      background-color: #0047AB;
      color: white;
      padding: 10px 20px;
      text-align: center;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #777;
      text-align: center;
    }
    .highlight {
      color: #D32F2F;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Weekly Hours Notification</h2>
    </div>
    <p> Dear <strong>{{EmployeeName}}</strong>,</p>
    <p>We hope you're doing well.</p>
    <p>Our records show that your total working hours for the week starting on <strong>{{WeekStartDate}}</strong> is <span class="highlight">{{HoursWorked}} hours</span>, which is below the minimum expected threshold of 35 hours.</p>
    <p>If this was unintentional, please review your timesheet and ensure all hours are logged accurately. If you foresee any challenges in the coming weeks, feel free to reach out to your reporting manager.</p>
    <p>Thank you for your attention to this.</p>
    <p>Best regards,<br/>
    <strong>HR Team</strong></p>
  </div>
</body>
</html>
```

Now for each employee who did not met the working hours threshold limit, we need to create HTML before sending the email. We can use ‘for each’ iterator and place the list of records retrieved from the lookup activity

![captionless image](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*kvznx1BC85bpPDRMt7WZ8g.png)

```Expression
@activity('GetEmployees').output.value
```

**Structuring the HTML**

To manage the email content dynamically, I created email body in a pipeline **variable**,

![captionless image](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*CFbMVsworWrIxEgjiZRsEw.png)

```Expression
@concat(
    '<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
      line-height: 1.6;
    }
    .container {
      width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #e0e0e0;
      background-color: #f9f9f9;
    }
    .header {
      background-color: #0047AB;
      color: white;
      padding: 10px 20px;
      text-align: center;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #777;
      text-align: center;
    }
    .highlight {
      color: #D32F2F;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Weekly Hours Notification</h2>
    </div>
    <p>Dear  <strong>', item().EmployeeName  ,  '</strong>,</p>
    <p>We hope you are doing well.</p>
    <p>Our records show that your total working hours for the week starting on <strong>', formatDateTime(addDays(utcNow(), -7), 'MM-dd-yyyy')
 ,'</strong> is <span class="highlight">' , item().TotalWorkingHoursOfTheWeek, ' hours</span>, which is below the minimum expected threshold of 35 hours.</p>
    <p>If this was unintentional, please review your timesheet and ensure all hours are logged accurately. If you foresee any challenges in the coming weeks, feel free to reach out to your reporting manager.</p>
    <p>Thank you for your attention to this.</p>
    <p>Best regards,<br/>
    <strong>HR Team</strong><br/>
    <strong>Techie Tips International</strong></p>
    <div class="footer">
      This is an automated message from the attendance tracking system. Please do not reply.
    </div>
  </div>
</body>
</html>'
    )
```

**Sending the Email**

With the final HTML ready, I added an **Outlook activity** to the pipeline and configured it to:

![captionless image](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*yLI8dds18FaeokndFHlCxw.png)

I hand coded the ‘To’ email, as this pipeline is created for demo purpose. You need to replace it with the actual employee email address. As a best practice, instead of sending these emails from individual email id you can consider creating a shared mail box and put that mail in the “Send as” section. You will find “Send as”, “CC” and “Importance” options under: settings > advanced section.

Now the pipeline looks like this

![captionless image](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*hLwegrIoOQOSpM-nIk_Vfw.png)

**Logging Sent Notifications**

To maintain an audit trail, I created a simple logging table in the Lakehouse and used a **copy activity** to insert a record for every email sent.

To create such table, you can use the below SQL statement

![captionless image](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*4GaV17NwK1PDl_Ee1xNryw.png)

```SQL
SELECT 
    EmployeeId, 
    EmployeeName, 
    GETDATE() AS EmailSentOn
FROM 
    employeeworkinghours
WHERE 
    Date > (SELECT DATEADD(DAY, -7, GETDATE()))
GROUP BY 
    EmployeeId, 
    EmployeeName
HAVING 
    SUM(WorkingHours) < 35;
```

Boom! You’ve now delivered exactly what your manager asked for

![captionless image](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*q0jVpPeYSojBI8FvhmRWOg.png)

**Final Thoughts**

Of course, there are other ways to approach this using Power Automate, Paginated Reports (with mail merge), or third-party services. But this blog shows an approach using only Fabric Data Pipelines.

I’d love to hear how _you_ would approach this. Have you built something similar? Any suggestions or improvements to this method?

Thanks for reading
Happy Learning!