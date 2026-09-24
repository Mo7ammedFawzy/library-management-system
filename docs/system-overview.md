# System Overview

Athenaeum is a two-application library management system:

- `backend/` provides the authenticated REST API and persists catalog, lending, and account data.
- `frontend/` provides the Vue workstation UI and can fall back to in-memory demo data when the API is unavailable.

The canonical domain vocabulary is defined in [`CONTEXT.md`](../CONTEXT.md). Visual and interaction rules are defined in [`DESIGN.md`](../DESIGN.md).

## Implemented Workflows

### Authentication

- Register and log in with email and password.
- Authenticate subsequent API requests with a JWT bearer token.
- Store account roles as `ADMIN` or `USER`.
- View account details in the frontend profile and edit locally stored preferences in settings.
- Change the password in the frontend demonstration flow.

The backend currently authenticates protected endpoints, but it does not enforce role-based authorization.

### Catalog

- Create, view, edit, and delete Books.
- Manage the number of copies currently available for each Book.
- Assign exactly one Category and one or more Authors to each Book.
- Search and filter Books by title, author, and category.
- Create, view, edit, and delete Authors and Categories.

### Lending

- Borrow an available Book for a selected User or the authenticated User when no User is selected.
- Set a due date 14 days after the borrow date.
- Prevent borrowing when a Book has no available copies.
- List Borrowing records with their Book, User, and dates.
- Return an open Borrowing once; returning the same record again is rejected.
- Present Borrowings as Borrowed, Due Today, Overdue, or Returned.

### Reporting

- Summarize collection and lending activity on the dashboard.
- Show a seven-day borrowing trend and category distribution.
- List recent activity and loans requiring follow-up.

## Frontend Pages

| Route | Current responsibility |
| --- | --- |
| `/login`, `/register` | Authentication |
| `/dashboard` | Catalog and lending overview |
| `/books` | Book catalog management |
| `/authors` | Author management |
| `/categories` | Category management |
| `/borrowings` | Borrowing, returning, filtering, and history |
| `/members` | Placeholder for the User directory |
| `/profile` | Locally stored account summary |
| `/settings` | Locally stored account and lending preferences |
| `/change-password` | Frontend-only password-change demonstration |

Profile, settings, and change-password screens currently demonstrate the intended experience without corresponding profile-preference or password-change API endpoints. The Members page is also a placeholder; the API currently exposes a read-only User list used by the Borrowings workflow.

## Frontend Data Modes

Frontend service calls attempt the backend first. When a request fails because the API is unavailable, supported catalog, lending, and User operations use in-memory mock data so the interface remains browsable.

Mock data is a fallback presentation mode, not a second source of persisted library data. Changes made while using the fallback are not written to the SQL Server database.

## API Surface

All application endpoints use the `/api` prefix. Except for authentication and health endpoints, requests require a valid JWT.

| Area | Endpoints |
| --- | --- |
| Authentication | `POST /api/auth/register`, `POST /api/auth/login` |
| Health | `GET /api/health` |
| Books | `GET/POST /api/books`, `GET/PUT/DELETE /api/books/{id}`, `DELETE /api/books`, `GET /api/books/categories/{categoryId}` |
| Authors | `GET/POST /api/authors`, `GET/PUT/DELETE /api/authors/{id}` |
| Categories | `GET/POST /api/categories`, `GET/PUT/DELETE /api/categories/{id}` |
| Users | `GET /api/users` |
| Borrowings | `GET /api/borrow`, `POST /api/borrow/{bookId}?userId={userId}`, `POST /api/borrow/{borrowId}/return` |

Successful API responses use this envelope:

```json
{
  "success": true,
  "data": {},
  "message": "..."
}
```

Error responses use `status`, `message`, and `timestamp` fields.

## Runtime and Persistence

- Backend: Java 21, Spring Boot 4.0.6, and SQL Server through JPA/Hibernate.
- Frontend: Vue 3, Vite, Nuxt UI, Tailwind CSS, AG Grid, and ECharts.
- Backend URL: `http://localhost:5050`.
- Frontend URL: `http://localhost:5173`.
- Database schema: Hibernate `ddl-auto=update`; the project has no migration history.

See the root [`README.md`](../README.md) for local setup commands and [`DESIGN.md`](../DESIGN.md) for the visual system.
