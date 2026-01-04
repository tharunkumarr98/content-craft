---
title: "Automatically Default a Power BI Slicer Based on the Logged-In User (No RLS and No Bookmarks)"
date: "2026-01-04"
summary: "Workaround to default the slicer selection dased on the Logged-In User"
tags: ["Power BI", "DAX", "Data Modelling"]
---

## Requirement

When a user opens the report, the `User` slicer should automatically default to their own name. They should still have the ability to manually change the filter afterward to view data of other users. 

## Conditions

1. Row-Level Security (RLS) cannot be used, because users are allowed to view data of other users. 
2. Personal bookmarks cannot be used, because we cannot expect each user to open the report and create a bookmark and save it. It is not a scalable approach as well.


## Data Model

Contains two tables: `DimAccess` and `FactTransactions`

**DimAccess**
![captionless image](images/tipsntricks/loggedInUserSelection/1.png)
**FactTransactions**
![captionless image](images/tipsntricks/loggedInUserSelection/2.png)
**Relationship View**
![captionless image](images/tipsntricks/loggedInUserSelection/3.png)
**Existing Measures**

```DAX 
SalesAmount = SUM(FactTransactions[amount]) 
```

Solution starts from here

## Step 1 - Add a row for 'Me' 

Add a new row in `DimAccess` Table

![captionless image](images/tipsntricks/loggedInUserSelection/4.png)

## Step 2 - Create a measure to filter logged in user from User slicer

```dax
RemoveLoggedInUser = 
VAR __AllUsers = ALL(DimAccess[User UPN])
VAR __LoggedInUser = USERPRINCIPALNAME()
VAR __UserInCurrentRow = SELECTEDVALUE(
    DimAccess[User UPN],
    "user1@rtktechietips.com"
)
VAR __LoggedInUserNotinTheAccessTable = NOT (__LoggedInUser IN __AllUsers)
VAR __Result = IF(
    __LoggedInUserNotinTheAccessTable,
    1,
    IF(
        __LoggedInUser = __UserInCurrentRow,
        0,
        1
    )
)
RETURN
    __Result 
```

Add this measure as visual level filter on User slicer 
![captionless image](images/tipsntricks/loggedInUserSelection/5.png)

**Testing**
When user1 logs in (user1 is removed from the slicer)
![captionless image](images/tipsntricks/loggedInUserSelection/6.png)

Similarly when user4 logs in 
![captionless image](images/tipsntricks/loggedInUserSelection/7.png)


## Step 3 - Create a calculation group to apply logged in User filter 

```dax
ReplaceMe = 
IF(
ISSELECTEDMEASURE([RemoveLoggedInUser]),
SELECTEDMEASURE(),
VAR __AllUsers = ALL(DimAccess[User UPN])
VAR __selectedUser = SELECTEDVALUE(
    DimAccess[User UPN],
    "user1@rtktechietips.com"
)
VAR __loggedInUser = USERPRINCIPALNAME()
VAR __loggedInUserValue = CALCULATE(
    SELECTEDMEASURE(),
    KEEPFILTERS(DimAccess[User UPN] = __loggedInUser),
    REMOVEFILTERS(DimAccess)
)
VAR __selectedUserValue = SELECTEDMEASURE()
VAR __LoggedInUserNotinTheAccessTable = NOT (__LoggedInUser IN __AllUsers)
VAR __LoggedInUserNotinTheAccessTableValue = CALCULATE(
    SELECTEDMEASURE(),
    REMOVEFILTERS(DimAccess)
)
VAR __Result = IF(
    __LoggedInUserNotinTheAccessTable && __selectedUser = "loggedInUser",
    __LoggedInUserNotinTheAccessTableValue,
    IF(
        __selectedUser = "loggedInUser",
        __loggedInUserValue,
        __selectedUserValue
    )
)
RETURN
    __Result
)
```

Add this calculation group column as report level filter

![captionless image](images/tipsntricks/loggedInUserSelection/8.png)

Change the slicer selection type as "Single Select". 

Keep the default selection in the slicer as "Me".

## Result

When **user4** logs in, data in the table visual is filtered with **user4** and

![captionless image](images/tipsntricks/loggedInUserSelection/9.png)

**user4** still has the option to switch to other users.

![captionless image](images/tipsntricks/loggedInUserSelection/10.png)

**Note**
1. Depending on the complexity of your data model, you may need to adapt the DAX pattern. Please treat this approach as a workaround and a proof of concept rather than a one-size-fits-all solution.
2. In the example above, if a user logs in whose name does not exist in the `DimAccess` table, the slicer will display all user names by default. In this case, selecting **Me** will show records for all users, while selecting any specific user name in the slicer will correctly filter the table to that user’s records.

You can download the PBIX file from [here](https://bit.ly/4spYg4y).

Happy Learning!!!
