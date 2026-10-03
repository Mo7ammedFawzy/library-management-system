import { client } from '../api/generated/client.gen'
import { getToken } from './api'

/**
 * Generated SDK client, wired to the JWT stored by the auth flow.
 * Requests are relative (`/api/**`) so they go through the Vite dev proxy.
 */
client.setConfig({
  auth: () => getToken() ?? undefined,
  headers: {
    'Content-Type': 'application/json',
  },
})

export { client }
export * as sdk from '../api/generated/sdk.gen'
export type * from '../api/generated/types.gen'