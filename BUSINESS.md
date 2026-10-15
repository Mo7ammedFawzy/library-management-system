# Athenaeum — Business Overview

## What it is
Athenaeum is a workstation for running a physical library. Staff use it to keep the book catalog up to date, record who borrows which book, and track returns and late items. A dashboard gives a quick picture of the collection and lending activity.

For the full vocabulary, see [CONTEXT.md](CONTEXT.md).

## Users & roles
Every account has one of two roles. Today the system records the role but **does not yet restrict anyone by it**: any signed-in account can do everything listed below.

| Role | Who | Can do (today) | Can't do (today) |
|---|---|---|---|
| Visitor | Anyone not signed in | Create an account, sign in | Anything else |
| User | Any registered account (new sign-ups get this role) | Everything an Admin can | Change their own password for real (screen is a demo only) |
| Admin | Library staff; only created by the library, not by sign-up | Manage books, authors, categories; borrow and return books for any member; see all borrowings and all members | Change their own password for real; manage member accounts |

Planned: limit catalog changes, the member list, borrowing for others, and seeing everyone's borrowings to Admins only. Users would see only their own borrowings.

## Core concepts
- **Book** — a title in the catalog, with a description, a count of available copies, one category and one or more authors.
- **Available copies** — how many copies can be lent right now. Goes down on borrow, up on return.
- **Author** — a person credited on one or more books.
- **Category** — the shelf a book belongs to (Fiction, History, Science, …).
- **Borrowing** — one book lent to one member, with a borrow date, due date and, once finished, a return date.
- **Member** — a library account (same thing as a User).

## Main flows
### Sign up and sign in
1. A visitor registers with name, email and password.
2. They are signed in straight away as a User.
3. Returning users sign in with email and password.

### Managing the catalog
1. Staff open Books and search by title, author, description or category, or filter by shelf.
2. They add a book: title, description, number of available copies, one category, at least one author.
3. They can edit or delete a book.
4. Authors and Categories each have their own page to add, rename or delete entries.

### Borrowing a book
1. Staff open Borrowings and choose "borrow".
2. They pick a book and a member. If no member is chosen, the book is lent to whoever is signed in.
3. The system checks a copy is available, records the borrowing, and sets the due date 14 days from today.
4. One available copy is taken off the book.

### Returning a book
1. Staff find the open borrowing (search by book title or member name, or filter by status).
2. They mark it returned. Today's date becomes the return date and one copy goes back on the shelf.

### Checking the dashboard
1. Staff see totals for books, copies, active and overdue borrowings.
2. They see a 7-day borrowing trend, books by category, recent activity, and loans that need follow-up.

## Business rules
- A book must have a title, exactly one category, at least one author, and zero or more available copies. A description, if given, is at least 10 characters.
- Authors and categories must have a name.
- A book with no available copies cannot be borrowed.
- Loan period is fixed at **14 days** from the borrow date.
- A borrowing can be returned only once; a second return is rejected.
- Borrowing status is worked out from dates:
  - **Returned** — has a return date.
  - **Overdue** — not returned and the due date has passed.
  - **Due Today** — not returned and due today.
  - **Borrowed** — not returned and due later.
- New sign-ups always get the User role.
- Change-password rules shown on screen: at least 8 characters, one capital letter, one number, different from the current password, typed twice to confirm.
- If the server cannot be reached, the screens show sample data so they can still be browsed. Changes made in that mode are not saved.

## Pages / screens
**Visitors**
- Sign in — enter email and password.
- Register — create an account.

**Signed-in staff** (all accounts, today)
- Dashboard — collection and lending overview, trend chart, category breakdown, recent activity, overdue list.
- Books — search, filter by shelf, add, edit, delete books.
- Borrowings — lend a book, return a book, search and filter by status, view details.
- Authors — list, add, rename, delete authors.
- Categories — list, add, rename, delete categories.
- Members — placeholder ("Member directory coming soon"), links to Borrowings and Books.
- Profile — account summary (currently shows fixed sample details, not the signed-in person).
- Settings — personal preferences such as default loan period and reminder options, saved only on this device.
- Change password — form with rules; does not change the password yet.

## Status
**Done**
- Sign up and sign in.
- Book, author and category management.
- Borrowing and returning with availability checks and 14-day due date.
- Borrowing statuses and search/filter.
- Dashboard figures, worked out on screen from current data.
- Sample-data mode when the server is down.

**In progress**
- Server-side dashboard summary (started, not finished).
- Recent-activity feed: some "added"/"removed" entries and the greeting name on the dashboard are still made-up placeholders.

**Planned**
- Role-based access: Admin-only catalog changes, member list and borrowing for others; Users see only their own borrowings.
- Clear errors for bad sign-up details and for an email already in use.
- Real password change.
- Members page: browse, search, change role, remove members.
- Real Profile and Settings tied to the signed-in account.
- Searching and paging large catalogs on the server; making "delete all books" safe or removing it.
- Sample-data mode only when the server is truly unreachable, clearly labelled as demo data.

## Open questions
- Should Users (non-staff) be able to borrow for themselves, or must all lending go through an Admin?
- The Settings page lets staff pick a default loan period, but every loan is fixed at 14 days. Should the setting control the due date, and who may change it?
- Settings offers email reminders and a daily summary. Is anything meant to send these?
- Are there late fees, borrowing limits per member, or renewals? Nothing defines them today.
- What should happen when deleting an author or category that is still linked to books?
- How does someone become an Admin? Sign-up only creates Users and there is no screen to change roles.
- A "delete all books" action exists behind the scenes. Is it wanted at all, and if so, by whom and with what safeguard?
- Should deleted books still appear in the activity history (the planned feed lists "book removed" events, but deletions leave no record)?
- Can a member borrow the same book twice at once, or have unlimited open borrowings?
