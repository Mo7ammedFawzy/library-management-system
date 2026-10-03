import { computed, onMounted, ref, watch } from 'vue'
import type { ColDef, GetRowIdParams, GridApi, ICellRendererParams } from 'ag-grid-community'
import type { FormError } from '@nuxt/ui'
import ActionsCell from '../components/grid/ActionsCell.vue'
import BookTitleCell from '../components/grid/BookTitleCell.vue'
import CategoryCell from '../components/grid/CategoryCell.vue'
import CopiesCell from '../components/grid/CopiesCell.vue'
import {
  createBook,
  deleteBook,
  fetchBooks,
  updateBook,
  type Book,
  type BookInput
} from '../services/books'
import { fetchAuthors, type Author } from '../services/authors'
import { fetchCategories, type Category } from '../services/categories'
import { useCrudPage } from './useCrudPage'

export interface BookFormState {
  title: string
  description: string
  categoryId: number | undefined
  authorIds: number[]
  availableCopies: number
}

function emptyForm(categoryId?: number): BookFormState {
  return {
    title: '',
    description: '',
    categoryId,
    authorIds: [],
    availableCopies: 1
  }
}

export function validateBook(state: BookFormState): FormError[] {
  const errors: FormError[] = []
  if (!state.title.trim()) {
    errors.push({ name: 'title', message: 'Title is required' })
  }
  const description = state.description.trim()
  if (!description) {
    errors.push({ name: 'description', message: 'Description is required' })
  } else if (description.length < 10) {
    errors.push({ name: 'description', message: 'Description must be at least 10 characters' })
  }
  if (state.categoryId == null) {
    errors.push({ name: 'categoryId', message: 'Category is required' })
  }
  if (state.authorIds.length === 0) {
    errors.push({ name: 'authorIds', message: 'At least one author is required' })
  }
  return errors
}

export function toBookInput(state: BookFormState): BookInput {
  return {
    title: state.title.trim(),
    description: state.description.trim(),
    availableCopies: Number(state.availableCopies) || 1,
    categoryId: state.categoryId as number,
    authorIds: state.authorIds
  }
}

/**
 * All state for the books catalogue route: rows, lookup options, filters,
 * derived metrics and grid columns. The view stays a composition surface and
 * only wires these values to presentational components.
 */
export function useBooksPage() {
  const categories = ref<Category[]>([])
  const authors = ref<Author[]>([])
  const categoryFilters = ref<string[]>([])

  const crud = useCrudPage<Book, BookFormState, BookInput>({
    fetchFn: fetchBooks,
    createFn: createBook,
    updateFn: updateBook,
    deleteFn: deleteBook,
    getId: (book) => book.id,
    entityName: 'book',
    // Read lazily so the first category is already available when the user
    // opens the form, without needing a watcher to resync after options load.
    emptyState: () => emptyForm(categories.value[0]?.id),
    toState: (book) => ({
      title: book.title,
      description: book.description ?? '',
      categoryId: book.category.id,
      authorIds: book.authors.map((author) => author.id),
      availableCopies: book.availableCopies
    }),
    toInput: toBookInput
  })

  const { rows, search, gridApi, state: form } = crud

  async function loadOptions() {
    const [categoryList, authorList] = await Promise.all([fetchCategories(), fetchAuthors()])
    categories.value = categoryList
    authors.value = authorList
  }

  onMounted(loadOptions)

  const categoryOptions = computed(() =>
    categories.value.map((category) => ({ label: category.name, value: category.id }))
  )

  const authorOptions = computed(() =>
    authors.value.map((author) => ({ label: author.name, value: author.id }))
  )

  const visibleBooks = computed(() => {
    const query = search.value.trim().toLowerCase()
    return rows.value.filter((book) => {
      if (categoryFilters.value.length > 0 && !categoryFilters.value.includes(book.category.name)) {
        return false
      }
      if (!query) return true
      const haystack = [
        book.title,
        book.description,
        book.category.name,
        ...book.authors.map((author) => author.name)
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
  })

  const totalCopies = computed(() =>
    rows.value.reduce((total, book) => total + Number(book.availableCopies || 0), 0)
  )

  const lowStockCount = computed(
    () => rows.value.filter((book) => Number(book.availableCopies || 0) <= 2).length
  )

  const collectionHealth = computed(() => {
    if (rows.value.length === 0) return 0
    return Math.round(((rows.value.length - lowStockCount.value) / rows.value.length) * 100)
  })

  const categoryCounts = computed(() =>
    categories.value.map((category) => ({
      name: category.name,
      count: rows.value.filter((book) => book.category.id === category.id).length
    }))
  )

  const hasActiveFilters = computed(
    () => categoryFilters.value.length > 0 || search.value.trim().length > 0
  )

  function getRowId(params: GetRowIdParams) {
    return String((params.data as Book).id)
  }

  function clearAllFilters() {
    categoryFilters.value = []
    search.value = ''
  }

  function clearSearch() {
    search.value = ''
  }

  function selectAllCategories() {
    categoryFilters.value = []
  }

  function incrementCopies() {
    form.value.availableCopies = Math.max(1, (Number(form.value.availableCopies) || 1) + 1)
  }

  function decrementCopies() {
    form.value.availableCopies = Math.max(1, (Number(form.value.availableCopies) || 1) - 1)
  }

  function applyCategoryFilter(api: GridApi<Book> | null) {
    if (!api) return
    if (categoryFilters.value.length === 0) {
      api.setColumnFilterModel('category', null)
    } else {
      api.setColumnFilterModel('category', {
        filterType: 'text',
        operator: 'OR',
        conditions: categoryFilters.value.map((category: string) => ({
          filterType: 'text',
          type: 'equals',
          filter: category
        }))
      })
    }
    api.onFilterChanged()
  }

  const columns: ColDef<Book>[] = [
    {
      colId: 'index',
      headerName: 'No.',
      sortable: false,
      filter: false,
      width: 56,
      valueGetter: (params) => String((params.node?.rowIndex ?? 0) + 1).padStart(2, '0'),
      cellStyle: { textAlign: 'center' },
      cellClass: 'book-index-cell'
    },
    {
      field: 'title',
      headerName: 'Book',
      flex: 2.4,
      minWidth: 270,
      cellRenderer: BookTitleCell,
      cellClass: 'book-title-column'
    },
    {
      colId: 'authors',
      headerName: 'Author',
      flex: 1.6,
      minWidth: 170,
      valueGetter: (params) =>
        (params.data?.authors ?? []).map((author) => author.name).join(', '),
      cellClass: 'author-column'
    },
    {
      colId: 'category',
      headerName: 'Shelf',
      flex: 1.15,
      minWidth: 150,
      valueGetter: (params) => params.data?.category.name ?? '',
      cellRenderer: CategoryCell,
      cellClass: 'category-column',
      filter: 'agTextColumnFilter'
    },
    {
      field: 'availableCopies',
      headerName: 'Stock',
      width: 116,
      minWidth: 108,
      sortable: true,
      filter: false,
      headerClass: 'ag-center-aligned-header',
      cellRenderer: CopiesCell,
      cellClass: 'stock-column'
    },
    {
      colId: 'actions',
      headerName: '',
      sortable: false,
      filter: false,
      width: 88,
      minWidth: 80,
      pinned: 'right',
      headerClass: 'ag-right-aligned-header',
      cellRenderer: ActionsCell,
      cellRendererParams: {
        onEdit: (params: ICellRendererParams) => crud.openEdit(params.data as Book),
        onDelete: (params: ICellRendererParams) => crud.openDelete(params.data as Book)
      }
    }
  ]

  watch(categoryFilters, () => applyCategoryFilter(gridApi.value))

  return {
    ...crud,
    form,
    categories,
    authors,
    categoryFilters,
    categoryOptions,
    authorOptions,
    visibleBooks,
    totalCopies,
    lowStockCount,
    collectionHealth,
    categoryCounts,
    hasActiveFilters,
    columns,
    getRowId,
    validate: validateBook,
    selectAllCategories,
    clearSearch,
    clearAllFilters,
    incrementCopies,
    decrementCopies
  }
}