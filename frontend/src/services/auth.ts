import { ApiError, clearToken, isAuthenticated, setToken, unwrap, withFallback, MOCK_TOKEN } from './api'
import { sdk, type CurrentUserResponse, type LoginRequest, type RegisterRequest } from './api-client'
import * as mock from './mock'

// `Required<>` is deliberate: the generated request types mark every field
// optional, but the forms always supply all of them. If the backend adds a
// field to LoginRequest/RegisterRequest this turns into a compile error here
// rather than a silently dropped value.
export type LoginInput = Required<LoginRequest>
export type RegisterInput = Required<RegisterRequest>

export const login = withFallback(
  async (input: LoginInput) => {
    const res = await unwrap(await sdk.login({ body: input }))
    setToken(res.token)
  },
  (input: LoginInput) => {
    void input
    setToken(MOCK_TOKEN)
  }
)

export const register = withFallback(
  async (input: RegisterInput) => {
    const res = await unwrap(await sdk.register({ body: input }))
    setToken(res.token)
  },
  (input: RegisterInput) => {
    void input
    setToken(MOCK_TOKEN)
  }
)

export function logout(): void {
  clearToken()
}

export function isLoggedIn(): boolean {
  return isAuthenticated()
}

/**
 * The authenticated user, resolved from `GET /api/auth/me`.
 *
 * The generated `CurrentUserResponse` marks every field optional even though
 * the backend record always fills them, so this normalizes it once: callers get
 * real strings, and only throw when the payload is genuinely unusable.
 */
export const fetchCurrentUser = withFallback(
  async (): Promise<CurrentUser> => {
    const res = await unwrap(await sdk.getCurrentUser())
    return toCurrentUser(res)
  },
  async (): Promise<CurrentUser> => toCurrentUser(await mock.fetchCurrentUser())
)

export interface CurrentUser {
  id: number | null
  name: string
  email: string
  isAdmin: boolean
}

export function toCurrentUser(res?: CurrentUserResponse | null): CurrentUser {
  const name = res?.name?.trim() ?? ''
  const email = res?.email?.trim() ?? ''
  if (!name || !email) {
    throw new ApiError(200, 'The server response did not contain a valid user.')
  }
  return { id: res?.id ?? null, name, email, isAdmin: res?.role === 'ADMIN' }
}