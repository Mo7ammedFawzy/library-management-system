# 01: Backend test harness + CI for backend

**What to build:** As a contributor I can run `mvnw test` with a fast isolated database and see backend CI fail/pass on push, so every later ticket (authz, validation, catalog, Borrowing) is verifiable end-to-end without needing a local SQL Server.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Backend has `test` profile using H2 (or Testcontainers) so `.\mvnw test` passes with no SQL Server running; `application.properties` no longer hard-requires `localhost:1433` for tests
- [ ] At least one MockMvc slice test each for Auth (register/login), Book CRUD, and Borrow (borrow/return) using existing `FakeUserContext`/`SecurityContextUserContext` seam; only `LibraryApplicationTests.contextLoads` existed before
- [ ] Backend CI workflow runs `mvnw test` on push (frontend already has `frontend/.github/workflows/ci.yml`; there is no backend/root CI today); security `TRACE` logging disabled by default
- [ ] Demo: fresh clone runs `.\mvnw test` offline-green and CI run link shows green backend job
