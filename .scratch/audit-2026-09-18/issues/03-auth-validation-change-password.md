# 03: Harden auth validation + duplicate-email + change-password slice

**What to build:** As a visitor I get clear 400/409 errors for bad register/login input and duplicate email (no 500), and as a logged-in User I can change my password from the Change Password page (currently a `PageStub`) via a real API.

**Blocked by:** 01: Backend test harness + CI for backend; 02: Enforce role-based authorization (change-password must run as self-only under the new authz rules).

**Status:** ready-for-agent

- [ ] `LoginRequest`/`RegisterRequest` gain Bean Validation (`@NotBlank`/`@Email`/`@Size` for password) and `AuthController` uses `@Valid`; `AuthServiceImpl.register` checks `UserRepository.findByEmail` first and throws 409 (new handler in `GlobalExceptionHandler` for `DataIntegrityViolationException`/duplicate) instead of today's unvalidated save that 500s
- [ ] New `POST /api/auth/change-password` (current-password check via `PasswordEncoder.matches`, new-password rules, self-only) with `ApiResponse` envelope; no such endpoint exists today
- [ ] Frontend `change-password.vue` replaced (no `PageStub`): form with validation, calls real API, success/error toast; does not use mock fallback for auth
- [ ] Demo: register with bad email/short password → 400, re-register same email → 409, login → JWT, change password → old password fails, new password logs in
