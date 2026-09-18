# 07: Real Profile + Settings (remove hardcodes and stubs)

**What to build:** As a logged-in member I see my own name/email/role and borrowing summary on Profile (today hardcoded "Mohammad Fawzy / Administrator") and can use Settings (today a `PageStub`), with dark/light toggle persisted.

**Blocked by:** 04: Members management grid (needs the `/api/users` read + `UserResponse` contract).

**Status:** ready-for-agent

- [ ] Backend adds `GET /api/users/me` returning `UserResponse` for `UserContext.getCurrentUser()` plus optional borrowing counts; reuses `UserMapper`, 401 when unauthenticated
- [ ] Frontend `profile.vue` loads `/api/users/me` (avatar initials from real name, role badge, my Borrowing stats via `fetchBorrowings`/`getStatus`); no hardcoded strings; loading + 401 states covered
- [ ] Frontend `settings.vue` replaced (no `PageStub`): theme toggle (light/dark per README), account summary link, library preferences persisted to localStorage; matches DESIGN.md tokens (burnt-orange primary, stone neutrals, 4px radii, no pill badges)
- [ ] Demo: login as two different Users shows two different Profiles; theme toggle survives reload; logged-out visit redirects to login
