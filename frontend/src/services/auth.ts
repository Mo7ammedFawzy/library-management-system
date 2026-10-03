import { clearToken, isAuthenticated, setToken, unwrap, withFallback, MOCK_TOKEN } from './api'
import { sdk, type LoginRequest, type RegisterRequest } from './api-client'

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