# Library Management

Athenaeum models the catalog and lending operations of a physical library. This glossary defines the domain language shared by the API, frontend, tests, and documentation.

## Collection

**Catalog**:
The library's collection of book titles and the information used to identify and classify them.
_Avoid_: Inventory when referring to the complete collection

**Book**:
A cataloged title with a description, available-copy count, exactly one Category, and one or more Authors.
_Avoid_: Copy, ISBN

**Available Copies**:
The number of physical copies of a Book that are currently available to borrow. Borrowing a copy decreases this count; returning it increases the count.
_Avoid_: Total copies, stock

**Author**:
A person credited with writing one or more Books.
_Avoid_: Writer when naming the domain entity

**Category**:
A classification for a Book, such as fiction, history, or science.
_Avoid_: Genre when both creative and non-creative classifications are included

## Lending

**BorrowRecord**:
The record of a User borrowing a Book, including the borrow date, due date, and return date when completed.
_Avoid_: Loan, borrowing record

**Borrowing**:
The lifecycle of a Book checkout represented by a BorrowRecord. It remains open until the Book is returned.
_Avoid_: Loan, reservation

**Borrowing Status**:
The current classification of a Borrowing: Borrowed, Due Today, Overdue, or Returned.
_Avoid_: Loan status

**Due Date**:
The date by which a Borrowing is expected to be returned.
_Avoid_: Expiry date

**Return Date**:
The date on which a borrowed Book was returned. An absent Return Date means the Borrowing is still open.
_Avoid_: Completion date

## Identity

**User**:
A library account with a name, email, password, and ADMIN or USER role. A User may be the borrower in a BorrowRecord.
_Avoid_: Member, customer, librarian

**Admin**:
A User with the ADMIN role.
_Avoid_: Administrator when referring to the role value

**Role**:
An account classification: ADMIN or USER.
_Avoid_: Permission
