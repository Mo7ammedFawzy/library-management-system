import { unwrap, withFallback } from './api'
import { sdk, type AuthorRequest, type AuthorResponse } from './api-client'
import * as mock from './mock'

export type Author = AuthorResponse
export type AuthorInput = AuthorRequest

export const fetchAuthors = withFallback(
  async () => unwrap(await sdk.getAllAuthors()),
  () => mock.fetchAuthors()
)

export const createAuthor = withFallback(
  async (input: AuthorInput) => unwrap(await sdk.createAuthor({ body: input })),
  (input: AuthorInput) => mock.createAuthor(input)
)

export const updateAuthor = withFallback(
  async (id: number, input: AuthorInput) => unwrap(await sdk.updateAuthor({ path: { id }, body: input })),
  (id: number, input: AuthorInput) => mock.updateAuthor(id, input)
)

export const deleteAuthor = withFallback(
  async (id: number) => {
    await unwrap(await sdk.deleteAuthor({ path: { id } }))
  },
  (id: number) => { mock.deleteAuthor(id); return Promise.resolve() }
)