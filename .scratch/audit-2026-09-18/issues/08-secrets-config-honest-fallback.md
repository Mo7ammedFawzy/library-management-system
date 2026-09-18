# 08: Secrets/config hygiene + honest offline fallback

**What to build:** As a new contributor I can boot the stack without committing secrets or needing local SQL Server, and as a user I am never silently shown mock catalog/borrowing data when the server is actually erroring (500) or when I am "logged in" with a fake token.

**Blocked by:** 01: Backend test harness + CI for backend (H2 profile + CI prove the config split).

**Status:** ready-for-agent

- [ ] Backend reads DB credentials + `jwt.secret`/`jwt.expiration` from env (with local defaults), removes committed `test/123456` + hardcoded JWT secret from `application.properties`; adds `docker-compose.yml` (SQL Server) and documents H2-dev vs SQL Server-prod in README/`backend/README.md`
- [ ] Frontend `withFallback()` only falls back on `NetworkError` (backend unreachable), never on `ApiError` 4xx/5xx validation/authz failures; `isBackendUnavailable` fixed accordingly and offline banner shown when mock data is displayed
- [ ] `MOCK_TOKEN` no longer passes `isAuthenticated()` as logged-in; mock mode is explicitly labeled demo data; mock `borrowBook` enforces availability (throws when `availableCopies == 0`, matching `BookUnavailableException`) instead of `Math.max(0, ...)` silent decrement
- [ ] Demo: backend boots via env vars with no committed secret; stop backend → banner + mock data; backend returns 400 → real error toast, not mock data; no fake-token access to guarded pages
