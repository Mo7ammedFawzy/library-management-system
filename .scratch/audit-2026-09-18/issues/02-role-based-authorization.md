# 02: Enforce role-based authorization (ADMIN vs USER)

**What to build:** As a USER I cannot mutate the Catalog (Book/Author/Category create/update/delete, bulk `DELETE /api/books`) or list all Users, and I cannot borrow on behalf of someone else via `POST /api/borrow/{bookId}?userId=`; as an ADMIN I can, and the UI hides admin-only actions.

**Blocked by:** 01: Backend test harness + CI for backend (needs the H2/MockMvc harness to prove allow/deny).

**Status:** ready-for-agent

- [ ] `@EnableMethodSecurity` (or SecurityConfig requestMatchers) restricts catalog mutations + `GET /api/users` + bulk delete to `ADMIN`; `BorrowServiceImpl.resolveBorrower` ignores/forbids `userId` param for non-ADMIN (self = `UserContext.getCurrentUser()`); today any JWT can do everything (AGENTS.md: "Role-based authorization is not currently implemented")
- [ ] Dangerous `DELETE /api/books` (delete-all) is ADMIN-only with explicit confirmation guard or removed; returns 403 for USER with `ApiResponse`/`ApiError` envelope via existing `GlobalExceptionHandler`
- [ ] Frontend hides/disables admin actions for USER role (books/authors/categories grids, members link) instead of showing buttons that 403; uses real JWT role, not `MOCK_TOKEN` bypass
- [ ] Demo: USER token gets 403 on `POST /api/books` and `GET /api/users` and `POST /api/borrow/1?userId=999`, ADMIN succeeds; MockMvc + frontend check included
