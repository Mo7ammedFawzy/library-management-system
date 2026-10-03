import { unwrap, withFallback } from './api'
import { sdk, type BookRequest, type BookResponse } from './api-client'
import * as mock from './mock'

export type Book = BookResponse
export type BookInput = BookRequest

export const fetchBooks = withFallback(
  async () => unwrap(await sdk.getAllBooks()),
  () => mock.fetchBooks()
)

export const createBook = withFallback(
  async (input: BookInput) => unwrap(await sdk.createBook({ body: input })),
  (input: BookInput) => mock.createBook(input)
)

export const updateBook = withFallback(
  async (id: number, input: BookInput) => unwrap(await sdk.updateBook({ path: { id }, body: input })),
  (id: number, input: BookInput) => mock.updateBook(id, input)
)

export const deleteBook = withFallback(
  async (id: number) => {
    await unwrap(await sdk.deleteBook({ path: { id } }))
  },
  (id: number) => { mock.deleteBook(id); return Promise.resolve() }
)