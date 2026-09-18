# 04: Members (User) management grid replaces stub

**What to build:** As an ADMIN I can browse, search, and manage library members (Users) on the Members page (today a `PageStub` saying "Manage library members"), so "Members = Users" (CONTEXT.md) becomes a real vertical slice: schema/API/UI/tests.

**Blocked by:** 02: Enforce role-based authorization (members list/mutations are ADMIN-only).

**Status:** ready-for-agent

- [ ] Backend extends `/api/users`: paged list, `GET /api/users/{id}`, `PUT /api/users/{id}` (name/role), `DELETE /api/users/{id}` with ADMIN guard; `UserResponse` already exists and `UserController.getAllUsers` is the only op today
- [ ] Frontend `members.vue` is a real AG Grid page (reuse `AppDataGrid` + `useCrudPage` like books/authors): quick search, role badge, edit-role dialog, delete confirm; no `PageStub`; USER role sees 403-friendly empty state
- [ ] Validation + errors: unknown id → 404 via `ResourceNotFoundException`, role value validated against `Role` enum, handled by `GlobalExceptionHandler`
- [ ] Demo: ADMIN creates two Users via register, edits one USER→ADMIN in grid, deletes one, USER token cannot list members
