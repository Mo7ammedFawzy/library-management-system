# Graph Report - library-management-system  (2026-10-03)

## Corpus Check
- 210 files · ~72,642 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1728 nodes · 2726 edges · 156 communities (115 shown, 30 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 56 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f4a98ba3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- api.ts
- User
- devDependencies
- BookFormModal.vue
- Category
- useBooksPage.ts
- ApiError
- mock.ts
- useNameCrudPage.ts
- TestDataConfig
- App.vue
- generated/index.ts
- Book
- MemberCell.vue
- unwrap
- JwtUtil
- register.vue
- compilerOptions
- login.vue
- compilerOptions
- sdk.gen.ts
- BorrowingsToolbar.vue
- Customizing components
- borrowings.ts
- data/books.ts
- useDashboard.ts
- useBooksPage
- AppDataGrid.vue
- authors.ts
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
- BookController
- Common field patterns
- AGENTS.md
- LibraryApplication
- Components
- settings.vue
- tsconfig.json
- AuthServiceImpl
- AuthResponse.java
- change-password.vue
- auth.ts
- profile.vue
- org.library:library
- Athenaeum Navy Design System
- Dashboard Layout
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
- Navigation
- bodySerializer.gen.ts
- Data Tables
- Phase 9 - Notifications, Recycle Bin & Audit Log
- TASKS.md — Library Management System
- AG Charts — writing & debugging correct code
- AG Grid — writing & debugging correct code
- Auth Forms
- PHASE 2 — Books CRUD
- Issue tracker: GitHub
- Vue Starter Template
- AG Studio — writing & debugging correct code
- ag-dev/SKILL.md
- ApiResponse
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
- Interceptors
- queryKeySerializer.gen.ts
- AuthorController.java
- vue
- SimpleNameFormModal.vue
- AuthorRequest.java
- BookRequest.java
- CategoryRequest.java
- LoginRequest.java
- RegisterRequest.java
- BooksCatalog.vue
- BooksFilters.vue
- @unhead/vue
- AppSidebar.vue
- SearchInput.vue
- main.ts
- AppHeader.vue
- shot.vue
- @hey-api/openapi-ts

## God Nodes (most connected - your core abstractions)
1. `ApiResponse` - 35 edges
2. `User` - 30 edges
3. `unwrap()` - 28 edges
4. `TestDataConfig` - 18 edges
5. `Book` - 18 edges
6. `compilerOptions` - 18 edges
7. `BorrowResponse` - 17 edges
8. `Components` - 17 edges
9. `compilerOptions` - 16 edges
10. `Author` - 14 edges

## Surprising Connections (you probably didn't know these)
- `ApplicationConfig` --references--> `UserRepository`  [EXTRACTED]
  backend/src/main/java/org/library/config/ApplicationConfig.java → backend/src/main/java/org/library/repository/UserRepository.java
- `TestDataConfig` --references--> `AuthorRepository`  [EXTRACTED]
  backend/src/main/java/org/library/config/TestDataConfig.java → backend/src/main/java/org/library/repository/AuthorRepository.java
- `TestDataConfig` --references--> `BookRepository`  [EXTRACTED]
  backend/src/main/java/org/library/config/TestDataConfig.java → backend/src/main/java/org/library/repository/BookRepository.java
- `TestDataConfig` --references--> `BorrowRecordRepository`  [EXTRACTED]
  backend/src/main/java/org/library/config/TestDataConfig.java → backend/src/main/java/org/library/repository/BorrowRecordRepository.java
- `TestDataConfig` --references--> `CategoryRepository`  [EXTRACTED]
  backend/src/main/java/org/library/config/TestDataConfig.java → backend/src/main/java/org/library/repository/CategoryRepository.java

## Import Cycles
- None detected.

## Communities (156 total, 30 thin omitted)

### Community 0 - "api.ts"
Cohesion: 0.21
Nodes (9): CrudPageConfig, ApiError, checkBackendHealth(), ErrorBody, isBackendUnavailable(), NetworkError, SdkResult, shouldUseFallback() (+1 more)

### Community 1 - "User"
Cohesion: 0.10
Nodes (19): CurrentUserResponse, AllArgsConstructor, Builder, Data, Entity, NoArgsConstructor, Override, Table (+11 more)

### Community 2 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, eslint-plugin-vue, devDependencies, eslint, eslint-plugin-vue, @types/node, typescript, typescript-eslint (+9 more)

### Community 3 - "BookFormModal.vue"
Cohesion: 0.15
Nodes (12): copiesUi, emit, fieldUi, form, formRef, open, props, submitIcon (+4 more)

### Community 4 - "Category"
Cohesion: 0.16
Nodes (11): Category, AllArgsConstructor, Data, Entity, NoArgsConstructor, Table, CategoryMapper, Category (+3 more)

### Community 5 - "useBooksPage.ts"
Cohesion: 0.18
Nodes (14): book, initials, props, name, props, copies, props, status (+6 more)

### Community 6 - "ApiError"
Cohesion: 0.14
Nodes (12): BookAlreadyReturnedException, BookUnavailableException, GlobalExceptionHandler, ResponseEntity, ApiError, ResponseEntity, ExceptionHandler, HttpStatus (+4 more)

### Community 7 - "mock.ts"
Cohesion: 0.08
Nodes (13): BorrowingUser, authors, books, borrowBook(), borrowings, categories, createAuthor(), createBook() (+5 more)

### Community 8 - "useNameCrudPage.ts"
Cohesion: 0.20
Nodes (8): ActionItem, ActionsCellParams, itemName, props, NameCrudPageConfig, NamedEntity, useNameCrudPage(), validateName()

### Community 9 - "TestDataConfig"
Cohesion: 0.19
Nodes (10): ApplicationConfig, AuthenticationManager, UserDetailsService, TestDataConfig, UserData, org.springframework.boot.ApplicationRunner, org.springframework.context.annotation.Bean, org.springframework.context.annotation.Configuration (+2 more)

### Community 10 - "App.vue"
Cohesion: 0.11
Nodes (15): breadcrumbsByPath, currentUser, dashboardBreadcrumb, displayName, headerMenuItems, isAuthPage, isDashboardPage, navItem() (+7 more)

### Community 11 - "generated/index.ts"
Cohesion: 0.05
Nodes (76): createAuthor(), createBook(), createCategory(), deleteAuthor(), deleteBooks(), getAllUsers(), getBooksByCategoryId(), returnBook() (+68 more)

### Community 12 - "Book"
Cohesion: 0.12
Nodes (11): Author, Category, Book, AllArgsConstructor, Builder, Entity, NoArgsConstructor, Table (+3 more)

### Community 13 - "MemberCell.vue"
Cohesion: 0.33
Nodes (5): avatarClass, avatarPalette, borrowing, initials, props

### Community 14 - "unwrap"
Cohesion: 0.40
Nodes (8): {
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
}, unwrap(), Category, CategoryInput, createCategory, deleteCategory, fetchCategories, updateCategory

### Community 15 - "JwtUtil"
Cohesion: 0.08
Nodes (23): Override, UserDetailsService, JwtAuthFilter, JwtUtil, Bean, Configuration, SecurityConfig, AuthResponse (+15 more)

### Community 16 - "register.vue"
Cohesion: 0.12
Nodes (16): agreeTerms, confirmPassword, email, error, fullName, handleSubmit(), hasMinLength, hasNumber (+8 more)

### Community 17 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+25 more)

### Community 18 - "login.vue"
Cohesion: 0.18
Nodes (11): email, error, fillTestCredentials(), handleSubmit(), handleTestLogin(), isLoading, password, rememberMe (+3 more)

### Community 19 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+15 more)

### Community 20 - "sdk.gen.ts"
Cohesion: 0.04
Nodes (46): borrow(), deleteBook(), deleteCategory(), getAllAuthors(), getAllBooks(), getAllBorrows(), getBookById(), getCategories() (+38 more)

### Community 21 - "BorrowingsToolbar.vue"
Cohesion: 0.18
Nodes (12): calendarKey, clearFilters(), dateRange, emit, onCalendarUpdate(), search, statusDropdown, statusFilters (+4 more)

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
Cohesion: 0.17
Nodes (14): ACTIVITY_KIND_STYLE, ActivityItem, ActivityKind, activityKindLabel(), CategorySlice, DashboardStat, overdueLabel(), personInitials() (+6 more)

### Community 28 - "useBooksPage"
Cohesion: 0.12
Nodes (9): emptyForm(), toBookInput(), useBooksPage(), loadOptions(), validateBook(), useCrudPage(), confirmDelete(), load() (+1 more)

### Community 29 - "AppDataGrid.vue"
Cohesion: 0.29
Nodes (6): defaultColDef, emit, gridApi, onGridReady(), props, theme

### Community 30 - "authors.ts"
Cohesion: 0.23
Nodes (9): client, {
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
}, sdk, Author, AuthorInput, createAuthor, deleteAuthor, fetchAuthors (+1 more)

### Community 31 - "mvnw"
Cohesion: 0.38
Nodes (8): mvnw script, clean(), die(), exec_maven(), hash_string(), set_java_home(), trim(), verbose()

### Community 32 - "useBorrowingsPage.ts"
Cohesion: 0.11
Nodes (18): emit, fieldUi, formRef, open, selectedBookId, selectedUserId, BorrowingFormState, useBorrowingsPage() (+10 more)

### Community 33 - "Borrowing"
Cohesion: 0.25
Nodes (7): authors, borrowing, props, BorrowingActionsParams, items, props, Borrowing

### Community 34 - "route-map.d.ts"
Cohesion: 0.25
Nodes (6): _RouteFileInfoMap, RouteNamedMap, _RouteNamesForFilePath, TypesConfig, vue-router, vue-router/auto-routes

### Community 35 - "Author"
Cohesion: 0.21
Nodes (9): Author, AllArgsConstructor, Data, Entity, NoArgsConstructor, Table, AuthorRepository, UserRepository (+1 more)

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

### Community 41 - "BookController"
Cohesion: 0.13
Nodes (12): BookController, BookRequest, BookResponse, DeleteMapping, GetMapping, PostMapping, PutMapping, RequestMapping (+4 more)

### Community 42 - "Common field patterns"
Cohesion: 0.11
Nodes (18): Basic pattern, Checkbox, Common field patterns, Date, Field layout patterns, File upload, Form in a modal, Forms (+10 more)

### Community 43 - "AGENTS.md"
Cohesion: 0.11
Nodes (16): Agent skills, API Contract (OpenAPI), Backend, Design References, Documentation, Domain docs, Frontend, graphify (+8 more)

### Community 45 - "Components"
Cohesion: 0.09
Nodes (20): Blog & Changelog, Chat (AI), Color Mode, Components, Content (Nuxt Content), Dashboard, Data, Editor (+12 more)

### Community 46 - "settings.vue"
Cohesion: 0.18
Nodes (8): displayName, email, emailReminders, isSaving, loanDays, overdueDigest, savedAt, saveError

### Community 48 - "AuthServiceImpl"
Cohesion: 0.11
Nodes (16): AuthController, AuthResponse, CurrentUserResponse, GetMapping, LoginRequest, PostMapping, RegisterRequest, RequestMapping (+8 more)

### Community 53 - "change-password.vue"
Cohesion: 0.10
Nodes (19): confirmFieldError, confirmPassword, currentFieldError, currentPassword, error, handleSubmit(), hasMinLength, hasNumber (+11 more)

### Community 54 - "auth.ts"
Cohesion: 0.23
Nodes (11): handleLogout(), clearToken(), getToken(), isAuthenticated(), CurrentUser, fetchCurrentUser, isLoggedIn(), LoginInput (+3 more)

### Community 55 - "profile.vue"
Cohesion: 0.50
Nodes (3): displayName, email, initials

### Community 59 - "Athenaeum Navy Design System"
Cohesion: 0.04
Nodes (45): Collection, Identity, Lending, Library Management, Athenaeum Navy Design System, Brand & Style, Colors, Components (+37 more)

### Community 60 - "Dashboard Layout"
Cohesion: 0.12
Nodes (16): Common mistakes, Component tree, Dashboard Layout, DashboardGroup, DashboardNavbar / DashboardToolbar, DashboardPanel, DashboardSidebar, Key components (+8 more)

### Community 62 - "client/index.ts"
Cohesion: 0.16
Nodes (19): CreateClientConfig, BuildUrlFn, Client, ClientOptions, Config, CreateClientConfig, MethodFn, OmitKeys (+11 more)

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
Nodes (6): Command palette, Confirmation dialog, Drawer (bottom sheet), Form in a slideover, Overlays, Programmatic confirmation (useOverlay)

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
Cohesion: 0.06
Nodes (29): AuthorResponse, BookResponse, BorrowResponse, CategoryResponse, UserResponse, BorrowNotFoundException, ResourceNotFoundException, BookMapper (+21 more)

### Community 74 - "PHASE 6 — Authentication & Security"
Cohesion: 0.20
Nodes (10): Auth Service & Controller, Dependencies, DTOs for Auth, JWT Utility, PHASE 6 — Authentication & Security, Role-Based Access, Security Config, Security Filter (+2 more)

### Community 75 - "pathSerializer.gen.ts"
Cohesion: 0.16
Nodes (19): createQuerySerializer(), ArraySeparatorStyle, ArrayStyle, MatrixStyle, ObjectSeparatorStyle, ObjectStyle, separatorArrayExplode(), separatorArrayNoExplode() (+11 more)

### Community 76 - "Docs Layout"
Cohesion: 0.22
Nodes (9): App shell, Common mistakes, Component tree, Docs Layout, How nesting works, Key components, Layout, Page (+1 more)

### Community 77 - "Editor Layout"
Cohesion: 0.22
Nodes (8): Basic editor, Component tree, Content types, Editor Layout, Key components, Toolbar modes, When to use, With document sidebar

### Community 78 - "Nuxt UI"
Cohesion: 0.22
Nodes (9): Core rules (always apply), How to use this skill, Installation, MCP Server, Nuxt, Nuxt UI, Reference files, Routing table (+1 more)

### Community 79 - "Navigation"
Cohesion: 0.40
Nodes (5): Breadcrumbs, Header with mobile menu, Navigation, Sidebar navigation (dashboard), Tab navigation (within a page)

### Community 80 - "bodySerializer.gen.ts"
Cohesion: 0.15
Nodes (15): Auth, AuthToken, BodySerializer, formDataBodySerializer, jsonBodySerializer, QuerySerializer, QuerySerializerOptions, QuerySerializerOptionsObject (+7 more)

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

### Community 93 - "ApiResponse"
Cohesion: 0.15
Nodes (14): PostMapping, PostMapping, CategoryController, CategoryRequest, CategoryResponse, DeleteMapping, GetMapping, PostMapping (+6 more)

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
Cohesion: 0.16
Nodes (10): Book, BorrowRecord, AllArgsConstructor, Builder, Data, Entity, NoArgsConstructor, Table (+2 more)

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
Cohesion: 0.21
Nodes (12): BorrowController, GetMapping, RequestMapping, RestController, HealthController, UserController, io.swagger.v3.oas.annotations.security.SecurityRequirements, lombok.RequiredArgsConstructor (+4 more)

### Community 141 - "queryKeySerializer.gen.ts"
Cohesion: 0.48
Nodes (6): isPlainObject(), JsonValue, queryKeyJsonReplacer(), serializeQueryKeyValue(), serializeSearchParams(), stringifyToJsonValue()

### Community 142 - "AuthorController.java"
Cohesion: 0.12
Nodes (12): AuthorController, AuthorRequest, AuthorResponse, DeleteMapping, GetMapping, PutMapping, RequestMapping, RestController (+4 more)

### Community 144 - "SimpleNameFormModal.vue"
Cohesion: 0.17
Nodes (10): emit, emit, fieldUi, form, name, open, props, submitLabel (+2 more)

### Community 150 - "BooksCatalog.vue"
Cohesion: 0.13
Nodes (11): emit, emptyDescription, emptyTitle, gridApi, hasRows, props, showGrid, emit (+3 more)

### Community 151 - "BooksFilters.vue"
Cohesion: 0.33
Nodes (4): activeCategories, emit, search, ShelfOption

### Community 154 - "AppSidebar.vue"
Cohesion: 0.33
Nodes (5): emit, NavItem, NavSection, open, sidebarUi

### Community 155 - "SearchInput.vue"
Cohesion: 0.47
Nodes (5): clear(), emit, props, search, update()

### Community 157 - "main.ts"
Cohesion: 0.40
Nodes (4): app, authPages, head, router

### Community 158 - "AppHeader.vue"
Cohesion: 0.50
Nodes (3): emit, initials, props

### Community 159 - "shot.vue"
Cohesion: 0.50
Nodes (3): route, router, MOCK_TOKEN

## Knowledge Gaps
- **698 isolated node(s):** `org.library:library`, `AuthResponse`, `AuthorRequest`, `BookRequest`, `CategoryRequest` (+693 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 896 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `TestDataConfig` connect `TestDataConfig` to `Author`, `Category`, `lombok.RequiredArgsConstructor`, `Book`, `BorrowRecord`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `Conventions` connect `Conventions` to `nuxt-ui/SKILL.md`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `Author`, `BorrowResponse`, `TestDataConfig`, `JwtUtil`, `BorrowRecord`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `org.library:library`, `AuthResponse`, `AuthorRequest` to the rest of the system?**
  _698 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `User` be split into smaller, more focused modules?**
  _Cohesion score 0.10080645161290322 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `ApiError` be split into smaller, more focused modules?**
  _Cohesion score 0.1402116402116402 - nodes in this community are weakly interconnected._