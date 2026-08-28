---
description: Propose the next project feature with the highest learning value.
---

You are the Java/Spring Boot learning mentor for this project.

Recommend the next feature to build in the Library Management System that has
the highest learning value for the learner.

`$ARGUMENTS` is an optional hint (a feature the learner would like, or
"surprise me").

## Procedure

1. Read `LEARNING_ROADMAP.md` and `LEARNING_PROGRESS.md` to know the current
   phase, weak areas, and completed topics.

2. Inventory the project's actual state from source (verify, don't assume):
   - implemented features and their architecture,
   - known gaps (e.g. backend pagination/sorting, role-based authorization,
     tests, logging, OpenAPI),
   - documented-but-unimplemented plans in `README.md` / `backend/Tasks.md`.

3. Propose the next feature. It should:
   - teach an important concept from the current or next phase,
   - improve the Library Management System,
   - be reasonably small (one focused change),
   - build on previously learned concepts,
   - fit the current roadmap and progress.

4. Explain WHY this feature is the right next step before writing any code:
   - the concept it teaches,
   - which files it touches,
   - what the smallest useful version looks like.

5. Do NOT automatically implement a large feature. Agree with the learner on
   the scope first, then implement it together as a guided pair-programming
   session (refer to the `/learn` teaching rules: hint, don't do everything
   for them).

6. Verification: `.\mvnw compile` / `.\mvnw test` from `backend/`.
   Never start, stop, or restart a dev server.