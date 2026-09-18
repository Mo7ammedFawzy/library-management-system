# 06: Borrowing scoping — my history, no user spoofing, overdue honesty

**What to build:** As a User I see only my own BorrowRecords under "My Borrowings" and can borrow/return as myself; as a librarian (ADMIN) I can see all BorrowRecords; nobody can forge `?userId=` and overdue status comes from real dates (BorrowRecord backend = Borrowing frontend per CONTEXT.md).

**Blocked by:** 02: Enforce role-based authorization (self-vs-all scoping depends on the authz guard).

**Status:** ready-for-agent

- [ ] Backend adds `GET /api/borrow/me` (current `UserContext` user, 14-day `dueDate` rule preserved) and scopes `GET /api/borrow` to ADMIN-only (today it returns every User's records to any authenticated caller — privacy leak); non-ADMIN `?userId` on `POST /api/borrow/{bookId}` is ignored or 403
- [ ] Overdue/renew path defined: `BorrowResponse` dates unchanged, frontend `getStatus()` (Overdue/Due Today/Borrowed/Returned) documented against backend raw dates; double-return still 409 via `BookAlreadyReturnedException`, unavailable still 409 via `BookUnavailableException`
- [ ] Frontend borrowings page splits "Mine / All" (All visible to ADMIN only), borrow dialog defaults to self, return button calls `POST /api/borrow/{borrowId}/return` (exists but undocumented in README) with toast on 409
- [ ] Demo: USER-A sees only own rows, USER-A borrowing as USER-B → 403/self, ADMIN sees all, overdue book shows Overdue badge
