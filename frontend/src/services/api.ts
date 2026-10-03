const TOKEN_KEY = 'athenaeum_token'
export const MOCK_TOKEN = 'mock-athenaeum-token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  const token = getToken()
  if (!token) {
    return false
  }
  if (token === MOCK_TOKEN) {
    return true
  }
  if (token.split('.').length !== 3) {
    clearToken()
    return false
  }
  return true
}

interface ErrorBody {
  message?: string
  error?: string
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export class NetworkError extends Error {
  constructor() {
    super('Unable to reach the server.')
    this.name = 'NetworkError'
  }
}

export function isBackendUnavailable(error: unknown): boolean {
  return error instanceof NetworkError || (error instanceof ApiError && error.status >= 500)
}

/**
 * Shape of a resolved generated-SDK call: the body is still wrapped in the
 * backend's `ApiResponse<T>` envelope, and failures come back as `error`.
 */
export interface SdkResult<T> {
  data?: { data?: T }
  error?: unknown
  response?: Response
}

/**
 * Unwraps a generated SDK call: returns `ApiResponse.data` and re-throws
 * failures as `ApiError` / `NetworkError` so the rest of the app can keep
 * using the existing error types.
 *
 * A `null` payload is legitimate — the delete endpoints answer with
 * `ApiResponse.okResponse(null, "… deleted")`. A *missing* payload is not, so
 * that throws instead of resolving to `undefined` behind a `T` return type.
 */
export function unwrap<T>({ data, error, response }: SdkResult<T>): T {
  if (error !== undefined || !response?.ok) {
    const status = response?.status ?? 0
    const body = error as ErrorBody | undefined
    const message = body?.message || body?.error || `Request failed with status ${status}`
    throw status === 0 ? new NetworkError() : new ApiError(status, message)
  }

  if (data?.data === undefined) {
    throw new ApiError(response.status, 'The server response did not contain any data.')
  }

  return data.data
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch('/api/health')
    return res.ok
  } catch {
    return false
  }
}

async function shouldUseFallback(error: unknown): Promise<boolean> {
  if (isBackendUnavailable(error)) {
    return true
  }

  return error instanceof ApiError && error.status === 404 && !(await checkBackendHealth())
}

export function withFallback<TArgs extends unknown[], T>(
  apiFn: (...args: TArgs) => Promise<T>,
  mockFn: (...args: TArgs) => T | Promise<T>
): (...args: TArgs) => Promise<T> {
  return async (...args: TArgs) => {
    try {
      return await apiFn(...args)
    } catch (error) {
      if (await shouldUseFallback(error)) {
        return await mockFn(...args)
      }
      throw error
    }
  }
}