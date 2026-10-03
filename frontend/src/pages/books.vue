<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { ColDef, GetRowIdParams, ICellRendererParams } from 'ag-grid-community'
import ActionsCell from '../components/grid/ActionsCell.vue'
import BookTitleCell from '../components/grid/BookTitleCell.vue'
import CategoryCell from '../components/grid/CategoryCell.vue'
import CopiesCell from '../components/grid/CopiesCell.vue'
import type { FormError } from '@nuxt/ui'
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
    cellClass: 'book-title-column'
  },
  {
    headerName: 'Author',
    colId: 'authors',
    flex: 1.6,
    minWidth: 170,
    valueGetter: (params) => (params.data?.authors ?? []).map((author) => author.name).join(', '),
    cellClass: 'author-column'
  },
  {
    headerName: 'Shelf',
    colId: 'category',
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
        description: book.description ?? '',
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
  <div class="books-page workspace-page mx-auto flex min-h-0 w-full min-w-0 flex-1 flex-col gap-2 overflow-hidden">
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
            Search every title and keep every copy ready.
          </p>
          <UButton
            icon="i-lucide-plus"
            aria-label="Add book"
            class="books-hero__action !min-h-9 !rounded-[9px] !px-4 !font-bold"
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
      <div class="books-page__toolbar-main">
        <div class="books-page__toolbar-title">
          <h2>Browse the collection</h2>
        </div>

        <div class="books-page__search">
          <label
            for="books-search"
            class="sr-only"
          >Search books by title, author, description or category</label>
          <UIcon
            name="i-lucide-search"
            class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#60768c]"
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

        <div class="books-page__toolbar-meta">
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
            aria-label="Reset catalogue filters"
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
    </section>

    <section
      class="books-page__catalog flex min-h-0 min-w-0 flex-1 flex-col"
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
          :row-height="56"
          :header-height="40"
          :page-size="7"
          :page-size-selector="[7, 14, 28]"
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
  flex: 1 1 auto;
  gap: 0.5rem;
}

.books-hero {
  position: relative;
  isolation: isolate;
  flex: none;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  background: #102f49;
  color: #f8fafc;
  box-shadow: 0 10px 28px rgba(15, 42, 65, 0.11);
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
  grid-template-columns: minmax(0, 1.45fr) minmax(17rem, 0.55fr);
  gap: 1.25rem;
  padding: 1rem 1.5rem 0.75rem;
}

.books-hero__copy {
  min-width: 0;
  align-self: center;
}

.books-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #b8c8d6;
  font-size: 0.6875rem;
  font-weight: 650;
}

.books-hero__title {
  margin-top: 0.35rem;
  color: #f8fafc;
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 2.5vw, 2.3rem);
  font-weight: 650;
  letter-spacing: -0.05em;
  line-height: 1.04;
}

.books-hero__description {
  max-width: 35rem;
  margin-top: 0.3rem;
  color: #c6d3df;
  font-size: 0.8125rem;
  line-height: 1.4;
}

.books-hero__action {
  margin-top: 0.5rem;
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
  gap: 0.6rem;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
  padding-left: 1rem;
}

.books-hero__book-stack {
  position: relative;
  width: 8.5rem;
  height: 5.5rem;
  flex: 0 0 auto;
}

.books-hero__book {
  position: absolute;
  display: flex;
  width: 2.65rem;
  height: 4.65rem;
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
  top: 0.65rem;
  left: 0.25rem;
  background: #d8a536;
  color: #17334b;
  transform: rotate(-8deg);
}

.books-hero__book--two {
  z-index: 2;
  top: 0.05rem;
  left: 2.7rem;
  background: #e7edf2;
  color: #17334b;
}

.books-hero__book--three {
  top: 0.7rem;
  left: 5.2rem;
  background: #356b83;
  color: #f4f7fa;
  transform: rotate(8deg);
}

.books-hero__health {
  min-width: 7rem;
}

.books-hero__health p {
  color: #aebfce;
  font-size: 0.625rem;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.books-hero__health strong {
  display: block;
  margin-top: 0.2rem;
  color: #f8fafc;
  font-family: var(--font-display);
  font-size: 1.55rem;
  font-weight: 650;
  letter-spacing: -0.05em;
  line-height: 1;
}

.books-hero__health span {
  display: block;
  margin-top: 0.2rem;
  color: #b9c8d5;
  font-size: 0.625rem;
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
  padding: 0.35rem 0.9rem;
}

.books-hero__stats > div:last-child {
  border-right: 0;
}

.books-hero__stats dt {
  color: #aebfce;
  font-size: 0.625rem;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.books-hero__stats dd {
  color: #f8fafc;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 650;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.035em;
}

.books-page__filters {
  position: relative;
  z-index: 2;
  flex: none;
  margin-top: -0.5rem;
  margin-bottom: -1px;
  border: 1px solid var(--books-line);
  border-radius: 0.8rem 0.8rem 0 0;
  background: #fff;
  padding: 0.45rem 0.75rem 0.4rem;
  box-shadow: 0 8px 20px rgba(26, 55, 81, 0.06);
}

.books-page__toolbar-main {
  display: grid;
  grid-template-columns: minmax(9rem, 0.55fr) minmax(16rem, 1.45fr) auto;
  align-items: center;
  gap: 0.65rem;
}

.books-page__toolbar-title h2 {
  color: var(--books-ink);
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 650;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.books-page__toolbar-meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}

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

.books-page__search {
  position: relative;
}

.books-page__search input {
  width: 100%;
  height: 2.25rem;
  border: 1px solid #d6e0ea;
  border-radius: 0.55rem;
  background: #f8fafc;
  padding: 0 2.2rem 0 2.1rem;
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
  right: 0.2rem;
  display: flex;
  width: 1.75rem;
  height: 1.75rem;
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
.books-page__shelf-list button:focus-visible {
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
  min-height: 2rem;
  align-items: center;
  gap: 0.3rem;
  border-radius: 0.45rem;
  padding: 0 0.5rem;
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
  gap: 0.5rem;
  margin-top: 0.4rem;
  border-top: 1px solid #edf1f5;
  padding-top: 0.4rem;
}

.books-page__shelves-label {
  flex: 0 0 auto;
  padding-top: 0.35rem;
  color: #61758a;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.books-page__shelf-list {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.books-page__shelf-list button {
  display: inline-flex;
  min-height: 1.8rem;
  align-items: center;
  gap: 0.35rem;
  border: 1px solid #dfe6ed;
  border-radius: 0.45rem;
  background: #fff;
  padding: 0.18rem 0.4rem 0.18rem 0.5rem;
  color: #50677f;
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1;
  transition: border-color 150ms ease, background-color 150ms ease, color 150ms ease, transform 150ms ease;
}

.books-page__shelf-list button span {
  display: inline-flex;
  min-width: 1.1rem;
  height: 1.1rem;
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

.books-page__catalog {
  position: relative;
  z-index: 1;
  flex: 1 1 62%;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--books-line);
  border-radius: 0 0 0.8rem 0.8rem;
  background: #fff;
  box-shadow: 0 8px 24px rgba(26, 55, 81, 0.055);
}

.books-page__catalog-header {
  display: flex;
  min-height: 3rem;
  flex: none;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid #e3e9ef;
  background: #fbfcfd;
  padding: 0.5rem 0.75rem;
}

.books-page__catalog-title {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.625rem;
}

.books-page__catalog-icon {
  display: flex;
  width: 2rem;
  height: 2rem;
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
  margin-top: 0.1rem;
  color: #62768b;
  font-size: 0.625rem;
}

.books-page__catalog :deep(.ag-header) {
  background: #eef3f7;
  border-bottom-color: #cfdbe7;
  box-shadow: inset 0 -1px 0 #d7e1ea;
}

.books-page__catalog :deep(.ag-header-cell-text) {
  color: #61768c;
  font-size: 0.625rem;
  font-weight: 750;
  letter-spacing: 0.1em;
}

.books-page__catalog :deep(.ag-header-cell:hover) {
  background: #e6eef5;
}

.books-page__catalog :deep(.ag-row) {
  border-bottom-color: #dfe7ee;
}

.books-page__catalog :deep(.ag-row-even) {
  background: #fff;
}

.books-page__catalog :deep(.ag-row-odd) {
  background: #f8fafc;
}

.books-page__catalog :deep(.ag-row-hover) {
  background: #f0f5f9;
  box-shadow:
    inset 3px 0 0 #d6a433,
    inset 0 0 0 1px rgba(116, 148, 177, 0.16);
}

.books-page__catalog :deep(.ag-row-selected) {
  background: #e9f1f7;
  box-shadow: inset 3px 0 0 #2b5b86;
}

.books-page__catalog :deep(.ag-cell) {
  padding-inline: 12px;
  border-right-color: rgba(218, 226, 234, 0.7);
  color: #304a62;
}

.books-page__catalog :deep(.ag-cell.book-title-column) {
  position: relative;
  background: rgba(237, 243, 248, 0.38);
  padding-inline: 10px 12px;
}

.books-page__catalog :deep(.ag-cell.book-title-column::before) {
  position: absolute;
  top: 5px;
  bottom: 5px;
  left: 0;
  width: 2px;
  border-radius: 0 999px 999px 0;
  background: #d6a433;
  content: '';
  opacity: 0.28;
  transition: opacity 150ms ease;
}

.books-page__catalog :deep(.ag-row:hover .ag-cell.book-title-column::before) {
  opacity: 1;
}

.books-page__catalog :deep(.ag-cell.author-column) {
  color: #294963;
  font-weight: 550;
}

.books-page__catalog :deep(.ag-cell.category-column),
.books-page__catalog :deep(.ag-cell.stock-column) {
  padding-inline: 8px;
}

.books-page__catalog :deep(.book-index-cell) {
  color: #7890a4;
  font-size: 0.625rem;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.books-page__catalog :deep(.ag-paging-panel) {
  background: #f7f9fb;
  color: #64788d;
  font-size: 0.6875rem;
}

.books-page__catalog :deep(.ag-root-wrapper) {
  border-radius: 0 0 0.8rem 0.8rem;
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
    gap: 0;
  }

  .books-hero__collection {
    display: none;
  }
}

@media (max-width: 767px) {
  .books-page {
    gap: 0.4rem;
  }

  .books-hero {
    border-radius: 0.8rem;
  }

  .books-hero__main {
    padding: 0.875rem 1rem 0.75rem;
  }

  .books-hero__title {
    margin-top: 0.25rem;
    font-size: clamp(1.6rem, 8vw, 2rem);
  }

  .books-hero__description {
    margin-top: 0.25rem;
    font-size: 0.75rem;
  }

  .books-hero__action {
    margin-top: 0.4rem;
  }

  .books-hero__stats {
    display: none;
  }

  .books-page__filters {
    margin-top: 0;
    border-radius: 0.8rem;
    padding: 0.5rem;
    box-shadow: 0 5px 16px rgba(26, 55, 81, 0.05);
  }

  .books-page__toolbar-main {
    grid-template-columns: 1fr auto;
    gap: 0.4rem;
  }

  .books-page__toolbar-title {
    grid-column: 1;
  }

  .books-page__toolbar-meta {
    grid-column: 2;
  }

  .books-page__search {
    grid-row: 2;
    grid-column: 1 / -1;
  }

  .books-page__search input {
    height: 2.5rem;
    font-size: 0.875rem;
  }

  .books-page__reset {
    min-height: 2rem;
  }

  .books-page__shelves {
    gap: 0.4rem;
  }

  .books-page__shelves-label {
    padding-top: 0.4rem;
  }

  .books-page__shelf-list {
    width: 100%;
  }

  .books-page__shelf-list button {
    min-height: 2.25rem;
  }
}

@media (max-height: 780px) and (min-width: 1024px) {
  .books-hero__main {
    grid-template-columns: 1fr;
  }

  .books-hero__collection,
  .books-hero__description {
    display: none;
  }

  .books-hero__stats > div {
    padding-block: 0.25rem;
  }
}

@media (max-width: 420px) {
  .books-hero__eyebrow {
    font-size: 0.625rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .books-hero__action,
  .books-page__search input,
  .books-page__search-clear,
  .books-page__reset,
  .books-page__shelf-list button {
    transition: none;
  }
}
</style>
