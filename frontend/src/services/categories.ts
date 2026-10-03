import { unwrap, withFallback } from './api'
import { sdk, type CategoryRequest, type CategoryResponse } from './api-client'
import * as mock from './mock'

export type Category = CategoryResponse
export type CategoryInput = CategoryRequest

export const fetchCategories = withFallback(
  async () => unwrap(await sdk.getCategories()),
  () => mock.fetchCategories()
)

export const createCategory = withFallback(
  async (input: CategoryInput) => unwrap(await sdk.createCategory({ body: input })),
  (input: CategoryInput) => mock.createCategory(input)
)

export const updateCategory = withFallback(
  async (id: number, input: CategoryInput) => unwrap(await sdk.updateCategory({ path: { id }, body: input })),
  (id: number, input: CategoryInput) => mock.updateCategory(id, input)
)

export const deleteCategory = withFallback(
  async (id: number) => {
    await unwrap(await sdk.deleteCategory({ path: { id } }))
  },
  (id: number) => { mock.deleteCategory(id); return Promise.resolve() }
)