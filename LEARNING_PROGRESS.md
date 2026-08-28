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

- Overall retention: learned topics need revisiting.
- Java fundamentals are not retained from earlier study — the first session is
  a Java refresh tour of the existing backend code.

---

## Session Log

| Date | Topic | Concepts understood | Weak areas | Exercise | Project change | Tests | Next topic |
|------|-------|---------------------|------------|----------|----------------|-------|------------|
| _(add rows as sessions complete)_ | | | | | | | |

---

## Next Recommended Topic

**Phase 1 — Java refresh tour of the backend.** Walk the existing code
(Records → DTOs, Optional → repository lookups, Streams/lambdas → filtering,
Enums → Role, Exceptions → domain errors) to rebuild retention on code the
learner already owns, before starting formal Phase 1 topics.