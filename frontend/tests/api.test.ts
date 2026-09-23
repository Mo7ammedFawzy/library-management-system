import assert from 'node:assert/strict'
import test from 'node:test'
import { ApiError, withFallback } from '../src/services/api.ts'

test('uses mock data when both the API route and health endpoint return 404', async (t) => {
  const originalFetch = globalThis.fetch
  t.after(() => {
    globalThis.fetch = originalFetch
  })

  let requestedUrl = ''
  globalThis.fetch = async (input) => {
    requestedUrl = String(input)
    return new Response(null, { status: 404 })
  }

  let fallbackCalls = 0
  const result = await withFallback(
    async () => {
      throw new ApiError(404, 'Request failed with status 404')
    },
    async () => {
      fallbackCalls += 1
      return 'mock data'
    }
  )('request')

  assert.equal(result, 'mock data')
  assert.equal(fallbackCalls, 1)
  assert.equal(requestedUrl, '/api/health')
})

test('does not hide a resource 404 when the backend health endpoint is available', async (t) => {
  const originalFetch = globalThis.fetch
  t.after(() => {
    globalThis.fetch = originalFetch
  })

  globalThis.fetch = async () => new Response(null, { status: 200 })

  let fallbackCalls = 0
  await assert.rejects(
    withFallback(
      async () => {
        throw new ApiError(404, 'Book not found')
      },
      async () => {
        fallbackCalls += 1
        return 'mock data'
      }
    )('request'),
    { name: 'ApiError', status: 404 }
  )

  assert.equal(fallbackCalls, 0)
})
