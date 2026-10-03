import { computed, onMounted, ref, shallowRef } from 'vue'
import type { ColDef, GetRowIdParams } from 'ag-grid-community'
import type { FormError, SelectMenuItem } from '@nuxt/ui'
import { push } from 'notivue'
import BookCell from '../components/grid/BookCell.vue'
import BorrowingActionsCell from '../components/grid/BorrowingActionsCell.vue'
import DueDateCell from '../components/grid/DueDateCell.vue'
import MemberCell from '../components/grid/MemberCell.vue'
import StatusCell from '../components/grid/StatusCell.vue'
import { ApiError } from '../services/api'
import { fetchBooks, type Book } from '../services/books'
import {
  BORROWING_STATUSES,
  borrowBook,
  fetchBorrowings,
  fetchUsers,
  formatDate,
  getStatus,
  returnBook,
  type Borrowing,
  type BorrowingStatus,
  type BorrowingUser
} from '../services/borrowings'

const ALL_STATUS = '__all__'

export interface BorrowingFormState {
  bookId: number | null
  userId: number | null
}

/** Date range filter expressed as `YYYY-MM-DD` keys so it can be compared to borrowing dates. */
export interface DateRangeKeys {
  start: string | null
  end: string | null
}

export function validateBorrow(state: BorrowingFormState): FormError[] {
  const errors: FormError[] = []
  if (state.bookId == null) {
    errors.push({ name: 'bookId', message: 'Select a book to borrow' })
  }
  if (state.userId == null) {
    errors.push({ name: 'userId', message: 'Select a member' })
  }
  return errors
}

/**
 * All state for the borrowings route: rows plus the lookup data needed by the
 * borrow form, filter state and derived views. The view only wires this to
 * presentational components.
 */
export function useBorrowingsPage() {
  const rows = ref<Borrowing[]>([])
  const books = ref<Book[]>([])
  const users = ref<BorrowingUser[]>([])
  const loadError = shallowRef('')

  const search = shallowRef('')
  const statusFilters = ref<BorrowingStatus[]>([])
  const dateRange = ref<DateRangeKeys | null>(null)

  const addOpen = shallowRef(false)
  const selectedBookId = shallowRef<number | null>(null)
  const selectedUserId = shallowRef<number | null>(null)
  const saving = shallowRef(false)
  const formError = shallowRef('')

  const returning = shallowRef(false)
  const returnError = shallowRef('')

  const detailTarget = ref<Borrowing | null>(null)

  const detail = computed(() => detailTarget.value)
  const detailOpen = computed({
    get: () => detailTarget.value !== null,
    set: (value) => {
      if (!value) detailTarget.value = null
    }
  })

  async function load() {
    loadError.value = ''
    try {
      const [borrowings, bookList, userList] = await Promise.all([
        fetchBorrowings(),
        fetchBooks(),
        fetchUsers()
      ])
      rows.value = borrowings
      books.value = bookList
      users.value = userList
    } catch (error) {
      loadError.value = error instanceof ApiError ? error.message : 'Failed to load borrowings.'
    }
  }

  onMounted(load)

  function getRowId(params: GetRowIdParams) {
    return String((params.data as Borrowing).id)
  }

  const statusOptions = computed<SelectMenuItem[]>(() => [
    { label: 'All Status', value: ALL_STATUS },
    ...BORROWING_STATUSES.map((status) => ({ label: status, value: status }))
  ])

  const statusDropdown = computed<string>({
    get: () => (statusFilters.value.length === 1 ? statusFilters.value[0] : ALL_STATUS),
    set: (value) => {
      statusFilters.value = value && value !== ALL_STATUS ? [value as BorrowingStatus] : []
    }
  })

  const visibleRows = computed(() => {
    const range = dateRange.value
    return rows.value.filter((borrowing) => {
      if (statusFilters.value.length > 0 && !statusFilters.value.includes(getStatus(borrowing))) {
        return false
      }
      if (range?.start && range.end) {
        if (borrowing.borrowDate < range.start || borrowing.borrowDate > range.end) return false
      }
      return true
    })
  })

  const rangeLabel = computed(() => {
    const range = dateRange.value
    if (!range?.start || !range.end) return 'Select date range'
    return `${formatDate(range.start)} – ${formatDate(range.end)}`
  })

  const bookOptions = computed<SelectMenuItem[]>(() =>
    books.value
      .filter((book) => book.availableCopies > 0)
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((book) => ({ label: book.title, value: book.id }))
  )

  const memberOptions = computed<SelectMenuItem[]>(() =>
    users.value
      .map((user) => ({ label: `${user.name} (${user.email})`, value: user.id }))
      .sort((a, b) => String(a.label).localeCompare(String(b.label)))
  )

  const borrowState = computed<BorrowingFormState>(() => ({
    bookId: selectedBookId.value,
    userId: selectedUserId.value
  }))

  const detailStatus = computed<BorrowingStatus>(() =>
    detail.value ? getStatus(detail.value) : 'Borrowed'
  )

  function openAdd() {
    selectedBookId.value = null
    selectedUserId.value = null
    formError.value = ''
    addOpen.value = true
  }

  function openDetail(borrowing: Borrowing) {
    detailTarget.value = borrowing
  }

  async function submitBorrow() {
    saving.value = true
    formError.value = ''
    try {
      await borrowBook(selectedBookId.value as number, selectedUserId.value ?? undefined)
      push.success('Book borrowed successfully')
      await load()
      addOpen.value = false
    } catch (error) {
      formError.value = error instanceof ApiError ? error.message : 'Failed to borrow book.'
    } finally {
      saving.value = false
    }
  }

  async function submitReturn(borrowing: Borrowing) {
    returning.value = true
    returnError.value = ''
    try {
      await returnBook(borrowing.id)
      push.success('Book returned successfully')
      await load()
      detailTarget.value = null
    } catch (error) {
      returnError.value = error instanceof ApiError ? error.message : 'Failed to return book.'
    } finally {
      returning.value = false
    }
  }

  function resetFilters() {
    statusFilters.value = []
    dateRange.value = null
  }

  const columns: ColDef<Borrowing>[] = [
    {
      colId: 'index',
      headerName: '#',
      sortable: false,
      filter: false,
      width: 48,
      valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
      cellStyle: { textAlign: 'center' },
      cellClass: 'text-dimmed'
    },
    {
      colId: 'book',
      headerName: 'Book',
      flex: 2,
      minWidth: 200,
      valueGetter: (params) =>
        `${(params.data as Borrowing).bookResponse.title} ${(params.data as Borrowing).bookResponse.authors.map((author) => author.name).join(', ')}`,
      cellRenderer: BookCell
    },
    {
      colId: 'member',
      headerName: 'Member',
      flex: 2,
      minWidth: 200,
      valueGetter: (params) =>
        `${(params.data as Borrowing).userResponse.name} ${(params.data as Borrowing).userResponse.email}`,
      cellRenderer: MemberCell
    },
    {
      colId: 'status',
      headerName: 'Status',
      width: 120,
      valueGetter: (params) => getStatus(params.data as Borrowing),
      cellRenderer: StatusCell,
      filter: 'agTextColumnFilter'
    },
    {
      colId: 'borrowDate',
      headerName: 'Borrow Date',
      width: 130,
      valueGetter: (params) => (params.data as Borrowing).borrowDate,
      valueFormatter: (params) => formatDate(params.value as string)
    },
    {
      colId: 'dueDate',
      headerName: 'Due Date',
      width: 160,
      valueGetter: (params) => (params.data as Borrowing).dueDate,
      cellRenderer: DueDateCell
    },
    {
      colId: 'returnDate',
      headerName: 'Return Date',
      width: 130,
      valueGetter: (params) => (params.data as Borrowing).returnDate,
      valueFormatter: (params) => formatDate(params.value as string | null),
      cellClass: (params) => (params.value ? '' : 'text-muted')
    },
    {
      colId: 'actions',
      headerName: 'Actions',
      sortable: false,
      filter: false,
      width: 88,
      pinned: 'right',
      headerClass: 'ag-right-aligned-header',
      cellRenderer: BorrowingActionsCell,
      cellRendererParams: {
        onView: (borrowing: Borrowing) => openDetail(borrowing),
        onReturn: (borrowing: Borrowing) => submitReturn(borrowing)
      }
    }
  ]

  return {
    rows,
    search,
    loadError,
    statusFilters,
    dateRange,
    addOpen,
    selectedBookId,
    selectedUserId,
    saving,
    formError,
    returning,
    returnError,
    detail,
    detailOpen,
    detailStatus,
    borrowState,
    statusOptions,
    statusDropdown,
    visibleRows,
    rangeLabel,
    bookOptions,
    memberOptions,
    columns,
    getRowId,
    validate: validateBorrow,
    load,
    openAdd,
    openDetail,
    submitBorrow,
    submitReturn,
    resetFilters
  }
}