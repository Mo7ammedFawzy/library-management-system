# Graph Report - library-management-system  (2026-10-15)

## Corpus Check
- 223 files · ~89,528 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1749 nodes · 2736 edges · 169 communities (123 shown, 35 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 56 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `db7c4f92`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- api.ts
- User
- devDependencies
- BookFormModal.vue
- UserRepository
- unwrap
- ApiError
- mock.ts
- useCrudPage
- TestDataConfig
- App.vue
- generated/index.ts
- Book
- MemberCell.vue
- authors.ts
- JwtUtil
- register.vue
- compilerOptions
- login.vue
- compilerOptions
- sdk.gen.ts
- BorrowingsToolbar.vue
- BookServiceImpl
- Customizing components
- borrowings.ts
- data/books.ts
- useDashboard.ts
- BorrowBookModal.vue
- AppDataGrid.vue
- BookService
- mvnw
- useBorrowingsPage.ts
- Borrowing
- route-map.d.ts
- Author
- renovate.json
- client/utils.gen.ts
- dependencies
- Conventions
- LibraryApplicationTests.java
- ApiResponse
- Forms
- AGENTS.md
- LibraryApplication
- Components
- settings.vue
- tsconfig.json
- AuthServiceImpl
- AuthResponse.java
- change-password.vue
- UserResponse
- profile.vue
- org.library:library
- System Overview
- Dashboard Layout
- Common field patterns
- client/index.ts
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
- BorrowResponse
- PHASE 6 — Authentication & Security
- pathSerializer.gen.ts
- Docs Layout
- Editor Layout
- Nuxt UI
- CONTEXT.md
- core/types.gen.ts
- Data Tables
- Phase 9 - Notifications, Recycle Bin & Audit Log
- TASKS.md — Library Management System
- AG Charts — writing & debugging correct code
- AG Grid — writing & debugging correct code
- Auth Forms
- PHASE 2 — Books CRUD
- SecurityConfig
- Issue tracker: GitHub
- Vue Starter Template
- AG Studio — writing & debugging correct code
- ag-dev/SKILL.md
- Category
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
- BorrowRecord
- package.json
- CategoryDonutChart.vue
- ActivityChart.vue
- ag-grid-vue3
- echarts
- params.gen.ts
- 01-backend-test-harness-ci.md
- 02-role-based-authorization.md
- 03-auth-validation-change-password.md
- 04-members-management-grid.md
- 05-catalog-search-pagination.md
- 06-borrowing-scoping-history.md
- 07-real-profile-settings.md
- 08-secrets-config-honest-fallback.md
- lombok.RequiredArgsConstructor
- Overlays
- Interceptors
- queryKeySerializer.gen.ts
- bodySerializer.gen.ts
- vue
- 📚 Athenaeum — Library Management System
- AuthorRequest.java
- BookRequest.java
- CategoryRequest.java
- LoginRequest.java
- RegisterRequest.java
- SimpleNameFormModal.vue
- BookResponse
- @unhead/vue
- AuthService
- Athenaeum — Business Overview
- Athenaeum Navy Design System
- AuthResponse
- CurrentUserResponse
- LoginRequest
- PostMapping
- RegisterRequest
- @hey-api/openapi-ts
- categories.ts
- OpenApiConfig.java
- Main flows
- Components
- 🚀 Getting Started
- 🖼️ Screenshots

## God Nodes (most connected - your core abstractions)
1. `User` - 30 edges
2. `ApiResponse` - 29 edges
3. `unwrap()` - 28 edges
4. `Book` - 18 edges
5. `TestDataConfig` - 18 edges
6. `compilerOptions` - 18 edges
7. `BorrowResponse` - 17 edges
8. `Components` - 17 edges
9. `compilerOptions` - 16 edges
10. `BorrowRecord` - 14 edges

## Surprising Connections (you probably didn't know these)
- `CurrentUserResponse` --references--> `Role`  [EXTRACTED]
  backend/src/main/java/org/library/dto/CurrentUserResponse.java → backend/src/main/java/org/library/enums/Role.java
- `BorrowRecord` --references--> `User`  [EXTRACTED]
  backend/src/main/java/org/library/entity/BorrowRecord.java → backend/src/main/java/org/library/entity/User.java
- `UserRepository` --references--> `User`  [EXTRACTED]
  backend/src/main/java/org/library/repository/UserRepository.java → backend/src/main/java/org/library/entity/User.java
- `UserData` --references--> `Role`  [EXTRACTED]
  backend/src/main/java/org/library/config/TestDataConfig.java → backend/src/main/java/org/library/enums/Role.java
- `AuthServiceImpl` --references--> `SecurityContextUserContext`  [EXTRACTED]
  backend/src/main/java/org/library/service/impl/AuthServiceImpl.java → backend/src/main/java/org/library/service/impl/SecurityContextUserContext.java

## Import Cycles
- None detected.

## Communities (169 total, 35 thin omitted)

### Community 0 - "api.ts"
Cohesion: 0.11
Nodes (25): handleLogout(), CrudPageConfig, route, router, ApiError, checkBackendHealth(), clearToken(), sdk (+17 more)

### Community 1 - "User"
Cohesion: 0.12
Nodes (16): CurrentUserResponse, AllArgsConstructor, Builder, Data, Entity, NoArgsConstructor, Override, Table (+8 more)

### Community 2 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, eslint-plugin-vue, devDependencies, eslint, eslint-plugin-vue, @types/node, typescript, typescript-eslint (+9 more)

### Community 3 - "BookFormModal.vue"
Cohesion: 0.15
Nodes (12): copiesUi, emit, fieldUi, form, formRef, open, props, submitIcon (+4 more)

### Community 4 - "UserRepository"
Cohesion: 0.22
Nodes (7): UserMapper, CategoryRepository, UserRepository, Override, UserServiceImpl, org.springframework.data.jpa.repository.JpaRepository, org.springframework.stereotype.Service

### Community 5 - "unwrap"
Cohesion: 0.10
Nodes (20): book, initials, props, name, props, copies, props, status (+12 more)

### Community 6 - "ApiError"
Cohesion: 0.14
Nodes (12): BookAlreadyReturnedException, BookUnavailableException, GlobalExceptionHandler, ResponseEntity, ApiError, ResponseEntity, ExceptionHandler, HttpStatus (+4 more)

### Community 7 - "mock.ts"
Cohesion: 0.09
Nodes (12): authors, books, borrowBook(), borrowings, categories, createAuthor(), createBook(), createCategory() (+4 more)

### Community 8 - "useCrudPage"
Cohesion: 0.14
Nodes (12): ActionItem, ActionsCellParams, itemName, props, useCrudPage(), confirmDelete(), load(), submitForm() (+4 more)

### Community 9 - "TestDataConfig"
Cohesion: 0.12
Nodes (14): ApplicationConfig, AuthenticationManager, UserDetailsService, Author, Book, Category, TestDataConfig, UserData (+6 more)

### Community 10 - "App.vue"
Cohesion: 0.06
Nodes (27): breadcrumbsByPath, currentUser, dashboardBreadcrumb, displayName, headerMenuItems, isAuthPage, isDashboardPage, navItem() (+19 more)

### Community 11 - "generated/index.ts"
Cohesion: 0.05
Nodes (76): createAuthor(), createBook(), createCategory(), deleteAuthor(), deleteBooks(), getAllUsers(), getBooksByCategoryId(), returnBook() (+68 more)

### Community 12 - "Book"
Cohesion: 0.15
Nodes (9): Book, AllArgsConstructor, Builder, Entity, NoArgsConstructor, Table, BookRepository, Getter (+1 more)

### Community 13 - "MemberCell.vue"
Cohesion: 0.33
Nodes (5): avatarClass, avatarPalette, borrowing, initials, props

### Community 14 - "authors.ts"
Cohesion: 0.33
Nodes (6): {
  rows,
  gridApi,
  search,
  loadError,
  formOpen,
  editingItem,
  saving,
  formError,
  deleteTarget,
  deleting,
  deleteError,
  deleteModalOpen,
  openAdd,
  submitForm,
  confirmDelete,
  name,
  columns,
  getRowId,
  validate
}, Author, AuthorInput, createAuthor, deleteAuthor, updateAuthor

### Community 15 - "JwtUtil"
Cohesion: 0.14
Nodes (14): Override, UserDetailsService, JwtAuthFilter, JwtUtil, SecurityContextUserContext, Claims, FilterChain, HttpServletRequest (+6 more)

### Community 16 - "register.vue"
Cohesion: 0.13
Nodes (15): agreeTerms, confirmPassword, email, error, fullName, handleSubmit(), hasMinLength, hasNumber (+7 more)

### Community 17 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+25 more)

### Community 18 - "login.vue"
Cohesion: 0.18
Nodes (10): email, error, fillTestCredentials(), handleSubmit(), handleTestLogin(), isLoading, password, rememberMe (+2 more)

### Community 19 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+15 more)

### Community 20 - "sdk.gen.ts"
Cohesion: 0.04
Nodes (46): borrow(), deleteBook(), deleteCategory(), getAllAuthors(), getAllBooks(), getAllBorrows(), getBookById(), getCategories() (+38 more)

### Community 21 - "BorrowingsToolbar.vue"
Cohesion: 0.18
Nodes (12): calendarKey, clearFilters(), dateRange, emit, onCalendarUpdate(), search, statusDropdown, statusFilters (+4 more)

### Community 22 - "BookServiceImpl"
Cohesion: 0.13
Nodes (12): BorrowNotFoundException, ResourceNotFoundException, BookMapper, Author, Book, BookRequest, BookResponse, Category (+4 more)

### Community 23 - "Customizing components"
Cohesion: 0.07
Nodes (29): Adding custom brand colors, Backgrounds, Black/white as primary, Borders, Breakpoints, Choosing colors for components, `class` prop, Color shade overrides (+21 more)

### Community 24 - "borrowings.ts"
Cohesion: 0.19
Nodes (14): emit, open, borrowing, props, status, subtext, badgeColor, props (+6 more)

### Community 25 - "data/books.ts"
Cohesion: 0.18
Nodes (11): authors, Book, bookCategories, books, buildRows(), categories, initialRows, mulberry32() (+3 more)

### Community 27 - "useDashboard.ts"
Cohesion: 0.16
Nodes (16): loadOptions(), ACTIVITY_KIND_STYLE, ActivityItem, ActivityKind, activityKindLabel(), CategorySlice, DashboardStat, overdueLabel() (+8 more)

### Community 28 - "BorrowBookModal.vue"
Cohesion: 0.17
Nodes (10): emit, fieldUi, formRef, open, selectedBookId, selectedUserId, BorrowingFormState, gridApi (+2 more)

### Community 29 - "AppDataGrid.vue"
Cohesion: 0.29
Nodes (6): defaultColDef, emit, gridApi, onGridReady(), props, theme

### Community 30 - "BookService"
Cohesion: 0.31
Nodes (3): BookService, BookRequest, BookResponse

### Community 31 - "mvnw"
Cohesion: 0.38
Nodes (8): mvnw script, clean(), die(), exec_maven(), hash_string(), set_java_home(), trim(), verbose()

### Community 32 - "useBorrowingsPage.ts"
Cohesion: 0.20
Nodes (10): useBorrowingsPage(), load(), submitBorrow(), submitReturn(), validateBorrow(), borrowBook, BorrowingUser, fetchBorrowings (+2 more)

### Community 33 - "Borrowing"
Cohesion: 0.25
Nodes (7): authors, borrowing, props, BorrowingActionsParams, items, props, Borrowing

### Community 34 - "route-map.d.ts"
Cohesion: 0.29
Nodes (6): _RouteFileInfoMap, RouteNamedMap, _RouteNamesForFilePath, TypesConfig, vue-router, vue-router/auto-routes

### Community 35 - "Author"
Cohesion: 0.11
Nodes (18): AuthorController, AuthorRequest, AuthorResponse, GetMapping, PostMapping, PutMapping, RequestMapping, RestController (+10 more)

### Community 36 - "renovate.json"
Cohesion: 0.25
Nodes (7): extends, lockFileMaintenance, enabled, packageRules, postUpdateOptions, github>nuxt/renovate-config-nuxt, pnpmDedupe

### Community 37 - "client/utils.gen.ts"
Cohesion: 0.17
Nodes (21): createClient(), TODO: we probably want to return error and improve types, ReqInit, buildUrl(), checkForExistence(), createConfig(), createInterceptors(), defaultHeaders (+13 more)

### Community 38 - "dependencies"
Cohesion: 0.12
Nodes (17): ag-grid-community, @fontsource-variable/geist, @fontsource-variable/inter, dependencies, ag-grid-community, @fontsource-variable/geist, @fontsource-variable/inter, notivue (+9 more)

### Community 39 - "Conventions"
Cohesion: 0.09
Nodes (22): Auto-registered modules, Color mode, Composables, Content module integration, Conventions, Custom locale from scratch, Default icon overrides, defineShortcuts (+14 more)

### Community 40 - "LibraryApplicationTests.java"
Cohesion: 0.60
Nodes (3): LibraryApplicationTests, org.junit.jupiter.api.Test, org.springframework.boot.test.context.SpringBootTest

### Community 41 - "ApiResponse"
Cohesion: 0.16
Nodes (14): DeleteMapping, BookController, BookRequest, BookResponse, DeleteMapping, GetMapping, PostMapping, PutMapping (+6 more)

### Community 42 - "Forms"
Cohesion: 0.18
Nodes (10): Basic pattern, Field layout patterns, Form in a modal, Forms, Grid layout, Inline fields with UFieldGroup, Key rules, Programmatic validation (+2 more)

### Community 43 - "AGENTS.md"
Cohesion: 0.11
Nodes (16): Agent skills, API Contract (OpenAPI), Backend, Design References, Documentation, Domain docs, Frontend, graphify (+8 more)

### Community 45 - "Components"
Cohesion: 0.12
Nodes (17): Blog & Changelog, Chat (AI), Color Mode, Components, Content (Nuxt Content), Dashboard, Data, Editor (+9 more)

### Community 46 - "settings.vue"
Cohesion: 0.18
Nodes (8): displayName, email, emailReminders, isSaving, loanDays, overdueDigest, savedAt, saveError

### Community 48 - "AuthServiceImpl"
Cohesion: 0.21
Nodes (8): AuthServiceImpl, AuthenticationManager, AuthResponse, CurrentUserResponse, LoginRequest, Override, RegisterRequest, Override

### Community 53 - "change-password.vue"
Cohesion: 0.10
Nodes (19): confirmFieldError, confirmPassword, currentFieldError, currentPassword, error, handleSubmit(), hasMinLength, hasNumber (+11 more)

### Community 54 - "UserResponse"
Cohesion: 0.25
Nodes (8): HealthController, UserController, UserResponse, UserResponse, UserService, org.springframework.web.bind.annotation.GetMapping, org.springframework.web.bind.annotation.RequestMapping, org.springframework.web.bind.annotation.RestController

### Community 55 - "profile.vue"
Cohesion: 0.50
Nodes (3): displayName, email, initials

### Community 59 - "System Overview"
Cohesion: 0.20
Nodes (10): API Surface, Authentication, Catalog, Frontend Data Modes, Frontend Pages, Implemented Workflows, Lending, Reporting (+2 more)

### Community 60 - "Dashboard Layout"
Cohesion: 0.12
Nodes (16): Common mistakes, Component tree, Dashboard Layout, DashboardGroup, DashboardNavbar / DashboardToolbar, DashboardPanel, DashboardSidebar, Key components (+8 more)

### Community 61 - "Common field patterns"
Cohesion: 0.25
Nodes (8): Checkbox, Common field patterns, Date, File upload, Radio group, Select, Switch, Textarea

### Community 62 - "client/index.ts"
Cohesion: 0.15
Nodes (20): client, CreateClientConfig, BuildUrlFn, Client, ClientOptions, Config, CreateClientConfig, MethodFn (+12 more)

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
Cohesion: 0.23
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

### Community 73 - "BorrowResponse"
Cohesion: 0.14
Nodes (12): BorrowController, GetMapping, PostMapping, RequestMapping, RestController, BorrowResponse, BorrowMapper, BorrowResponse (+4 more)

### Community 74 - "PHASE 6 — Authentication & Security"
Cohesion: 0.20
Nodes (10): Auth Service & Controller, Dependencies, DTOs for Auth, JWT Utility, PHASE 6 — Authentication & Security, Role-Based Access, Security Config, Security Filter (+2 more)

### Community 75 - "pathSerializer.gen.ts"
Cohesion: 0.19
Nodes (17): createQuerySerializer(), ArraySeparatorStyle, MatrixStyle, ObjectSeparatorStyle, separatorArrayExplode(), separatorArrayNoExplode(), separatorObjectExplode(), serializeArrayParam() (+9 more)

### Community 76 - "Docs Layout"
Cohesion: 0.22
Nodes (9): App shell, Common mistakes, Component tree, Docs Layout, How nesting works, Key components, Layout, Page (+1 more)

### Community 77 - "Editor Layout"
Cohesion: 0.22
Nodes (8): Basic editor, Component tree, Content types, Editor Layout, Key components, Toolbar modes, When to use, With document sidebar

### Community 78 - "Nuxt UI"
Cohesion: 0.22
Nodes (9): Core rules (always apply), How to use this skill, Installation, MCP Server, Nuxt, Nuxt UI, Reference files, Routing table (+1 more)

### Community 79 - "CONTEXT.md"
Cohesion: 0.28
Nodes (4): Collection, Identity, Lending, Library Management

### Community 80 - "core/types.gen.ts"
Cohesion: 0.24
Nodes (11): Auth, AuthToken, BodySerializer, QuerySerializer, QuerySerializerOptions, Client, ClientMeta, Config (+3 more)

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

### Community 88 - "SecurityConfig"
Cohesion: 0.36
Nodes (6): Bean, Configuration, SecurityConfig, org.springframework.security.config.annotation.web.builders.HttpSecurity, org.springframework.security.config.annotation.web.configuration.EnableWebSecurity, org.springframework.security.web.SecurityFilterChain

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

### Community 93 - "Category"
Cohesion: 0.12
Nodes (19): CategoryController, CategoryRequest, CategoryResponse, GetMapping, PostMapping, PutMapping, RequestMapping, ResponseEntity (+11 more)

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
Cohesion: 0.25
Nodes (8): scripts, build, dev, generate-api, lint, preview, test, typecheck

### Community 122 - "BorrowRecord"
Cohesion: 0.21
Nodes (9): BorrowRecord, AllArgsConstructor, Builder, Data, Entity, NoArgsConstructor, Table, BorrowRecordRepository (+1 more)

### Community 123 - "package.json"
Cohesion: 0.40
Nodes (4): name, packageManager, private, type

### Community 124 - "CategoryDonutChart.vue"
Cohesion: 0.40
Nodes (5): buildOption(), DonutItem, el, props, render()

### Community 125 - "ActivityChart.vue"
Cohesion: 0.50
Nodes (4): buildOption(), el, props, render()

### Community 128 - "params.gen.ts"
Cohesion: 0.18
Nodes (11): buildClientParams(), buildKeyMap(), extraPrefixes, extraPrefixesMap, Field, Fields, FieldsConfig, KeyMap (+3 more)

### Community 137 - "lombok.RequiredArgsConstructor"
Cohesion: 0.18
Nodes (13): AuthResponse, AuthController, GetMapping, RequestMapping, RestController, CurrentUserResponse, io.swagger.v3.oas.annotations.security.SecurityRequirements, LoginRequest (+5 more)

### Community 138 - "Overlays"
Cohesion: 0.33
Nodes (6): Command palette, Confirmation dialog, Drawer (bottom sheet), Form in a slideover, Overlays, Programmatic confirmation (useOverlay)

### Community 141 - "queryKeySerializer.gen.ts"
Cohesion: 0.48
Nodes (6): isPlainObject(), JsonValue, queryKeyJsonReplacer(), serializeQueryKeyValue(), serializeSearchParams(), stringifyToJsonValue()

### Community 142 - "bodySerializer.gen.ts"
Cohesion: 0.22
Nodes (6): formDataBodySerializer, jsonBodySerializer, QuerySerializerOptionsObject, urlSearchParamsBodySerializer, ArrayStyle, ObjectStyle

### Community 144 - "📚 Athenaeum — Library Management System"
Cohesion: 0.22
Nodes (9): 🔌 API Overview, 📚 Athenaeum — Library Management System, Backend — `backend/`, 🚀 Demo, ✨ Features, Frontend — `frontend/`, 📄 License, 📁 Project Structure (+1 more)

### Community 150 - "SimpleNameFormModal.vue"
Cohesion: 0.06
Nodes (25): emit, emptyDescription, emptyTitle, gridApi, hasRows, props, showGrid, activeCategories (+17 more)

### Community 151 - "BookResponse"
Cohesion: 0.33
Nodes (3): AuthorResponse, BookResponse, CategoryResponse

### Community 154 - "AuthService"
Cohesion: 0.25
Nodes (5): AuthService, AuthResponse, CurrentUserResponse, LoginRequest, RegisterRequest

### Community 155 - "Athenaeum — Business Overview"
Cohesion: 0.25
Nodes (8): Athenaeum — Business Overview, Business rules, Core concepts, Open questions, Pages / screens, Status, Users & roles, What it is

### Community 156 - "Athenaeum Navy Design System"
Cohesion: 0.25
Nodes (8): Athenaeum Navy Design System, Brand & Style, Colors, Do's and Don'ts, Elevation & Depth, Layout & Spacing, Shapes, Typography

### Community 163 - "categories.ts"
Cohesion: 0.21
Nodes (11): clear(), emit, props, search, update(), {
  rows,
  gridApi,
  search,
  loadError,
  formOpen,
  editingItem,
  saving,
  formError,
  deleteTarget,
  deleting,
  deleteError,
  deleteModalOpen,
  openAdd,
  submitForm,
  confirmDelete,
  name,
  columns,
  getRowId,
  validate
}, Category, CategoryInput (+3 more)

### Community 164 - "OpenApiConfig.java"
Cohesion: 0.40
Nodes (3): OpenApiConfig, io.swagger.v3.oas.models.OpenAPI, OpenAPI

### Community 165 - "Main flows"
Cohesion: 0.33
Nodes (6): Borrowing a book, Checking the dashboard, Main flows, Managing the catalog, Returning a book, Sign up and sign in

### Community 166 - "Components"
Cohesion: 0.33
Nodes (6): Components, Dashboard, Data Viz, Header, Page Breadcrumbs, Sidebar & Navigation

### Community 167 - "🚀 Getting Started"
Cohesion: 0.50
Nodes (4): 1. Backend, 2. Frontend, 🚀 Getting Started, Prerequisites

### Community 168 - "🖼️ Screenshots"
Cohesion: 0.50
Nodes (4): Books management, Dashboard, Login, 🖼️ Screenshots

## Knowledge Gaps
- **710 isolated node(s):** `What it is`, `Users & roles`, `Core concepts`, `Sign up and sign in`, `Managing the catalog` (+705 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 912 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `TestDataConfig` connect `TestDataConfig` to `lombok.RequiredArgsConstructor`, `BorrowRecord`, `Book`, `UserRepository`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `Components` connect `Components` to `OpenApiConfig.java`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `What it is`, `Users & roles`, `Core concepts` to the rest of the system?**
  _710 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11088709677419355 - nodes in this community are weakly interconnected._
- **Should `User` be split into smaller, more focused modules?**
  _Cohesion score 0.1168091168091168 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `unwrap` be split into smaller, more focused modules?**
  _Cohesion score 0.09659090909090909 - nodes in this community are weakly interconnected._