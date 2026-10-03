import { client } from '../api/generated/client.gen'
import { getToken } from './api'

/**
 * Generated SDK client, wired to the JWT stored by the auth flow.
 * Requests are relative (`/api/**`) so they go through the Vite dev proxy.
 *
 * No global Content-Type: the client negotiates it per request from the body,
 * so a blanket header would be sent on GET/DELETE too and would force a CORS
 * preflight if the frontend is ever served from another origin.
 */
client.setConfig({
  auth: () => getToken() ?? undefined
})

export { client }
export * as sdk from '../api/generated/sdk.gen'
export type * from '../api/generated/types.gen'