# Graph Report - library-management-system  (2026-09-18)

## Corpus Check
- 160 files · ~54,642 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1344 nodes · 1919 edges · 137 communities (100 shown, 25 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d344e20d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Category
- User
- devDependencies
- borrowings.vue
- BookResponse
- books.vue
- ApiError
- mock.ts
- useCrudPage
- BorrowResponse
- App.vue
- TestDataConfig
- JwtAuthFilter
- Book
- categories.vue
- authors.vue
- register.vue
- compilerOptions
- login.vue
- compilerOptions
- JwtUtil
- .createBook
- MemberCell.vue
- Customizing components
- getStatus
- data/books.ts
- borrowings.ts
- dashboard.vue
- api.ts
- AppDataGrid.vue
- UserRepository
- mvnw
- BookController
- Borrowing
- route-map.d.ts
- lombok.RequiredArgsConstructor
- renovate.json
- BorrowNotFoundException
- dependencies
- Conventions
- LibraryApplicationTests.java
- main.ts
- Common field patterns
- AGENTS.md
- LibraryApplication
- Components
- tsconfig.json
- .login
- AuthResponse.java
- org.library:library
- 📚 Athenaeum — Library Management System
- Dashboard Layout
- Author
- Core Domain Concepts
- Special rules
- Component Selection
- Chat Layout
- nuxt-ui/SKILL.md
- backend/README.md
- caveman/SKILL.md
- Topics You Will Learn
- Packages reference
- ag-update/SKILL.md
- Landing Page Layout
- ApiResponse
- PHASE 6 — Authentication & Security
- Athenaeum Modern Design System
- Docs Layout
- Editor Layout
- Nuxt UI
- UserResponse
- auth.ts
- Data Tables
- Phase 9 - Notifications, Recycle Bin & Audit Log
- TASKS.md — Library Management System
- AG Charts — writing & debugging correct code
- AG Grid — writing & debugging correct code
- Auth Forms
- PHASE 2 — Books CRUD
- @fontsource-variable/geist
- Issue tracker: GitHub
- Vue Starter Template
- AG Studio — writing & debugging correct code
- ag-dev/SKILL.md
- Overlays
- API Examples
- Main Features
- Database Design
- PHASE 3 — Categories & Relationships
- Domain Docs
- PHASE 4 — Authors & ManyToMany
- PHASE 7 — Borrowing System
- Topics To Learn
- Technologies
- Phase 1 - Setup & Basics
- Phase 2 - Books CRUD
- Phase 3 - Categories & Relationships
- Phase 4 - Authors & ManyToMany
- Phase 5 - Validation & Exception Handling
- Phase 6 - Authentication & Security
- Phase 7 - Borrowing System
- PHASE 5 — Validation & Exception Handling
- scripts
- AG dependency migration plan
- determine-scope.md
- graphify.js
- charts/documentation-index.md
- grid/documentation-index.md
- studio/documentation-index.md
- triage-labels.md
- tailwindcss
- package.json
- CategoryDonutChart.vue
- ActivityChart.vue
- ag-grid-vue3
- echarts
- vue-router
- 01-backend-test-harness-ci.md
- 02-role-based-authorization.md
- 03-auth-validation-change-password.md
- 04-members-management-grid.md
- 05-catalog-search-pagination.md
- 06-borrowing-scoping-history.md
- 07-real-profile-settings.md
- 08-secrets-config-honest-fallback.md

## God Nodes (most connected - your core abstractions)
1. `ApiResponse` - 34 edges
2. `User` - 30 edges
3. `BookResponse` - 20 edges
4. `TestDataConfig` - 18 edges
5. `Book` - 18 edges
6. `compilerOptions` - 18 edges
7. `BorrowResponse` - 17 edges
8. `Components` - 17 edges
9. `compilerOptions` - 15 edges
10. `Category` - 14 edges

## Surprising Connections (you probably didn't know these)
- `BookResponse` --references--> `CategoryResponse`  [EXTRACTED]
  backend/src/main/java/org/library/dto/BookResponse.java → backend/src/main/java/org/library/dto/CategoryResponse.java
- `Book` --references--> `Category`  [EXTRACTED]
  backend/src/main/java/org/library/entity/Book.java → backend/src/main/java/org/library/entity/Category.java
- `TestDataConfig` --references--> `CategoryRepository`  [EXTRACTED]
  backend/src/main/java/org/library/config/TestDataConfig.java → backend/src/main/java/org/library/repository/CategoryRepository.java
- `BookServiceImpl` --references--> `CategoryRepository`  [EXTRACTED]
  backend/src/main/java/org/library/service/impl/BookServiceImpl.java → backend/src/main/java/org/library/repository/CategoryRepository.java
- `BorrowRecord` --references--> `User`  [EXTRACTED]
  backend/src/main/java/org/library/entity/BorrowRecord.java → backend/src/main/java/org/library/entity/User.java

## Import Cycles
- None detected.

## Communities (137 total, 25 thin omitted)

### Community 0 - "Category"
Cohesion: 0.11
Nodes (18): CategoryController, GetMapping, PostMapping, PutMapping, RequestMapping, ResponseEntity, RestController, CategoryRequest (+10 more)

### Community 1 - "User"
Cohesion: 0.12
Nodes (15): AllArgsConstructor, Builder, Data, Entity, NoArgsConstructor, Override, Table, User (+7 more)

### Community 2 - "devDependencies"
Cohesion: 0.13
Nodes (15): eslint, eslint-plugin-vue, devDependencies, eslint, eslint-plugin-vue, typescript, typescript-eslint, vite (+7 more)

### Community 3 - "borrowings.vue"
Cohesion: 0.05
Nodes (33): addOpen, bookOptions, books, borrowForm, borrowState, columns, currentlyBorrowed, dateRange (+25 more)

### Community 4 - "BookResponse"
Cohesion: 0.19
Nodes (8): BookResponse, ResourceNotFoundException, BookMapper, Author, Book, Category, BookServiceImpl, Override

### Community 5 - "books.vue"
Cohesion: 0.09
Nodes (16): authorOptions, authors, BookFormState, breadcrumbItems, categories, categoryFilters, categoryOptions, columns (+8 more)

### Community 6 - "ApiError"
Cohesion: 0.14
Nodes (12): BookAlreadyReturnedException, BookUnavailableException, GlobalExceptionHandler, ResponseEntity, ApiError, ResponseEntity, ExceptionHandler, HttpStatus (+4 more)

### Community 7 - "mock.ts"
Cohesion: 0.09
Nodes (13): BorrowingUser, authors, books, borrowBook(), borrowings, categories, createAuthor(), createBook() (+5 more)

### Community 8 - "useCrudPage"
Cohesion: 0.22
Nodes (6): CrudPageConfig, useCrudPage(), confirmDelete(), load(), submitForm(), loadAll()

### Community 9 - "BorrowResponse"
Cohesion: 0.10
Nodes (18): BorrowController, RequestMapping, RestController, BorrowResponse, BorrowRecord, AllArgsConstructor, Builder, Data (+10 more)

### Community 10 - "App.vue"
Cohesion: 0.17
Nodes (9): headerMenuItems, isAuthPage, navItem(), navSections, notivueCompactTheme, route, router, sidebarOpen (+1 more)

### Community 11 - "TestDataConfig"
Cohesion: 0.23
Nodes (6): Author, Book, Category, TestDataConfig, UserData, org.springframework.boot.ApplicationRunner

### Community 12 - "JwtAuthFilter"
Cohesion: 0.25
Nodes (7): UserDetailsService, JwtAuthFilter, Override, SecurityContextUserContext, org.springframework.stereotype.Component, org.springframework.web.filter.OncePerRequestFilter, UserDetails

### Community 13 - "Book"
Cohesion: 0.15
Nodes (9): Book, AllArgsConstructor, Builder, Entity, NoArgsConstructor, Table, BookRepository, Getter (+1 more)

### Community 14 - "categories.vue"
Cohesion: 0.15
Nodes (11): ActionsCellParams, props, breadcrumbItems, columns, fieldUi, name, {
  rows,
  gridApi,
  search,
  loadError,
  formOpen,
  editingItem,
  saving,
  formError,
  entityForm,
  deleteTarget,
  deleting,
  deleteError,
  deleteModalOpen,
  openAdd,
  openEdit,
  setFormState,
  submitForm,
  openDelete,
  confirmDelete
}, CategoryInput (+3 more)

### Community 15 - "authors.vue"
Cohesion: 0.15
Nodes (13): breadcrumbItems, columns, fieldUi, name, {
  rows,
  gridApi,
  search,
  loadError,
  formOpen,
  editingItem,
  saving,
  formError,
  entityForm,
  deleteTarget,
  deleting,
  deleteError,
  deleteModalOpen,
  openAdd,
  openEdit,
  setFormState,
  submitForm,
  openDelete,
  confirmDelete
}, loadOptions(), Author, AuthorInput (+5 more)

### Community 16 - "register.vue"
Cohesion: 0.13
Nodes (15): agreeTerms, confirmPassword, email, error, fullName, handleSubmit(), hasMinLength, hasNumber (+7 more)

### Community 17 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+25 more)

### Community 18 - "login.vue"
Cohesion: 0.16
Nodes (12): email, error, fillTestCredentials(), handleSubmit(), handleTestLogin(), isLoading, password, rememberMe (+4 more)

### Community 19 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+12 more)

### Community 20 - "JwtUtil"
Cohesion: 0.21
Nodes (8): Override, JwtUtil, Claims, FilterChain, HttpServletRequest, HttpServletResponse, javax.crypto.SecretKey, org.springframework.security.core.userdetails.UserDetails

### Community 21 - ".createBook"
Cohesion: 0.32
Nodes (3): PostMapping, PutMapping, BookRequest

### Community 22 - "MemberCell.vue"
Cohesion: 0.33
Nodes (5): avatarClass, avatarPalette, borrowing, initials, props

### Community 23 - "Customizing components"
Cohesion: 0.07
Nodes (29): Adding custom brand colors, Backgrounds, Black/white as primary, Borders, Breakpoints, Choosing colors for components, `class` prop, Color shade overrides (+21 more)

### Community 24 - "getStatus"
Cohesion: 0.16
Nodes (14): borrowing, props, status, subtext, props, status, detailStatus, rangeLabel (+6 more)

### Community 25 - "data/books.ts"
Cohesion: 0.18
Nodes (11): authors, Book, bookCategories, books, buildRows(), categories, initialRows, mulberry32() (+3 more)

### Community 26 - "borrowings.ts"
Cohesion: 0.22
Nodes (12): badgeColor, loadAll(), submitBorrow(), submitReturn(), fetchBooks, borrowBook, BORROWING_STATUSES, BorrowingStatus (+4 more)

### Community 27 - "dashboard.vue"
Cohesion: 0.09
Nodes (21): activeBorrowings, activityChart, ActivityItem, ActivityKind, activityKindStyle, authorCount, availabilityRate, availableCopies (+13 more)

### Community 28 - "api.ts"
Cohesion: 0.23
Nodes (9): ApiEnvelope, ApiError, checkBackendHealth(), ErrorBody, getToken(), isBackendUnavailable(), NetworkError, request() (+1 more)

### Community 29 - "AppDataGrid.vue"
Cohesion: 0.29
Nodes (6): defaultColDef, emit, gridApi, lightTheme, onGridReady(), props

### Community 30 - "UserRepository"
Cohesion: 0.24
Nodes (7): UserRepository, AuthServiceImpl, AuthenticationManager, AuthResponse, Override, org.springframework.data.jpa.repository.JpaRepository, org.springframework.stereotype.Service

### Community 31 - "mvnw"
Cohesion: 0.38
Nodes (8): mvnw script, clean(), die(), exec_maven(), hash_string(), set_java_home(), trim(), verbose()

### Community 32 - "BookController"
Cohesion: 0.17
Nodes (6): BookController, DeleteMapping, GetMapping, RequestMapping, RestController, BookService

### Community 33 - "Borrowing"
Cohesion: 0.18
Nodes (10): authors, borrowing, props, BorrowingActionsParams, items, props, Book, Borrowing (+2 more)

### Community 34 - "route-map.d.ts"
Cohesion: 0.29
Nodes (6): _RouteFileInfoMap, RouteNamedMap, _RouteNamesForFilePath, TypesConfig, vue-router, vue-router/auto-routes

### Community 35 - "lombok.RequiredArgsConstructor"
Cohesion: 0.20
Nodes (12): ApplicationConfig, AuthenticationManager, UserDetailsService, SecurityConfig, lombok.RequiredArgsConstructor, org.springframework.context.annotation.Bean, org.springframework.context.annotation.Configuration, org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration (+4 more)

### Community 36 - "renovate.json"
Cohesion: 0.25
Nodes (7): extends, lockFileMaintenance, enabled, packageRules, postUpdateOptions, github>nuxt/renovate-config-nuxt, pnpmDedupe

### Community 38 - "dependencies"
Cohesion: 0.13
Nodes (15): ag-grid-community, @fontsource-variable/inter, dependencies, ag-grid-community, @fontsource-variable/inter, notivue, @nuxt/ui, @unhead/vue (+7 more)

### Community 39 - "Conventions"
Cohesion: 0.09
Nodes (22): Auto-registered modules, Color mode, Composables, Content module integration, Conventions, Custom locale from scratch, Default icon overrides, defineShortcuts (+14 more)

### Community 40 - "LibraryApplicationTests.java"
Cohesion: 0.60
Nodes (3): LibraryApplicationTests, org.junit.jupiter.api.Test, org.springframework.boot.test.context.SpringBootTest

### Community 41 - "main.ts"
Cohesion: 0.40
Nodes (4): app, authPages, head, router

### Community 42 - "Common field patterns"
Cohesion: 0.11
Nodes (18): Basic pattern, Checkbox, Common field patterns, Date, Field layout patterns, File upload, Form in a modal, Forms (+10 more)

### Community 43 - "AGENTS.md"
Cohesion: 0.12
Nodes (15): Agent skills, Backend, Design References, Documentation, Domain docs, Frontend, graphify, Issue tracker (+7 more)

### Community 45 - "Components"
Cohesion: 0.12
Nodes (17): Blog & Changelog, Chat (AI), Color Mode, Components, Content (Nuxt Content), Dashboard, Data, Editor (+9 more)

### Community 48 - ".login"
Cohesion: 0.18
Nodes (9): AuthController, AuthResponse, PostMapping, RequestMapping, RestController, LoginRequest, RegisterRequest, AuthService (+1 more)

### Community 59 - "📚 Athenaeum — Library Management System"
Cohesion: 0.11
Nodes (17): 1. Backend, 2. Frontend, 🔌 API Overview, 📚 Athenaeum — Library Management System, Backend — `backend/`, Books management, Dashboard, 🚀 Demo (+9 more)

### Community 60 - "Dashboard Layout"
Cohesion: 0.12
Nodes (16): Common mistakes, Component tree, Dashboard Layout, DashboardGroup, DashboardNavbar / DashboardToolbar, DashboardPanel, DashboardSidebar, Key components (+8 more)

### Community 61 - "Author"
Cohesion: 0.12
Nodes (16): AuthorController, PostMapping, PutMapping, RequestMapping, RestController, AuthorRequest, AuthorResponse, Author (+8 more)

### Community 62 - "Core Domain Concepts"
Cohesion: 0.12
Nodes (15): Auth Subsystem, Author, Book, Borrowing (frontend concept), Borrowing Subsystem, BorrowRecord, Catalog Subsystem, Category (+7 more)

### Community 63 - "Special rules"
Cohesion: 0.13
Nodes (14): Change type, Check preamble, Documentation URLs, Example, Extracting changes from the documentation website, Input, Module registration, Output (+6 more)

### Community 64 - "Component Selection"
Cohesion: 0.14
Nodes (13): Component Selection, Feedback, Inputs, Layout containers, Markdown, Navigation, Overlays, Rules (+5 more)

### Community 65 - "Chat Layout"
Cohesion: 0.14
Nodes (13): Chat in a modal, Chat Layout, Component tree, Conversation sidebar, Dark mode for syntax highlighting, Full page chat, Install dependencies, Key components (+5 more)

### Community 66 - "nuxt-ui/SKILL.md"
Cohesion: 0.21
Nodes (5): Breadcrumbs, Header with mobile menu, Navigation, Sidebar navigation (dashboard), Tab navigation (within a page)

### Community 67 - "backend/README.md"
Cohesion: 0.15
Nodes (12): Do NOT Rush, Final Goal, Important Notes, Library Management System - Spring Boot Learning Project, Overview, Phase 8 - Advanced Features, PLAN MODE, Project Idea (+4 more)

### Community 68 - "caveman/SKILL.md"
Cohesion: 0.17
Nodes (10): caveman, Example output, How to invoke, See also, What it does, Auto-Clarity, Boundaries, Intensity (+2 more)

### Community 69 - "Topics You Will Learn"
Cohesion: 0.17
Nodes (12): Exception Handling, Many To Many, Many To One, One To Many, One To Many, Relationships, Security, Spring Core (+4 more)

### Community 70 - "Packages reference"
Cohesion: 0.18
Nodes (10): Charts, Current charts packages, Current grid packages, Current studio packages, Grid, Legacy / removed packages and required migrations, Packages reference, Studio (+2 more)

### Community 71 - "ag-update/SKILL.md"
Cohesion: 0.20
Nodes (9): Check for existing plan, Determine scope, Determine the full set of changes, Explain process to user, Report completion to the user, Rules, Trim behaviour changes, Version check (+1 more)

### Community 72 - "Landing Page Layout"
Cohesion: 0.20
Nodes (10): Alternating feature sections, App shell, Blog listing, Changelog, Common mistakes, Key components, Landing page, Landing Page Layout (+2 more)

### Community 73 - "ApiResponse"
Cohesion: 0.16
Nodes (13): DeleteMapping, GetMapping, GetMapping, PostMapping, DeleteMapping, HealthController, UserController, ApiResponse (+5 more)

### Community 74 - "PHASE 6 — Authentication & Security"
Cohesion: 0.20
Nodes (10): Auth Service & Controller, Dependencies, DTOs for Auth, JWT Utility, PHASE 6 — Authentication & Security, Role-Based Access, Security Config, Security Filter (+2 more)

### Community 75 - "Athenaeum Modern Design System"
Cohesion: 0.12
Nodes (15): Athenaeum Modern Design System, Badges, Brand & Style, Buttons, Cards, Colors, Components, Data Tables (+7 more)

### Community 76 - "Docs Layout"
Cohesion: 0.22
Nodes (9): App shell, Common mistakes, Component tree, Docs Layout, How nesting works, Key components, Layout, Page (+1 more)

### Community 77 - "Editor Layout"
Cohesion: 0.22
Nodes (8): Basic editor, Component tree, Content types, Editor Layout, Key components, Toolbar modes, When to use, With document sidebar

### Community 78 - "Nuxt UI"
Cohesion: 0.22
Nodes (9): Core rules (always apply), How to use this skill, Installation, MCP Server, Nuxt, Nuxt UI, Reference files, Routing table (+1 more)

### Community 79 - "UserResponse"
Cohesion: 0.27
Nodes (5): UserResponse, UserMapper, Override, UserServiceImpl, UserService

### Community 80 - "auth.ts"
Cohesion: 0.24
Nodes (10): handleLogout(), api, clearToken(), isAuthenticated(), MOCK_TOKEN, AuthResponse, isLoggedIn(), LoginInput (+2 more)

### Community 81 - "Data Tables"
Cohesion: 0.25
Nodes (7): Basic table, Data Tables, Tips, With async data (Nuxt), With pagination, With row selection, With search and filters (dashboard)

### Community 82 - "Phase 9 - Notifications, Recycle Bin & Audit Log"
Cohesion: 0.25
Nodes (7): Audit Log, CHECKLIST SUMMARY, Goals, Notifications, Phase 9 - Notifications, Recycle Bin & Audit Log, Recycle Bin (Soft Delete), Tasks

### Community 83 - "TASKS.md — Library Management System"
Cohesion: 0.25
Nodes (8): First Controller, MySQL Setup, Pagination & Sorting, PHASE 1 — Setup & Basics, PHASE 8 — Advanced Features (Optional), Project Setup, Search, TASKS.md — Library Management System

### Community 84 - "AG Charts — writing & debugging correct code"
Cohesion: 0.29
Nodes (6): AG Charts — writing & debugging correct code, Common mistakes, Major version transitions, Pay attention to console messages, Performance (high-volume / high-frequency), React

### Community 85 - "AG Grid — writing & debugging correct code"
Cohesion: 0.29
Nodes (6): AG Grid — writing & debugging correct code, Angular, Common mistakes, Enable development mode debugging and pay attention to console messages, Major version transitions, React

### Community 86 - "Auth Forms"
Cohesion: 0.29
Nodes (6): Auth Forms, Custom auth layout, Tips, UAuthForm key props, UAuthForm key slots, UAuthForm (recommended)

### Community 87 - "PHASE 2 — Books CRUD"
Cohesion: 0.29
Nodes (7): Book Controller, Book DTO, Book Entity, Book Repository, Book Service, PHASE 2 — Books CRUD, Testing in Postman

### Community 89 - "Issue tracker: GitHub"
Cohesion: 0.29
Nodes (6): Conventions, Issue tracker: GitHub, Pull requests as a triage surface, Wayfinding operations, When a skill says "fetch the relevant ticket", When a skill says "publish to the issue tracker"

### Community 90 - "Vue Starter Template"
Cohesion: 0.29
Nodes (6): Deploy your own, Development Server, Production, Quick Start, Setup, Vue Starter Template

### Community 91 - "AG Studio — writing & debugging correct code"
Cohesion: 0.33
Nodes (5): AG Studio — writing & debugging correct code, Angular, Common mistakes, Pay attention to console messages, React

### Community 92 - "ag-dev/SKILL.md"
Cohesion: 0.33
Nodes (5): Be aware of the AG products in use, and their versions and wrapper framework, By default consult the docs, Don't guess, For package version updates, use the ag-update skill, Load product-specific recommendations

### Community 93 - "Overlays"
Cohesion: 0.33
Nodes (6): Command palette, Confirmation dialog, Drawer (bottom sheet), Form in a slideover, Overlays, Programmatic confirmation (useOverlay)

### Community 94 - "API Examples"
Cohesion: 0.33
Nodes (6): API Examples, Authentication, Authors, Books, Borrowing, Categories

### Community 95 - "Main Features"
Cohesion: 0.33
Nodes (6): Authentication & Authorization, Authors, Books, Borrowing System, Categories, Main Features

### Community 96 - "Database Design"
Cohesion: 0.33
Nodes (6): Author, Book, BorrowRecord, Category, Database Design, User

### Community 97 - "PHASE 3 — Categories & Relationships"
Cohesion: 0.33
Nodes (6): Assign Category to Book, Category Entity, Category Repository, Service, Controller, Filter Books by Category, PHASE 3 — Categories & Relationships, Update Book Entity

### Community 98 - "Domain Docs"
Cohesion: 0.33
Nodes (5): Before exploring, read these, Domain Docs, File structure, Flag ADR conflicts, Use the glossary's vocabulary

### Community 99 - "PHASE 4 — Authors & ManyToMany"
Cohesion: 0.40
Nodes (5): Assign Authors to Books, Author Entity, Author Repository, Service, Controller, ManyToMany with Book, PHASE 4 — Authors & ManyToMany

### Community 100 - "PHASE 7 — Borrowing System"
Cohesion: 0.40
Nodes (5): Borrow Controller, Borrow Logic, BorrowRecord Entity, PHASE 7 — Borrowing System, Testing

### Community 101 - "Topics To Learn"
Cohesion: 0.40
Nodes (5): Docker (Optional), Logging, Swagger / OpenAPI, Topics To Learn, Unit Testing

### Community 102 - "Technologies"
Cohesion: 0.50
Nodes (4): Backend, Database, Technologies, Tools

### Community 103 - "Phase 1 - Setup & Basics"
Cohesion: 0.50
Nodes (4): Goals, Phase 1 - Setup & Basics, Tasks, Topics To Learn

### Community 104 - "Phase 2 - Books CRUD"
Cohesion: 0.50
Nodes (4): Goals, Phase 2 - Books CRUD, Tasks, Topics To Learn

### Community 105 - "Phase 3 - Categories & Relationships"
Cohesion: 0.50
Nodes (4): Goals, Phase 3 - Categories & Relationships, Tasks, Topics To Learn

### Community 106 - "Phase 4 - Authors & ManyToMany"
Cohesion: 0.50
Nodes (4): Goals, Phase 4 - Authors & ManyToMany, Tasks, Topics To Learn

### Community 107 - "Phase 5 - Validation & Exception Handling"
Cohesion: 0.50
Nodes (4): Goals, Phase 5 - Validation & Exception Handling, Tasks, Topics To Learn

### Community 108 - "Phase 6 - Authentication & Security"
Cohesion: 0.50
Nodes (4): Goals, Phase 6 - Authentication & Security, Tasks, Topics To Learn

### Community 109 - "Phase 7 - Borrowing System"
Cohesion: 0.50
Nodes (4): Goals, Phase 7 - Borrowing System, Tasks, Topics To Learn

### Community 110 - "PHASE 5 — Validation & Exception Handling"
Cohesion: 0.50
Nodes (4): Custom Exceptions, Global Exception Handler, Input Validation, PHASE 5 — Validation & Exception Handling

### Community 111 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, preview, typecheck

### Community 123 - "package.json"
Cohesion: 0.40
Nodes (4): name, packageManager, private, type

### Community 124 - "CategoryDonutChart.vue"
Cohesion: 0.40
Nodes (5): buildOption(), DonutItem, el, props, render()

### Community 125 - "ActivityChart.vue"
Cohesion: 0.50
Nodes (4): buildOption(), el, props, render()

## Knowledge Gaps
- **617 isolated node(s):** `01: Backend test harness + CI for backend`, `02: Enforce role-based authorization (ADMIN vs USER)`, `03: Harden auth validation + duplicate-email + change-password slice`, `04: Members (User) management grid replaces stub`, `05: Catalog search, pagination, and safe bulk-delete` (+612 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 795 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `BorrowResponse`, `TestDataConfig`, `JwtAuthFilter`, `UserResponse`, `JwtUtil`, `UserRepository`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `Book` connect `Book` to `Category`, `BorrowResponse`, `TestDataConfig`, `Author`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `BorrowRecord` connect `BorrowResponse` to `User`, `Book`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `01: Backend test harness + CI for backend`, `02: Enforce role-based authorization (ADMIN vs USER)`, `03: Harden auth validation + duplicate-email + change-password slice` to the rest of the system?**
  _617 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Category` be split into smaller, more focused modules?**
  _Cohesion score 0.11397849462365592 - nodes in this community are weakly interconnected._
- **Should `User` be split into smaller, more focused modules?**
  _Cohesion score 0.12318840579710146 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._