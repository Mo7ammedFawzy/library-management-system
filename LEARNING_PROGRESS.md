# LEARNING_PROGRESS.md

Learning state and session log for the Java/Spring Boot journey. The mentor
(and the learner) use this to know where we are, what is weak, and what to do
next.

`LEARNING_ROADMAP.md` holds the curriculum. This file holds the status.

---

## Learner Profile

- **Level:** Basic Java, a little Spring — retention is weak, so earlier
  topics must be revisited rather than assumed.
- **Learning style:** Understand the concept first, then apply it.
- **Time:** 3–5 hours per week.
- **Scope:** Backend-focused; light frontend coverage where it reinforces an
  API concept.
- **Wants:** structured curriculum, code-level explanations ("why"),
  practice challenges, and architecture discussions — all four.

---

## Phase Status

| Phase | Status |
|-------|--------|
| 1 — Java | ⬜ Not Started |
| 2 — SQL and Databases | ⬜ Not Started |
| 3 — Spring Core and Spring Boot | ⬜ Not Started |
| 4 — Backend API Development | ⬜ Not Started |
| 5 — JPA and Hibernate | ⬜ Not Started |
| 6 — Transactions and Business Logic | ⬜ Not Started |
| 7 — Security | ⬜ Not Started |
| 8 — Testing | ⬜ Not Started |
| 9 — Production Engineering | ⬜ Not Started |
| 10 — Software Architecture | 🟡 SRP studied, not retained |

Status legend: ⬜ Not Started · 🔵 In Progress · ✅ Learned · 🟡 Needs Revision

---

## Topic Notes

### Phase 10 — Software Architecture

- **SRP (Single Responsibility Principle):** studied previously (recorded in
  the old `LEARNING.md`). Not retained — revisit early and connect it to real
  classes (e.g. why `BookServiceImpl` exists vs `BookController`).

---

## Weak Areas (watchlist)

- **Streams are functional, not loop-with-side-effects.** The learner initially
  merged a `for` loop (with `result.add(...)`) into a stream pipeline. Must
  internalise that `filter`/`map`/`toList()` *replace* the loop entirely — no
  external mutable accumulator, no side effects inside `.map`. Do not write
  `.collect(Collectors.collect)` (that method does not exist); the terminal is
  `.toList()`.
- **Custom exceptions: the type itself carries meaning.** Understanding is
  forming but needs reinforcement. Why custom exceptions exist (so
  `GlobalExceptionHandler` can route by type → correct HTTP status per error).
- **Enums: can state the definition, not yet the *why*.** Knows enums are
  fixed value sets, but must be able to say *why* the project uses `Role`
  (enum) over `String` — compile-time type safety that rejects typos like
  `"admin"` or `"ADMIN "`.
- **Optional `.get()` semantics.** Previously mis-stated that an empty
  Optional's `.get()` yields `null`; it actually *throws*
  `NoSuchElementException` (assignment never completes). Rule: `Optional<T>` =
  zero-or-one, `List<T>` = zero-or-many.
- Overall retention: learned topics need revisiting.

---

## Session Log

| Date | Topic | Concepts understood | Weak areas | Exercise | Project change | Tests | Next topic |
|------|-------|---------------------|------------|----------|----------------|-------|------------|
| _(add rows as sessions complete)_ | | | | | | | |
| 2026-08-29 | Phase 1 review quiz | Records (shallow vs deep immutability — strong); `List` vs `Optional` rule (zero-or-one vs zero-or-many); stream pipeline `filter`→`map`→`toList()` (rewrote `getAllBooks`-style loop correctly); custom exceptions route by type in `GlobalExceptionHandler`; why `Role` enum over `String`. | Streams as functional (initially merged loop+side-effect into pipeline; `.collect(Collectors.collect)` doesn't exist — use `.toList()`); custom-exception *why* (forming); enum *why* (definition, not payoff yet); Optional `.get()` throws not null. | Rewrote: `for`+`ArrayList.add` → `all.stream().filter(avail).map(BookMapper::toResponse).toList()` (correct final answer). | None (review only). | None (review only). | Apply the stream pipeline pattern to a real method + write a JUnit/Mockito unit test for `BookServiceImpl` (moves into Phase 8 testing); or finish the tour (Applies Enums→`Role`, Exceptions→`BorrowServiceImpl` availability checks). |

---

## Next Recommended Topic

**Apply the stream pipeline to a real method + its first unit test.** The
tour has covered Records, Optional, and Streams (with Exceptions and Enums
now taught in review). The highest-leverage next step is to *consolidate* the
streams learning by using it in `BookServiceImpl` (it's already there) and —
more importantly — **write a JUnit/Mockito unit test for `BookServiceImp`**
(e.g. `getAllBooks` mapping, `getBookById` not-found → `orElseThrow`,
`createBook` missing category). This crosses into Phase 8 (Testing) but is the
single best way to lock in both Java fundamentals and the `findById().orElseThrow`
+ stream patterns. Verify with `.\mvnw test`.

Fallback if testing feels too soon: finish the Phase 1 tour by applying the
concepts — Enums already used by `User`/`UserResponse` (`Role`), and Exceptions
as domain errors in `BorrowServiceImpl` (unavailable book → 409) — then return
to testing.