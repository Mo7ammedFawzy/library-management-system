# 05: Catalog search, pagination, and safe bulk-delete

**What to build:** As a librarian I can search books by title, filter by Category/availability, and page/sort large catalogs via the API (not just client-side AG Grid quick search), and I cannot wipe the catalog with one unauthenticated-feeling `DELETE /api/books` call.

**Blocked by:** 01: Backend test harness + CI for backend; 02: Enforce role-based authorization (paged reads stay authenticated, mutations stay ADMIN-only).

**Status:** ready-for-agent

- [ ] Backend `GET /api/books` gains `Pageable` + `q` (title contains), `categoryId`, `availableOnly` params via `BookRepository` query methods; `GET /api/books/categories/{categoryId}` kept or folded into filter; response stays in `ApiResponse` envelope (page object, not bare full `List<BookResponse>` as today)
- [ ] `DELETE /api/books` (delete-all) removed or gated behind ADMIN + explicit `?confirm=` guard with 403/400 otherwise; single `DELETE /api/books/{id}` unchanged
- [ ] Frontend books/authors/categories grids use server-side pagination/sort/filter (AG Grid `pagination: true` per AGENTS.md) against the new params; empty-search and no-results states covered
- [ ] Demo: seed 50 Books, search "dune" returns subset, page 2 differs from page 1, `availableOnly=true` hides zero-copy Books, USER bulk-delete → 403
