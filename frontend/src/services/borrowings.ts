import { unwrap, withFallback } from './api'
import { sdk, type BorrowResponse, type UserResponse } from './api-client'
import * as mock from './mock'

export type Borrowing = BorrowResponse
export type BorrowingUser = UserResponse

export const BORROWING_STATUSES = ['Overdue', 'Due Today', 'Borrowed', 'Returned'] as const
export type BorrowingStatus = (typeof BORROWING_STATUSES)[number]

export function todayStr(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function getStatus(borrowing: Pick<Borrowing, 'dueDate' | 'returnDate'>): BorrowingStatus {
  if (borrowing.returnDate) return 'Returned'
  const today = todayStr()
  if (borrowing.dueDate < today) return 'Overdue'
  if (borrowing.dueDate === today) return 'Due Today'
  return 'Borrowed'
}

export function daysUntil(dateStr: string): number {
  const due = new Date(`${dateStr}T00:00:00`).getTime()
  const today = new Date(`${todayStr()}T00:00:00`).getTime()
  return Math.round((due - today) / 86400000)
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—'
  const date = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const fetchBorrowings = withFallback(
  async () => unwrap(await sdk.getAllBorrows()),
  () => mock.fetchBorrowings()
)

export const fetchUsers = withFallback(
  async () => unwrap(await sdk.getAllUsers()),
  () => mock.fetchUsers()
)

export const borrowBook = withFallback(
  async (bookId: number, userId?: number) =>
    unwrap(await sdk.borrow({ path: { bookId }, query: userId ? { userId } : undefined })),
  (bookId: number, userId?: number) => mock.borrowBook(bookId, userId)
)

export const returnBook = withFallback(
  async (borrowId: number) => unwrap(await sdk.returnBook({ path: { borrowId } })),
  (borrowId: number) => mock.returnBook(borrowId)
)