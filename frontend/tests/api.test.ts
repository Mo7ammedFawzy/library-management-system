import assert from 'node:assert/strict'
import test from 'node:test'
import { ApiError, unwrap, withFallback } from '../src/services/api.ts'

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

test('unwrap returns the envelope payload', () => {
  const result = unwrap<{ id: number }>({
    data: { data: { id: 7 } },
    response: new Response(null, { status: 200 })
  })

  assert.deepEqual(result, { id: 7 })
})

test('unwrap passes through a null payload, as the delete endpoints return', () => {
  const result = unwrap<string | null>({
    data: { data: null },
    response: new Response(null, { status: 200 })
  })

  assert.equal(result, null)
})

test('unwrap throws instead of resolving to undefined when the payload is missing', () => {
  assert.throws(
    () => unwrap({ data: {}, response: new Response(null, { status: 200 }) }),
    { name: 'ApiError', status: 200 }
  )
})

test('unwrap maps a transport failure to NetworkError so withFallback can degrade', () => {
  assert.throws(() => unwrap({ error: new TypeError('Failed to fetch') }), { name: 'NetworkError' })
})
