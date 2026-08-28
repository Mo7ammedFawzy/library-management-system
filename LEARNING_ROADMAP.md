# LEARNING_ROADMAP.md

The phase-by-phase curriculum for the Java, Spring Boot, backend engineering,
and production learning journey. The Library Management System is the practice
environment.

`LEARNING_PROGRESS.md` tracks what has actually been completed, what is weak,
and what comes next. Read both before any learning session.

Progress is incremental. Do not require mastery of every topic before moving
forward — topics are revisited through practical work.

---

## Phase 1 — Java

The foundation. Everything else builds on this.

### Topics

- Java fundamentals (types, control flow, methods, packages)
- OOP (classes, objects, inheritance, interfaces, polymorphism, encapsulation)
- `equals()` / `hashCode()`
- Collections (List, Set, Map, iteration)
- Generics
- Comparable / Comparator
- Lambdas
- Functional interfaces
- Streams
- Optional
- Exceptions
- Date/Time API (java.time)
- Records
- Sealed classes
- Pattern matching
- Concurrency basics
- Executors
- CompletableFuture
- Virtual threads
- JVM basics (bytecode, class loading)
- Memory and garbage collection

### Project mapping

The backend already demonstrates most of these:

| Java concept | Where it lives in the project |
|---|---|
| Records | `dto/BookResponse.java`, `dto/BookRequest.java`, all `dto/*` |
| Optional | `repository/UserRepository.java` (`Optional<User> findByEmail`), `BookRepository` |
| Streams / lambdas | filtering and transforming lists of books, authors, borrowings |
| Collections | `List<Author> authors`, `List<Book> books`, category lists |
| Mappers | static `toResponse()` / `toEntity()` methods in `mapper/*` |
| Exceptions | `exception/ResourceNotFoundException` and friends |
| Date/Time | `BorrowRecord.borrowDate/dueDate/returnDate` (LocalDate) |
| Enums | `enums/Role.java` |
| Interfaces + polymorphism | `service/BookService` + `service/impl/BookServiceImpl` |

### Exercises to try

- Rewrite a loop as a stream chain (e.g. filtering books by category).
- Replace a `.get()` on an Optional with `.orElseThrow(...)`.
- Sort books by title using a `Comparator`.
- Predict what `Stream<T>` mapping/collecting does before running it.

### Completion criteria

Comfortable reading and writing small programs using the above constructs;
can explain what a stream pipeline does without running it.

---

## Phase 2 — SQL and Databases

### Topics

- SELECT
- INSERT / UPDATE / DELETE
- JOINs
- GROUP BY
- HAVING
- Subqueries
- Indexes
- Primary keys
- Foreign keys
- Constraints
- Normalization
- Transactions
- Database design
- Query optimization basics

### Project mapping

- The database is SQL Server (`localhost:1433`, database `library`); schema is
  maintained by Hibernate `ddl-auto=update`.
- Tables: `books`, `authors`, `categories`, `users`, `borrow_records`,
  `book_authors` (join table).
- Read-only investigation: inspect the actual generated schema and run JOINs
  against the seeded data (e.g. books + category + authors, borrowings + user + book).
- Watch `show-sql` output in logs as you run queries.

### Exercises to try

- Write a query for "all books currently borrowed that are overdue".
- Write a query returning each book with its author names as a comma list.
- Compare the same query written with and without an index on `category_id`.

### Completion criteria

Can write the common SELECT/JOIN/GROUP BY queries from memory and explain
what a primary/foreign key does.

---

## Phase 3 — Spring Core and Spring Boot

### Topics

- IoC
- Dependency Injection
- Beans
- ApplicationContext
- Component scanning
- Bean lifecycle
- Configuration
- Profiles
- Auto-configuration
- Spring Boot

### Project mapping

- `config/ApplicationConfig.java` — bean definitions (`BCryptPasswordEncoder`,
  `UserDetailsService`, `AuthenticationManager`).
- `@Service` impls in `service/impl/*`.
- `@Repository` in `repository/*`.
- `@RestController`/`@ControllerAdvice`.
- Constructor injection everywhere — compare with field injection and explain
  why the project chose constructor injection.
- `application.properties` — configuration; `src/main/java/org/library/LibraryApplication.java`
  is the entry point (`@SpringBootApplication`).

### Exercises to try

- Add a new bean and inject it somewhere.
- Trace how `@SpringBootApplication` brings auto-configuration in.
- Explain the lifetime of a singleton service bean.

### Completion criteria

Can explain what a bean is, how DI works, and why the project uses interfaces
+ constructor injection.

---

## Phase 4 — Backend API Development

### Topics

- HTTP
- REST conventions
- Controllers
- DTOs
- Request / response models
- Validation
- Exception handling
- Global exception handling
- HTTP status codes
- API design

### Project mapping

- `controller/BookController.java` — a complete CRUD controller to study.
- `dto/*` — request/response records, why DTOs are separated from entities.
- `exception/GlobalExceptionHandler.java` — `@RestControllerAdvice`.
- `payload/ApiResponse.java` and `payload/ApiError.java` — the response envelope.
- Compare `AuthorController`/`CategoryController` (inject repositories directly)
  with `BookController` (injects a service). This is a known inconsistency in
  the project — a future refactor topic.

### Exercises to try

- Decide the correct HTTP status codes for each CRUD outcome.
- Add a field to a request DTO with validation, then test a bad request.
- Walk the flow of a single `POST /api/books` request end to end.

### Completion criteria

Can design a simple CRUD API, know which status codes apply, and explain why
DTOs exist.

---

## Phase 5 — JPA and Hibernate

### Topics

- Entities
- Entity relationships
- Persistence context
- Entity lifecycle
- Lazy loading
- Eager loading
- Cascade
- Orphan removal
- Dirty checking
- Hibernate proxies
- N+1 queries
- Fetch joins
- Entity graphs
- Spring Data JPA
- Pagination
- Sorting
- Specifications
- Projections

### Project mapping

- Entities: `Book`, `Author`, `Category`, `User`, `BorrowRecord`.
- Relationships: `@ManyToOne` (Book→Category), `@OneToMany` (Category→Books),
  `@ManyToMany` (Book↔Author via `book_authors`), `@OneToMany` (User→BorrowRecords).
- `repository/*` — Spring Data JPA; custom derived queries like
  `findByCategoryId`, `findByEmail`.
- **Pagination/sorting is backend TODO** — BookController returns full lists.
  Implementing Spring Data pagination is a high-value `/next` feature.

### Exercises to try

- Explain the difference between a `@ManyToOne` owning side and a `@OneToMany`
  `mappedBy` side.
- Watch for N+1 when loading books with their authors; fix with a fetch join.
- Add a derived query method to `BookRepository` and test it.

### Completion criteria

Can model a relationship correctly, explain lazy vs eager, and reason about
when N+1 queries happen.

---

## Phase 6 — Transactions and Business Logic

### Topics

- Transactions
- ACID
- Isolation
- Propagation
- Rollback
- Read-only transactions
- Business rules
- Service-layer design

### Project mapping

- `service/impl/BorrowServiceImpl.java` — the borrow/return flow,
  `@Transactional`, availability checks, copy decrement/increment.
- Business rules: cannot borrow an unavailable book; cannot return a book
  twice; due date = borrow date + 14 days.
- Study where a missing transaction would corrupt data (decrement copies but
  fail to create the borrow record).

### Exercises to try

- Walk through borrow: what happens at each step if the DB fails midway?
- Change the borrow flow and observe the rollback behavior.
- Explain why the whole borrow operation should be one transaction.

### Completion criteria

Can explain ACID in terms of the borrow/return feature and state when a
method must be `@Transactional`.

---

## Phase 7 — Security

### Topics

- Authentication
- Authorization
- Spring Security
- SecurityFilterChain
- Password hashing
- BCrypt
- JWT
- Access tokens
- Refresh tokens
- Roles
- Permissions
- Method security
- CORS
- CSRF
- Stateless authentication
- Session vs JWT

### Project mapping

- `config/SecurityConfig.java` — the `SecurityFilterChain`, stateless sessions,
  CSRF disabled, public vs protected routes.
- `security/JwtAuthenticationFilter` — extracts/validates the Bearer token.
- `security/JwtUtil.java` — token generation/validation.
- `config/ApplicationConfig.java` — `BCryptPasswordEncoder`,
  `UserDetailsService` (email lookup), `AuthenticationManager`.
- `User` implements `UserDetails`.
- **Role-based authorization is NOT implemented.** Admin-only mutating
  endpoints all work for any authenticated user. Implementing
  `@EnableMethodSecurity` + `@PreAuthorize` is the obvious `/next` security
  feature.

### Exercises to try

- Trace a request from `Authorization: Bearer ...` to `SecurityContextHolder`.
- Explain why sessions/CSRF are off and what that means for the API.
- Implement `@PreAuthorize("hasRole('ADMIN')")` on a delete endpoint.

### Completion criteria

Can explain the full stateless JWT flow from login to protected request, and
describe what role-based access would add.

---

## Phase 8 — Testing

### Topics

- JUnit 5
- Mockito
- AssertJ
- Unit tests
- Integration tests
- Repository tests
- Controller tests
- MockMvc
- Security tests
- Testcontainers

### Project mapping

- Only `LibraryApplicationTests` exists today (a context-load test).
- Target the core logic first: `BorrowServiceImpl` (unavailable book,
  double return), `BookServiceImpl` CRUD, `JwtUtil`.
- `FakeUserContext` already exists as a test double for `UserContext` — study
  why it was built.

### Exercises to try

- Write a unit test for the borrow-unavailable case with Mockito.
- Write a MockMvc test hitting `GET /api/books` with and without a token.
- Use `@DataJpaTest` for a repository test.

### Completion criteria

Can write a focused unit test and a simple MockMvc integration test and run
them with `.\mvnw test`.

---

## Phase 9 — Production Engineering

### Topics

- Logging
- SLF4J
- Log levels
- OpenAPI / Swagger
- Flyway
- Redis
- Spring Cache
- Async processing
- Application events
- Messaging
- RabbitMQ
- Docker
- Docker Compose
- CI/CD
- GitHub Actions
- Actuator
- Metrics
- Monitoring
- Observability
- Performance optimization

### Project mapping

- **None of these are implemented yet.** This project currently uses
  `ddl-auto=update` with no migrations, no Swagger, no Actuator, no tests,
  no Docker, no CI.
- High-value first projects: log key actions in services (SLF4J), add
  springdoc-openapi for interactive API docs, add Actuator health/metrics.
- `backend/Tasks.md` Phase 9 describes notifications (application events),
  soft delete / recycle bin, and an audit log — good event-driven learning.

### Exercises to try

- Add SLF4J logging to `BookServiceImpl`, then configure log levels.
- Add springdoc and inspect the Swagger UI.
- Write a `Dockerfile` so the backend runs without a local JDK.

### Completion criteria

Has added at least two production-engineering tools to the project and can
explain what each one solves.

---

## Phase 10 — Software Architecture

### Topics

- SOLID
- Design Patterns
- Layered Architecture
- Clean Architecture
- Hexagonal Architecture
- DDD basics
- Domain modeling
- System Design
- Distributed systems
- Microservices

### Project mapping

- The project is a layered architecture: controller → service (interface +
  impl) → repository.
- `CONTEXT.md` is the domain glossary — the seed for DDD thinking.
- `UserContext` interface with prod/test implementations is a real seam — a
  good example of depending on an abstraction.
- **SRP was studied** (see `LEARNING_PROGRESS.md`) and needs revision; OCP,
  DI, and the other SOLID letters map naturally to this codebase.

### Exercises to try

- For a given change (e.g. new notification channel), identify which classes
  obey SRP/OCP and which violate them.
- Sketch how the borrowing flow would look in a hexagonal layout.

### Completion criteria

Can explain the layered architecture of this project, map each SOLID
principle onto a real class, and argue a small design tradeoff.

---

## How to Use This Roadmap

1. Before a session, the mentor reads this file + `LEARNING_PROGRESS.md`.
2. Pick the next topic from the lowest incomplete phase with the most
   project relevance.
3. Follow the 10-step session flow in `.opencode/commands/learn.md`.
4. After the session, update `LEARNING_PROGRESS.md` (Step 10).

Topics may be picked out of sequential order when a project feature makes an
earlier topic urgent — but the plan is to move through phases in order.