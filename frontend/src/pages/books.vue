<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { ColDef, GetRowIdParams, ICellRendererParams } from 'ag-grid-community'
import ActionsCell from '../components/grid/ActionsCell.vue'
import BookTitleCell from '../components/grid/BookTitleCell.vue'
import CategoryCell from '../components/grid/CategoryCell.vue'
import CopiesCell from '../components/grid/CopiesCell.vue'
import type { FormError, BreadcrumbItem } from '@nuxt/ui'
import {
  createBook,
  deleteBook,
  fetchBooks,
  updateBook,
  type Book,
  type BookInput
} from '../services/books'
import { fetchCategories, type Category } from '../services/categories'
import { fetchAuthors, type Author } from '../services/authors'
import { useCrudPage } from '../composables/useCrudPage'
import PageBreadcrumb from '../components/PageBreadcrumb.vue'

const breadcrumbItems = ref<BreadcrumbItem[]>([
  { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/dashboard' },
  { label: 'Books', icon: 'i-lucide-book-open' }
])

const categories = ref<Category[]>([])
const authors = ref<Author[]>([])
const categoryFilters = ref<string[]>([])

async function loadOptions() {
  const [cats, auths] = await Promise.all([fetchCategories(), fetchAuthors()])
  categories.value = cats
  authors.value = auths
}

function getRowId(params: GetRowIdParams) {
  return String((params.data as Book).id)
}

const columns: ColDef<Book>[] = [
  {
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
    cellClass: 'book-title-cell'
  },
  {
    headerName: 'Author',
    colId: 'authors',
    flex: 1.6,
    minWidth: 170,
    valueGetter: (params) => (params.data?.authors ?? []).map((author) => author.name).join(', ')
  },
  {
    headerName: 'Shelf',
    colId: 'category',
    flex: 1.15,
    minWidth: 150,
    valueGetter: (params) => params.data?.category.name ?? '',
    cellRenderer: CategoryCell,
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
    cellRenderer: CopiesCell
  },
  {
    headerName: '',
    sortable: false,
    filter: false,
    width: 88,
    minWidth: 80,
    pinned: 'right',
    headerClass: 'ag-right-aligned-header',
    cellRenderer: ActionsCell,
    cellRendererParams: {
      onEdit: (params: ICellRendererParams) => openEdit(params.data as Book),
      onDelete: (params: ICellRendererParams) => openDelete(params.data as Book)
    }
  }
]

interface BookFormState {
  title: string
  description: string
  categoryId: number | undefined
  authorIds: number[]
  availableCopies: number
}

function validateBook(state: BookFormState): FormError[] {
  const errors: FormError[] = []
  if (!state.title.trim()) {
    errors.push({ name: 'title', message: 'Title is required' })
  }
  if (!state.description.trim()) {
    errors.push({ name: 'description', message: 'Description is required' })
  } else if (state.description.trim().length < 10) {
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

function toInput(state: BookFormState): BookInput {
  return {
    title: state.title.trim(),
    description: state.description.trim(),
    availableCopies: Number(state.availableCopies) || 1,
    categoryId: state.categoryId as number,
    authorIds: state.authorIds
  }
}

const {
  rows,
  gridApi,
  search,
  loadError,
  formOpen,
  editingItem,
  saving,
  formError,
  entityForm,
  deleteTarget,
  deleting,
  deleteError,
  deleteModalOpen,
  load,
  openAdd,
  openEdit,
  setFormState,
  submitForm,
  openDelete,
  confirmDelete
} = useCrudPage<Book, BookInput>({
  fetchFn: fetchBooks,
  createFn: createBook,
  updateFn: updateBook,
  deleteFn: deleteBook,
  getRowId,
  columns,
  validate: validateBook,
  toInput,
  entityName: 'book'
})

const form = ref<BookFormState>({
  title: '',
  description: '',
  categoryId: undefined,
  authorIds: [],
  availableCopies: 1
})

const categoryOptions = computed(() =>
  categories.value.map((category: Category) => ({ label: category.name, value: category.id }))
)

const authorOptions = computed(() =>
  authors.value.map((author: Author) => ({ label: author.name, value: author.id }))
)

const visibleBooks = computed(() => {
  const q = search.value.trim().toLowerCase()
  return rows.value.filter((book: Book) => {
    if (categoryFilters.value.length > 0 && !categoryFilters.value.includes(book.category.name)) {
      return false
    }
    if (!q) return true
    const haystack = [book.title, book.description, book.category.name, ...book.authors.map((author) => author.name)]
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
})

const totalCopies = computed(() =>
  rows.value.reduce((total: number, book: Book) => total + Number(book.availableCopies || 0), 0)
)

const lowStockCount = computed(() =>
  rows.value.filter((book: Book) => Number(book.availableCopies || 0) <= 2).length
)

const collectionHealth = computed(() => {
  if (rows.value.length === 0) return 0
  return Math.round(((rows.value.length - lowStockCount.value) / rows.value.length) * 100)
})

const categoryCounts = computed(() =>
  categories.value.map((category) => ({
    name: category.name,
    count: rows.value.filter((book: Book) => book.category.id === category.id).length
  }))
)

const hasActiveFilters = computed(() => categoryFilters.value.length > 0 || search.value.trim().length > 0)

function clearSearch() {
  search.value = ''
}

function removeCategoryFilter(category: string) {
  categoryFilters.value = categoryFilters.value.filter((name) => name !== category)
}

function toggleCategoryFilter(category: string) {
  categoryFilters.value = categoryFilters.value.includes(category)
    ? categoryFilters.value.filter((name) => name !== category)
    : [...categoryFilters.value, category]
}

function clearAllFilters() {
  categoryFilters.value = []
  search.value = ''
}

watch(formOpen, (open: boolean) => {
  if (open) {
    if (editingItem.value) {
      const book = editingItem.value as Book
      form.value = {
        title: book.title,
        description: book.description,
        categoryId: book.category.id,
        authorIds: book.authors.map((author: Author) => author.id),
        availableCopies: book.availableCopies
      }
    } else {
      form.value = {
        title: '',
        description: '',
        categoryId: categories.value[0]?.id ?? undefined,
        authorIds: [],
        availableCopies: 1
      }
    }
  }
})

watch(form, (val) => {
  setFormState(val)
}, { deep: true })

function applyFilters() {
  const api = gridApi.value
  if (!api) return

  if (categoryFilters.value.length === 0) {
    api.setColumnFilterModel('category', null)
  } else {
    api.setColumnFilterModel('category', {
      filterType: 'text',
      operator: 'OR',
      conditions: categoryFilters.value.map((category) => ({
        filterType: 'text',
        type: 'equals',
        filter: category
      }))
    })
  }

  api.onFilterChanged()
}

watch(categoryFilters, () => applyFilters())

function resetFilters() {
  categoryFilters.value = []
}

function incrementCopies() {
  form.value.availableCopies = Math.max(1, (Number(form.value.availableCopies) || 1) + 1)
}

function decrementCopies() {
  form.value.availableCopies = Math.max(1, (Number(form.value.availableCopies) || 1) - 1)
}

async function loadAll() {
  await Promise.all([load(), loadOptions()])
}

onMounted(loadAll)

const fieldUi = {
  base: '!rounded-[10px] !bg-white !py-3 !text-sm !ring-[#d6e0ea] !placeholder:text-[#65798e] focus-visible:!ring-2 focus-visible:ring-[#7398bd] focus-visible:!outline-none'
}

const copiesUi = {
  ...fieldUi,
  trailing: '!pe-0',
  base: `${fieldUi.base} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`
}
</script>

<template>
  <div class="books-page workspace-page mx-auto flex w-full min-w-0 flex-none flex-col gap-5 overflow-x-clip pb-2 md:min-h-0 md:flex-1">
    <PageBreadcrumb :items="breadcrumbItems" />

    <section
      class="books-hero"
      aria-labelledby="books-heading"
    >
      <div class="books-hero__main">
        <div class="books-hero__copy">
          <p class="books-hero__eyebrow">
            <UIcon
              name="i-lucide-library-big"
              class="size-3.5 text-[#f4c762]"
              aria-hidden="true"
            />
            Athenaeum catalogue
          </p>
          <h1
            id="books-heading"
            class="books-hero__title"
          >
            The collection, in order.
          </h1>
          <p class="books-hero__description">
            Find every title, follow each shelf, and keep the collection ready for the next reader.
          </p>
          <UButton
            icon="i-lucide-plus"
            aria-label="Add book"
            class="books-hero__action !min-h-11 !rounded-[10px] !px-5 !font-bold"
            @click="openAdd"
          >
            Add a title
          </UButton>
        </div>

        <div
          class="books-hero__collection"
          role="group"
          aria-label="Collection health"
        >
          <div
            class="books-hero__book-stack"
            aria-hidden="true"
          >
            <span class="books-hero__book books-hero__book--one">IDEAS</span>
            <span class="books-hero__book books-hero__book--two">STORIES</span>
            <span class="books-hero__book books-hero__book--three">SCIENCE</span>
          </div>
          <div class="books-hero__health">
            <p>Collection health</p>
            <strong>{{ collectionHealth }}%</strong>
            <span>
              {{ lowStockCount ? `${lowStockCount} ${lowStockCount === 1 ? 'title needs' : 'titles need'} restocking` : 'All titles are well stocked' }}
            </span>
          </div>
        </div>
      </div>

      <dl class="books-hero__stats">
        <div>
          <dt>Titles</dt>
          <dd>{{ rows.length }}</dd>
        </div>
        <div>
          <dt>Copies available</dt>
          <dd>{{ totalCopies }}</dd>
        </div>
        <div>
          <dt>Shelves</dt>
          <dd>{{ categoryCounts.length }}</dd>
        </div>
        <div>
          <dt>Low stock</dt>
          <dd>{{ lowStockCount }}</dd>
        </div>
      </dl>
    </section>

    <div
      v-if="loadError"
      class="flex items-center gap-2 rounded-2xl border border-[#f3c5c0] bg-[#fff0ee] px-4 py-3 text-sm text-[#b3261e]"
      role="alert"
    >
      <UIcon
        name="i-lucide-alert-circle"
        class="size-4 shrink-0"
        aria-hidden="true"
      />
      <span>{{ loadError }}</span>
    </div>

    <section
      class="books-page__filters"
      aria-label="Search and filter books"
    >
      <div class="books-page__toolbar-heading">
        <div>
          <h2>Browse the collection</h2>
          <p>Search by title, author, description, or shelf.</p>
        </div>
        <div class="books-page__toolbar-status">
          <span
            class="size-1.5 rounded-full bg-[#20876e]"
            aria-hidden="true"
          />
          Inventory loaded
        </div>
      </div>

      <div class="books-page__toolbar-controls">
        <div class="books-page__search">
          <label
            for="books-search"
            class="sr-only"
          >Search books by title, author, description or category</label>
          <UIcon
            name="i-lucide-search"
            class="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-[#6c7f96]"
            aria-hidden="true"
          />
          <input
            id="books-search"
            v-model="search"
            type="search"
            placeholder="Search the catalogue..."
            aria-label="Search books by title, author, description or category"
          >
          <button
            v-if="search"
            type="button"
            aria-label="Clear search"
            class="books-page__search-clear"
            @click="clearSearch"
          >
            <UIcon
              name="i-lucide-x"
              class="size-4"
              aria-hidden="true"
            />
          </button>
        </div>

        <p
          role="status"
          aria-live="polite"
          class="books-page__result-count"
        >
          <strong>{{ visibleBooks.length }}</strong> of {{ rows.length }} titles
        </p>

        <button
          v-if="hasActiveFilters"
          type="button"
          class="books-page__reset"
          @click="clearAllFilters"
        >
          <UIcon
            name="i-lucide-rotate-ccw"
            class="size-3.5"
            aria-hidden="true"
          />
          Reset
        </button>
      </div>

      <div
        class="books-page__shelves"
        role="group"
        aria-label="Filter by shelf"
      >
        <span class="books-page__shelves-label">Shelves</span>
        <div class="books-page__shelf-list">
          <button
            type="button"
            :aria-pressed="categoryFilters.length === 0"
            :class="{ 'books-page__shelf--active': categoryFilters.length === 0 }"
            @click="resetFilters"
          >
            All titles
            <span>{{ rows.length }}</span>
          </button>
          <button
            v-for="category in categoryCounts"
            :key="category.name"
            type="button"
            :aria-pressed="categoryFilters.includes(category.name)"
            :class="{ 'books-page__shelf--active': categoryFilters.includes(category.name) }"
            @click="toggleCategoryFilter(category.name)"
          >
            {{ category.name }}
            <span>{{ category.count }}</span>
          </button>
        </div>
      </div>

      <div
        v-if="categoryFilters.length"
        class="books-page__active-filters"
        aria-label="Active category filters"
      >
        <button
          v-for="name in categoryFilters"
          :key="name"
          type="button"
          :aria-label="`Remove ${name} filter`"
          @click="removeCategoryFilter(name)"
        >
          {{ name }}
          <UIcon
            name="i-lucide-x"
            class="size-3.5 shrink-0"
            aria-hidden="true"
          />
        </button>
      </div>
    </section>

    <section
      class="books-page__catalog flex min-w-0 flex-col"
      aria-labelledby="catalog-heading"
    >
      <header class="books-page__catalog-header">
        <div class="books-page__catalog-title">
          <span
            class="books-page__catalog-icon"
            aria-hidden="true"
          >
            <UIcon
              name="i-lucide-library-big"
              class="size-4"
            />
          </span>
          <div>
            <h2 id="catalog-heading">
              All titles
            </h2>
            <p>
              {{ visibleBooks.length }} {{ visibleBooks.length === 1 ? 'match' : 'matches' }} in the current view
            </p>
          </div>
        </div>
        <div class="books-page__catalog-meta">
          <span
            class="size-1.5 rounded-full bg-[#20876e]"
            aria-hidden="true"
          />
          Inventory view
        </div>
      </header>

      <div
        v-if="!loadError && rows.length > 0 && visibleBooks.length > 0"
        class="flex min-h-0 flex-1 flex-col"
        role="region"
        aria-label="Books data grid"
      >
        <AppDataGrid
          v-model:api="gridApi"
          :rows="visibleBooks"
          :columns="columns"
          :get-row-id="getRowId"
          :row-height="62"
          :header-height="44"
          :page-size="6"
          :page-size-selector="[6, 12, 24]"
          height="100%"
        />
      </div>

      <div
        v-else-if="!loadError"
        class="books-page__empty"
      >
        <span
          class="books-page__empty-icon"
          aria-hidden="true"
        >
          <UIcon
            :name="rows.length === 0 ? 'i-lucide-library-big' : 'i-lucide-search-x'"
            class="size-6"
          />
        </span>
        <h3>{{ rows.length === 0 ? 'The shelves are waiting' : 'No books match this view' }}</h3>
        <p>
          {{ rows.length === 0
            ? 'Add the first title to begin building the Athenaeum collection.'
            : 'Try a broader search or reset the selected shelves.'
          }}
        </p>
        <UButton
          v-if="rows.length === 0"
          icon="i-lucide-plus"
          class="!min-h-11 !rounded-[10px] !px-5"
          @click="openAdd"
        >
          Add a title
        </UButton>
        <UButton
          v-else
          color="neutral"
          variant="outline"
          icon="i-lucide-rotate-ccw"
          class="!min-h-11 !rounded-[10px] !px-5"
          @click="clearAllFilters"
        >
          Reset view
        </UButton>
      </div>
    </section>

    <p
      role="status"
      aria-live="polite"
      class="sr-only"
    >
      {{ visibleBooks.length }} of {{ rows.length }} books shown
    </p>

    <UModal
      v-model:open="formOpen"
      :title="editingItem ? 'Edit Book' : 'Add Book'"
      :description="editingItem ? 'Update book details' : 'Add a new book to your library'"
      :ui="{
        overlay: '!bg-black/20 backdrop-blur-sm',
        content: 'books-modal !max-w-2xl !rounded-2xl !bg-white !shadow-[0_24px_70px_rgba(15,39,66,0.18)] !ring-1 !ring-[#cbd7e4]'
      }"
    >
      <template #content="{ close }">
        <div class="flex flex-col">
          <div class="books-modal__header flex shrink-0 items-center justify-between gap-4 border-b border-(--ui-border) px-5 py-4">
            <div class="flex items-center gap-4">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-(--ui-bg-accented)">
                <UIcon
                  name="i-lucide-book-open"
                  class="text-lg text-highlighted"
                />
              </div>
              <div>
                <h2 class="font-display text-[20px] font-bold leading-tight text-highlighted">
                  {{ editingItem ? 'Edit Book' : 'Add Book' }}
                </h2>
                <p class="text-xs font-medium text-muted">
                  {{ editingItem ? 'Update book details' : 'Add a new book to your library' }}
                </p>
              </div>
            </div>

            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-x"
              aria-label="Close modal"
              @click="close"
            />
          </div>

          <div class="books-modal__body grow overflow-y-auto px-5 py-5">
            <div
              v-if="formError"
              class="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              <UIcon
                name="i-lucide-alert-circle"
                class="size-4 shrink-0"
              />
              <span>{{ formError }}</span>
            </div>

            <UForm
              ref="entityForm"
              :state="form"
              :validate="validateBook"
              class="flex flex-col gap-6"
              @submit="submitForm"
            >
              <div class="flex flex-col gap-2">
                <label
                  for="book-title"
                  class="text-sm font-medium text-highlighted"
                >
                  Title <span class="text-error">*</span>
                </label>
                <UInput
                  id="book-title"
                  v-model="form.title"
                  placeholder="e.g. Clean Code"
                  :ui="fieldUi"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label
                  for="book-description"
                  class="text-sm font-medium text-highlighted"
                >
                  Description <span class="text-error">*</span>
                </label>
                <UTextarea
                  id="book-description"
                  v-model="form.description"
                  placeholder="Brief summary of the book (at least 10 characters)"
                  :rows="3"
                  :ui="fieldUi"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                  <label
                    for="book-category"
                    class="text-sm font-medium text-highlighted"
                  >
                    Category <span class="text-error">*</span>
                  </label>
                  <USelectMenu
                    id="book-category"
                    v-model="form.categoryId"
                    :items="categoryOptions"
                    value-key="value"
                    :search-input="false"
                    :ui="fieldUi"
                    icon="i-lucide-tag"
                    placeholder="Select category"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <label
                    for="book-copies"
                    class="text-sm font-medium text-highlighted"
                  >
                    Copies <span class="text-error">*</span>
                  </label>
                  <UInput
                    id="book-copies"
                    v-model="form.availableCopies"
                    type="number"
                    min="1"
                    :ui="copiesUi"
                  >
                    <template #trailing>
                      <div class="flex h-full flex-col border-l border-(--ui-border)">
                        <button
                          type="button"
                          class="flex flex-1 items-center justify-center px-2 text-muted transition-colors motion-reduce:transition-none hover:bg-(--ui-bg-accented) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8ca9ce]"
                          aria-label="Increase copies"
                          @click="incrementCopies"
                        >
                          <UIcon
                            name="i-lucide-chevron-up"
                            class="size-3.5"
                          />
                        </button>
                        <button
                          type="button"
                          class="flex flex-1 items-center justify-center border-t border-(--ui-border) px-2 text-muted transition-colors motion-reduce:transition-none hover:bg-(--ui-bg-accented) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8ca9ce]"
                          aria-label="Decrease copies"
                          @click="decrementCopies"
                        >
                          <UIcon
                            name="i-lucide-chevron-down"
                            class="size-3.5"
                          />
                        </button>
                      </div>
                    </template>
                  </UInput>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <label
                  for="book-authors"
                  class="text-sm font-medium text-highlighted"
                >
                  Authors <span class="text-error">*</span>
                </label>
                <USelectMenu
                  id="book-authors"
                  v-model="form.authorIds"
                  :items="authorOptions"
                  value-key="value"
                  multiple
                  search-input
                  :ui="fieldUi"
                  icon="i-lucide-users"
                  placeholder="Select one or more authors"
                />
              </div>
            </UForm>
          </div>

          <div class="books-modal__footer flex shrink-0 items-center justify-end gap-2 border-t border-(--ui-border) bg-[#fbfcfe] px-5 py-4">
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              class="rounded-xl px-8 py-2.5 bg-transparent ring-black/10 hover:bg-black/10"
              @click="close"
            >
              Cancel
            </UButton>
            <UButton
              color="primary"
              variant="solid"
              :icon="editingItem ? 'i-lucide-save' : 'i-lucide-book-open'"
              size="lg"
              class="!rounded-xl !px-8 !py-2.5 !bg-brand-700 hover:!bg-brand-600"
              :loading="saving"
              @click="entityForm?.submit()"
            >
              {{ editingItem ? 'Save Changes' : 'Add Book' }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <UModal
      v-model:open="deleteModalOpen"
      :ui="{
        overlay: '!bg-black/20 backdrop-blur-sm',
        content: '!max-w-md !rounded-xl !bg-(--ui-bg-card) !shadow-[0_8px_32px_rgba(0,0,0,0.04)] !ring-0 border border-(--ui-border)'
      }"
    >
      <template #content>
        <div class="flex flex-col">
          <div class="books-modal__header flex shrink-0 items-center justify-between gap-4 border-b border-(--ui-border) px-5 py-4">
            <div class="flex items-center gap-4">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50">
                <UIcon
                  name="i-lucide-trash-2"
                  class="text-lg text-red-600"
                />
              </div>
              <div>
                <h2 class="font-display text-[20px] font-bold leading-tight text-highlighted">
                  Delete Book?
                </h2>
                <p class="text-xs font-medium text-muted">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-x"
              aria-label="Close modal"
              @click="deleteTarget = null"
            />
          </div>

          <div class="px-4 py-4">
            <p class="text-sm leading-relaxed text-highlighted">
              Are you sure you want to delete
              <span class="font-semibold">"{{ deleteTarget?.title }}"</span>?
            </p>

            <div
              v-if="deleteError"
              class="mt-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              <UIcon
                name="i-lucide-alert-circle"
                class="size-4 shrink-0"
              />
              <span>{{ deleteError }}</span>
            </div>
          </div>

          <div class="books-modal__footer flex shrink-0 items-center justify-end gap-2 border-t border-(--ui-border) bg-[#fbfcfe] px-5 py-4">
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              class="!rounded-xl !px-8 !py-2.5 !bg-transparent ring-(--ui-border-accented) hover:!bg-(--ui-bg-accented)"
              @click="deleteTarget = null"
            >
              Cancel
            </UButton>
            <UButton
              color="error"
              variant="solid"
              icon="i-lucide-trash-2"
              size="lg"
              class="!rounded-xl !px-8 !py-2.5"
              :loading="deleting"
              @click="confirmDelete"
            >
              Delete
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
.books-page {
  --books-ink: #102f49;
  --books-muted: #667a91;
  --books-line: #dce5ee;
  --books-navy: #102f49;
  --books-gold: #e4ae35;
  gap: 1.5rem;
}

.books-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.25rem;
  background: #102f49;
  color: #f8fafc;
  box-shadow: 0 20px 50px rgba(15, 42, 65, 0.14);
}

.books-hero::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  background:
    linear-gradient(105deg, transparent 48%, rgba(255, 255, 255, 0.035) 48%, rgba(255, 255, 255, 0.035) 49%, transparent 49%),
    repeating-linear-gradient(90deg, transparent 0, transparent 72px, rgba(255, 255, 255, 0.035) 73px, transparent 74px);
  content: '';
  mask-image: linear-gradient(90deg, transparent, #000 45%, #000);
}

.books-hero::after {
  position: absolute;
  z-index: -1;
  top: 0;
  bottom: 0;
  left: 0;
  width: 4px;
  background: var(--books-gold);
  content: '';
}

.books-hero__main {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(19rem, 0.8fr);
  gap: 2.5rem;
  padding: 2.5rem 2.75rem 2rem;
}

.books-hero__copy {
  min-width: 0;
  align-self: center;
}

.books-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #b8c8d6;
  font-size: 0.75rem;
  font-weight: 600;
}

.books-hero__title {
  max-width: 11ch;
  margin-top: 1rem;
  color: #f8fafc;
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 4vw, 3.45rem);
  font-weight: 650;
  letter-spacing: -0.055em;
  line-height: 1.02;
}

.books-hero__description {
  max-width: 35rem;
  margin-top: 1.125rem;
  color: #c6d3df;
  font-size: 0.9375rem;
  line-height: 1.65;
}

.books-hero__action {
  margin-top: 1.5rem;
  background: var(--books-gold) !important;
  color: #102f49 !important;
  box-shadow: 0 8px 22px rgba(4, 19, 32, 0.18) !important;
  transition: background-color 160ms ease, transform 160ms ease, box-shadow 160ms ease;
}

.books-hero__action:hover {
  background: #f4c762 !important;
  box-shadow: 0 10px 26px rgba(4, 19, 32, 0.24) !important;
  transform: translateY(-1px);
}

.books-hero__action:active {
  transform: translateY(1px);
}

.books-hero__collection {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
  padding-left: 2rem;
}

.books-hero__book-stack {
  position: relative;
  width: 13.5rem;
  height: 10.25rem;
  flex: 0 0 auto;
}

.books-hero__book {
  position: absolute;
  display: flex;
  width: 4.5rem;
  height: 8.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem 0.45rem 0.45rem 0.25rem;
  box-shadow: 0 18px 26px rgba(4, 19, 32, 0.28);
  font-size: 0.5625rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  writing-mode: vertical-rl;
}

.books-hero__book::before {
  position: absolute;
  top: 0.5rem;
  bottom: 0.5rem;
  left: 0.3rem;
  width: 1px;
  background: currentColor;
  content: '';
  opacity: 0.28;
}

.books-hero__book--one {
  top: 1.25rem;
  left: 0.5rem;
  background: #d8a536;
  color: #17334b;
  transform: rotate(-8deg);
}

.books-hero__book--two {
  z-index: 2;
  top: 0.25rem;
  left: 4.5rem;
  background: #e7edf2;
  color: #17334b;
}

.books-hero__book--three {
  top: 1.4rem;
  left: 8.25rem;
  background: #356b83;
  color: #f4f7fa;
  transform: rotate(8deg);
}

.books-hero__health {
  min-width: 9rem;
}

.books-hero__health p {
  color: #aebfce;
  font-size: 0.6875rem;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.books-hero__health strong {
  display: block;
  margin-top: 0.4rem;
  color: #f8fafc;
  font-family: var(--font-display);
  font-size: 2.25rem;
  font-weight: 650;
  letter-spacing: -0.05em;
  line-height: 1;
}

.books-hero__health span {
  display: block;
  margin-top: 0.55rem;
  color: #b9c8d5;
  font-size: 0.75rem;
  line-height: 1.45;
}

.books-hero__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 1px solid rgba(255, 255, 255, 0.11);
  background: rgba(5, 24, 40, 0.24);
}

.books-hero__stats > div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 1.4rem;
}

.books-hero__stats > div:last-child {
  border-right: 0;
}

.books-hero__stats dt {
  color: #aebfce;
  font-size: 0.6875rem;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.books-hero__stats dd {
  color: #f8fafc;
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 650;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.035em;
}

.books-page__filters {
  position: relative;
  z-index: 2;
  margin-top: -1.5rem;
  margin-bottom: -1px;
  border: 1px solid var(--books-line);
  border-radius: 1.125rem 1.125rem 0 0;
  background: #fff;
  padding: 1.375rem 1.5rem 1.125rem;
  box-shadow: 0 12px 32px rgba(26, 55, 81, 0.08);
}

.books-page__toolbar-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.books-page__toolbar-heading h2 {
  color: var(--books-ink);
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 650;
  letter-spacing: -0.025em;
  line-height: 1.3;
}

.books-page__toolbar-heading p {
  margin-top: 0.25rem;
  color: var(--books-muted);
  font-size: 0.8125rem;
}

.books-page__toolbar-status,
.books-page__catalog-meta {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: #64788f;
  font-size: 0.6875rem;
  font-weight: 650;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.books-page__toolbar-controls {
  display: grid;
  grid-template-columns: minmax(18rem, 1fr) auto auto;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.125rem;
  border-top: 1px solid #edf1f5;
  padding-top: 1.125rem;
}

.books-page__search {
  position: relative;
}

.books-page__search input {
  width: 100%;
  height: 3rem;
  border: 1px solid #d6e0ea;
  border-radius: 0.75rem;
  background: #f8fafc;
  padding: 0 3.25rem 0 2.75rem;
  color: #213c55;
  font-size: 0.875rem;
  line-height: 1.5;
  outline: none;
  transition: border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease;
}

.books-page__search input::placeholder {
  color: #65798e;
}

.books-page__search input:hover {
  border-color: #b9c8d8;
}

.books-page__search input:focus-visible {
  border-color: #6f95bd;
  background: #fff;
  box-shadow: 0 0 0 4px #edf4fa;
}

.books-page__search-clear {
  position: absolute;
  top: 50%;
  right: 0.375rem;
  display: flex;
  width: 2.25rem;
  height: 2.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  color: #6e8197;
  transform: translateY(-50%);
  transition: background-color 150ms ease, color 150ms ease;
}

.books-page__search-clear:hover {
  background: #edf3f8;
  color: #1d486e;
}

.books-page__search-clear:focus-visible,
.books-page__reset:focus-visible,
.books-page__shelf-list button:focus-visible,
.books-page__active-filters button:focus-visible {
  outline: 2px solid #7398bd;
  outline-offset: 2px;
}

.books-page__result-count {
  white-space: nowrap;
  color: #5d7289;
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
}

.books-page__result-count strong {
  color: #203c57;
  font-weight: 700;
}

.books-page__reset {
  display: inline-flex;
  min-height: 2.5rem;
  align-items: center;
  gap: 0.4rem;
  border-radius: 0.625rem;
  padding: 0 0.75rem;
  color: #44617d;
  font-size: 0.75rem;
  font-weight: 650;
  transition: background-color 150ms ease, color 150ms ease;
}

.books-page__reset:hover {
  background: #edf3f8;
  color: #183d60;
}

.books-page__shelves {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  margin-top: 1rem;
  border-top: 1px solid #edf1f5;
  padding-top: 1rem;
}

.books-page__shelves-label {
  flex: 0 0 auto;
  padding-top: 0.625rem;
  color: #61758a;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.books-page__shelf-list {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.books-page__shelf-list button {
  display: inline-flex;
  min-height: 2.5rem;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #dfe6ed;
  border-radius: 0.625rem;
  background: #fff;
  padding: 0.375rem 0.625rem 0.375rem 0.75rem;
  color: #50677f;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  transition: border-color 150ms ease, background-color 150ms ease, color 150ms ease, transform 150ms ease;
}

.books-page__shelf-list button span {
  display: inline-flex;
  min-width: 1.5rem;
  height: 1.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  background: #eef3f7;
  color: #64798f;
  font-size: 0.6875rem;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
}

.books-page__shelf-list button:hover {
  border-color: #bfccd9;
  background: #f8fafc;
  color: #203f5c;
}

.books-page__shelf-list button:active {
  transform: translateY(1px);
}

.books-page__shelf-list .books-page__shelf--active {
  border-color: #173c5e;
  background: #173c5e;
  color: #fff;
}

.books-page__shelf-list .books-page__shelf--active span {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

.books-page__active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.875rem;
  border-top: 1px solid #edf1f5;
  padding-top: 0.875rem;
}

.books-page__active-filters button {
  display: inline-flex;
  min-height: 2rem;
  align-items: center;
  gap: 0.35rem;
  border-radius: 999px;
  background: #eaf1f7;
  padding: 0.25rem 0.5rem 0.25rem 0.75rem;
  color: #284b69;
  font-size: 0.6875rem;
  font-weight: 650;
  transition: background-color 150ms ease, color 150ms ease;
}

.books-page__active-filters button:hover {
  background: #dce8f2;
  color: #173c5e;
}

.books-page__catalog {
  position: relative;
  z-index: 1;
  height: 35.5rem;
  overflow: hidden;
  border: 1px solid var(--books-line);
  border-radius: 0 0 1.125rem 1.125rem;
  background: #fff;
  box-shadow: 0 8px 28px rgba(26, 55, 81, 0.06);
}

.books-page__catalog-header {
  display: flex;
  min-height: 4.75rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid #e3e9ef;
  background: #fbfcfd;
  padding: 0.875rem 1.375rem;
}

.books-page__catalog-title {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.75rem;
}

.books-page__catalog-icon {
  display: flex;
  width: 2.25rem;
  height: 2.25rem;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 1px solid #d8e3ed;
  border-radius: 0.625rem;
  background: #fff;
  color: #315a7b;
  box-shadow: 0 1px 2px rgba(21, 52, 79, 0.04);
}

.books-page__catalog-title h2 {
  color: var(--books-ink);
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 650;
  line-height: 1.25;
}

.books-page__catalog-title p {
  margin-top: 0.2rem;
  color: #62768b;
  font-size: 0.6875rem;
}

.books-page__catalog :deep(.ag-header) {
  background: #f6f8fa;
  border-bottom-color: #dfe6ed;
}

.books-page__catalog :deep(.ag-header-cell-text) {
  color: #6e8195;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.books-page__catalog :deep(.ag-header-cell:hover) {
  background: #eef3f7;
}

.books-page__catalog :deep(.ag-row) {
  border-bottom-color: #e8edf2;
}

.books-page__catalog :deep(.ag-row-odd) {
  background: #fbfcfd;
}

.books-page__catalog :deep(.ag-row-hover) {
  background: #f2f6f9;
  box-shadow: inset 3px 0 0 #d4a233;
}

.books-page__catalog :deep(.ag-row-selected) {
  background: #eaf1f7;
}

.books-page__catalog :deep(.book-index-cell) {
  color: #6e8194;
  font-size: 0.6875rem;
  font-variant-numeric: tabular-nums;
  font-weight: 650;
  letter-spacing: 0.08em;
}

.books-page__catalog :deep(.ag-paging-panel) {
  background: #f8fafc;
}

.books-page__catalog :deep(.ag-root-wrapper) {
  border-radius: 0 0 1.125rem 1.125rem;
}

.books-page__empty {
  display: flex;
  min-height: 22rem;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1.5rem;
  text-align: center;
}

.books-page__empty-icon {
  display: flex;
  width: 3.25rem;
  height: 3.25rem;
  align-items: center;
  justify-content: center;
  border: 1px solid #dce5ed;
  border-radius: 1rem;
  background: #f4f7fa;
  color: #41627f;
  transform: rotate(-3deg);
}

.books-page__empty h2,
.books-page__empty h3 {
  margin-top: 1rem;
  color: var(--books-ink);
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 650;
  letter-spacing: -0.025em;
}

.books-page__empty p {
  max-width: 28rem;
  margin-top: 0.45rem;
  color: #6d8094;
  font-size: 0.8125rem;
  line-height: 1.6;
}

.books-page__empty :deep(button) {
  margin-top: 1.25rem;
}

.books-modal__header {
  background: linear-gradient(180deg, #ffffff 0%, #fbfcfd 100%);
}

.books-modal__body :deep(input),
.books-modal__body :deep(textarea) {
  transition: border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease;
}

.books-modal__footer {
  box-shadow: 0 -1px 0 rgba(220, 229, 239, 0.7);
}

.books-modal__footer button {
  min-height: 2.75rem;
}

@media (max-width: 1023px) {
  .books-hero__main {
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }

  .books-hero__collection {
    display: none;
  }
}

@media (max-width: 767px) {
  .books-page {
    gap: 1rem;
  }

  .books-hero {
    border-radius: 1rem;
  }

  .books-hero__main {
    padding: 1.75rem 1.375rem 1.5rem;
  }

  .books-hero__title {
    max-width: 12ch;
    margin-top: 0.875rem;
    font-size: clamp(2rem, 10vw, 2.75rem);
  }

  .books-hero__description {
    margin-top: 0.875rem;
    font-size: 0.875rem;
  }

  .books-hero__action {
    width: 100%;
    justify-content: center;
    margin-top: 1.25rem;
  }

  .books-hero__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .books-hero__stats > div {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.875rem 1rem;
  }

  .books-hero__stats > div:nth-child(2) {
    border-right: 0;
  }

  .books-hero__stats > div:nth-last-child(-n + 2) {
    border-bottom: 0;
  }

  .books-hero__stats dt {
    font-size: 0.625rem;
  }

  .books-hero__stats dd {
    font-size: 1.15rem;
  }

  .books-page__filters {
    margin-top: 0;
    border-radius: 1rem;
    padding: 1rem;
    box-shadow: 0 6px 20px rgba(26, 55, 81, 0.05);
  }

  .books-page__toolbar-status {
    display: none;
  }

  .books-page__toolbar-controls {
    grid-template-columns: 1fr auto;
    gap: 0.625rem;
  }

  .books-page__search {
    grid-column: 1 / -1;
  }

  .books-page__search input {
    height: 3.25rem;
    font-size: 1rem;
  }

  .books-page__result-count {
    font-size: 0.75rem;
  }

  .books-page__reset {
    min-height: 2.75rem;
  }

  .books-page__shelves {
    flex-direction: column;
    gap: 0.625rem;
  }

  .books-page__shelves-label {
    padding-top: 0;
  }

  .books-page__shelf-list {
    width: 100%;
  }

  .books-page__shelf-list button {
    min-height: 2.75rem;
  }
}

@media (max-width: 420px) {
  .books-hero__eyebrow {
    font-size: 0.625rem;
  }

  .books-hero__stats > div {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.25rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .books-hero__action,
  .books-page__search input,
  .books-page__search-clear,
  .books-page__reset,
  .books-page__shelf-list button,
  .books-page__active-filters button {
    transition: none;
  }
}
</style>
