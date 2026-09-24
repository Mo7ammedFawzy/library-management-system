# 📚 Athenaeum — Library Management System

A full-stack library management system built with **Spring Boot** and **Vue 3**.

Athenaeum provides a library workstation for managing a book catalog, registering users, and borrowing and returning books. The repository contains two independently runnable applications: a Spring Boot API and a Vue frontend.

## ✨ Features

- **Authentication & Security**
  - Register and log in with JWT-based authentication
  - Password hashing with BCrypt
  - Account roles (`ADMIN`, `USER`) stored on user records
  - Protected API routes except `/api/auth/**` and `/api/health`; role-based authorization is not currently enforced

- **Catalog Management**
  - Full CRUD for **Books** with search, category filtering, and availability tracking
  - CRUD for **Authors** and **Categories**
  - Books support multiple authors (many-to-many) and one category (many-to-one)

- **Borrowing System**
  - Borrow and return books with due-date handling
  - Prevents borrowing unavailable books
  - Per-user borrowing history (`BorrowRecord`)

- **Frontend**
  - Workstation app shell with a collapsible navy sidebar and responsive dashboard
  - Data grids built on **AG Grid** with search, filters, and built-in pagination
  - Dashboard reporting with ECharts activity and category visualizations
  - Dedicated pages for Dashboard, Books, Borrowings, Authors, Categories, Members, Settings, Profile, and Change Password
  - Members, profile, settings, and change-password flows include placeholder or frontend-only behavior where backend support is not yet implemented
  - **Offline fallback** — when the backend is unreachable, supported app services use in-memory mock data so the UI stays browsable

## 🖼️ Screenshots

### Login
![Login page](frontend/public/screenshots/login.png)

### Books management
![Books page](frontend/public/screenshots/books.png)

### Dashboard
![Dashboard page](frontend/public/screenshots/dashboard.png)

## 🚀 Demo

Check out the live demo: [library-mngment-system.vercel.app](https://library-mngment-system.vercel.app)

## 🧱 Tech Stack

### Backend — `backend/`

| Layer | Technology |
| --- | --- |
| Language | Java 21 |
| Framework | Spring Boot 4.0.6 |
| Web | Spring WebMVC |
| Data | Spring Data JPA / Hibernate |
| Security | Spring Security + JWT (jjwt) |
| Validation | Jakarta Bean Validation |
| Database | SQL Server (`localhost:1433/library`) |
| Build | Maven, Lombok |

### Frontend — `frontend/`

| Layer | Technology |
| --- | --- |
| Framework | Vue 3 (Composition API) + Vite 7 |
| UI | Nuxt UI v4 + Tailwind CSS 4 |
| Data grid | AG Grid (community) |
| Router | vue-router (file-based) |
| Package manager | pnpm |

For a feature-by-feature description of the implemented system, see [`docs/system-overview.md`](docs/system-overview.md). Domain vocabulary is defined in [`CONTEXT.md`](CONTEXT.md), and the interface system is documented in [`DESIGN.md`](DESIGN.md).

## 📁 Project Structure

```
.
├── docs/                       # System and agent documentation
├── backend/                    # Spring Boot API
│   └── src/main/java/org/library/
│       ├── config/
│       ├── controller/         # Auth, Book, Author, Category, Borrow
│       ├── dto/                # Request / response records
│       ├── entity/             # User, Book, Author, Category, BorrowRecord
│       ├── enums/              # Role
│       ├── exception/          # GlobalExceptionHandler + custom exceptions
│       ├── mapper/
│       ├── payload/            # ApiResponse / ApiError envelope
│       ├── repository/
│       ├── security/           # JwtAuthFilter, JwtUtil, SecurityConfig
│       ├── service/            # Interfaces + impl
│       └── utils/
└── frontend/                   # Vue 3 SPA
    └── src/
        ├── components/         # Shared shell, breadcrumbs, grids, charts, auth UI
        ├── pages/              # File-based application routes
        ├── services/           # api.ts client + per-domain services
        └── lib/                # AG Grid setup
```

## 🚀 Getting Started

### Prerequisites

- **Java 21**
- **Maven** (or use the included `mvnw` wrapper)
- **SQL Server** running on `localhost:1433` (database `library` is created/updated automatically via `ddl-auto=update`)
- **Node.js** and **pnpm**

### 1. Backend

Configure the database credentials in `backend/src/main/resources/application.properties`, then run from `backend/`:

```bash
.\mvnw spring-boot:run
```

The API starts at `http://localhost:5050`.

### 2. Frontend

Run from `frontend/`:

```bash
pnpm install
pnpm dev
```

The app is served at `http://localhost:5173` and proxies `/api` requests to the backend on port `5050`.

> **Note:** All application API routes except `/api/auth/**` and `/api/health` require a valid JWT. Register an account or log in with an existing account to access the dashboard.

## 🔌 API Overview

All responses use a standard envelope: `{ "success": bool, "data": ..., "message": ... }`.

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login, returns a JWT token |
| GET | `/api/books` | List all books |
| GET | `/api/books/{id}` | Get a book by ID |
| GET | `/api/books/categories/{categoryId}` | Books in a category |
| POST | `/api/books` | Create a book |
| PUT | `/api/books/{id}` | Update a book |
| DELETE | `/api/books/{id}` | Delete a book |
| GET | `/api/authors` | List authors |
| POST | `/api/authors` | Create an author |
| PUT / DELETE | `/api/authors/{id}` | Update / delete an author |
| GET | `/api/categories` | List categories |
| POST | `/api/categories` | Create a category |
| PUT / DELETE | `/api/categories/{id}` | Update / delete a category |
| GET | `/api/users` | List users |
| POST | `/api/borrow/{bookId}?userId={userId}` | Borrow a book; omit `userId` to borrow as the current user |
| GET | `/api/borrow` | List borrow records |
| POST | `/api/borrow/{borrowId}/return` | Return a borrowed book |
| GET | `/api/health` | Check API availability |

## 📄 License

This project is for educational purposes. See `backend/README.md` and `backend/Tasks.md` for the original learning roadmap.
