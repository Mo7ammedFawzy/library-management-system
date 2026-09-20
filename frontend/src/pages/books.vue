<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { ColDef, GetRowIdParams, ICellRendererParams } from 'ag-grid-community'
import ActionsCell from '../components/grid/ActionsCell.vue'
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
    headerName: '#',
    sortable: false,
    filter: false,
    width: 48,
    valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
    cellStyle: { textAlign: 'center' },
    cellClass: 'text-dimmed'
  },
  {
    field: 'title',
    headerName: 'Title',
    flex: 2,
    minWidth: 150,
    cellStyle: { fontWeight: 500, lineHeight: '21px' },
    cellClass: 'text-highlighted'
  },
  {
    headerName: 'Authors',
    flex: 2,
    minWidth: 140,
    valueGetter: (params) => (params.data as Book).authors.map((author) => author.name).join(', ')
  },
  {
    headerName: 'Category',
    flex: 1,
    minWidth: 120,
    valueGetter: (params) => (params.data as Book).category.name,
    filter: 'agTextColumnFilter'
  },
  {
    field: 'availableCopies',
    headerName: 'Copies',
    width: 88,
    minWidth: 76,
    sortable: true,
    filter: false,
    headerClass: 'ag-center-aligned-header',
    cellStyle: { textAlign: 'center', fontVariantNumeric: 'tabular-nums' },
    cellClass: 'tabular-nums'
  },
  {
    headerName: 'Actions',
    sortable: false,
    filter: false,
    width: 96,
    minWidth: 88,
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
    const haystack = [book.title, book.category.name, ...book.authors.map((author) => author.name)]
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
})

const totalCopies = computed(() =>
  rows.value.reduce((total, book) => total + (Number(book.availableCopies) || 0), 0)
)

const categoryCount = computed(() => categories.value.length)

const lowStockCount = computed(() =>
  rows.value.filter((book) => (Number(book.availableCopies) || 0) <= 2).length
)

const hasActiveFilters = computed(() => categoryFilters.value.length > 0 || search.value.trim().length > 0)

const bookStats = computed(() => [
  {
    label: 'Total titles',
    value: rows.value.length,
    detail: `${categoryCount.value} categories`,
    icon: 'i-lucide-library-big',
    iconClass: 'bg-[#edf4ff] text-[#2161bf]',
    dotClass: 'bg-[#2161bf]'
  },
  {
    label: 'Available copies',
    value: totalCopies.value,
    detail: 'Ready to borrow',
    icon: 'i-lucide-book-check',
    iconClass: 'bg-[#eaf7f2] text-[#20876e]',
    dotClass: 'bg-[#20876e]'
  },
  {
    label: 'Categories',
    value: categoryCount.value,
    detail: 'Across the catalog',
    icon: 'i-lucide-tags',
    iconClass: 'bg-[#fff6e5] text-[#b76c00]',
    dotClass: 'bg-[#e5a214]'
  },
  {
    label: 'Low stock',
    value: lowStockCount.value,
    detail: lowStockCount.value ? '2 or fewer copies' : 'All stocked up',
    icon: 'i-lucide-triangle-alert',
    iconClass: 'bg-[#fff0ee] text-[#d84332]',
    dotClass: 'bg-[#d84332]'
  }
])

function clearSearch() {
  search.value = ''
}

function removeCategoryFilter(category: string) {
  categoryFilters.value = categoryFilters.value.filter((name) => name !== category)
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
  base: '!rounded-xl !bg-(--ui-bg-card) !py-3 !text-sm !ring-(--ui-border) !placeholder:text-muted focus-visible:!ring-2 focus-visible:!ring-primary focus-visible:!outline-none'
}

const copiesUi = {
  ...fieldUi,
  trailing: '!pe-0',
  base: `${fieldUi.base} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`
}
</script>

<template>
  <div class="mx-auto flex w-full max-w-[1400px] min-w-0 flex-none flex-col gap-5 overflow-x-clip pb-2 md:min-h-0 md:flex-1">
    <UBreadcrumb :items="breadcrumbItems">
      <template #item="{ item }">
        <RouterLink
          v-if="item.to"
          :to="item.to"
          class="flex items-center gap-1.5 rounded text-sm text-muted transition-colors motion-reduce:transition-none hover:text-highlighted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ca9ce] focus-visible:ring-offset-1"
        >
          <UIcon
            v-if="item.icon"
            :name="item.icon"
            class="size-4 text-muted"
            aria-hidden="true"
          />
          {{ item.label }}
        </RouterLink>
        <span
          v-else
          class="flex items-center gap-1.5 text-sm font-semibold text-highlighted"
          aria-current="page"
        >
          <UIcon
            v-if="item.icon"
            :name="item.icon"
            class="size-4 text-muted"
            aria-hidden="true"
          />
          {{ item.label }}
        </span>
      </template>
      <template #separator>
        <UIcon name="i-lucide-chevron-right" class="size-3.5 text-muted" aria-hidden="true" />
      </template>
    </UBreadcrumb>

    <section class="flex flex-col justify-between gap-4 lg:flex-row lg:items-end" aria-labelledby="books-heading">
      <div>
        <p class="mb-2.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a99ae]">
          <span class="h-[3px] w-8 rounded-full bg-[#e5a214]" aria-hidden="true" />
          Library manager · Catalog
        </p>
        <h1 id="books-heading" class="flex flex-wrap items-center gap-3 font-serif text-3xl font-bold tracking-[-0.035em] text-[#132f57] sm:text-[2rem]">
          Books
          <span class="inline-flex items-center rounded-full bg-[#edf4ff] px-2.5 py-1 font-sans text-[11px] font-bold leading-4 tracking-normal text-[#173b70]">
            {{ rows.length }} {{ rows.length === 1 ? 'title' : 'titles' }}
          </span>
        </h1>
        <p class="mt-1.5 max-w-md text-sm leading-relaxed text-[#667896]">
          Manage and organize all library books — search the catalog, filter by category, and keep copies stocked.
        </p>
      </div>

      <UButton
        icon="i-lucide-plus"
        aria-label="Add book"
        class="!h-10 shrink-0 !rounded-xl !px-4 shadow-sm motion-reduce:transition-none focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-[#8ca9ce] focus-visible:!ring-offset-1"
        @click="openAdd"
      >
        Add Book
      </UButton>
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

    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Catalog statistics">
      <article
        v-for="stat in bookStats"
        :key="stat.label"
        class="group rounded-2xl border border-[#e4ebf3] bg-white p-5 shadow-[0_8px_24px_rgba(27,59,102,0.045)] transition-all duration-150 hover:-translate-y-0.5 hover:border-[#cdd9e8] hover:shadow-[0_12px_32px_rgba(27,59,102,0.08)] motion-reduce:transform-none motion-reduce:transition-none"
      >
        <div class="flex items-start gap-4">
          <div class="flex size-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ring-black/[0.04] transition-transform duration-150 group-hover:scale-[1.04] motion-reduce:transform-none" :class="stat.iconClass">
            <UIcon :name="stat.icon" class="size-5" aria-hidden="true" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7a8ba3]">{{ stat.label }}</p>
            <p class="mt-1 font-serif text-[1.75rem] font-bold leading-none tracking-[-0.04em] text-[#132f57]">
              {{ stat.value.toLocaleString() }}
            </p>
            <p class="mt-2 flex items-center gap-1.5 text-xs text-[#7a8ba3]">
              <span class="size-1.5 shrink-0 rounded-full" :class="stat.dotClass" aria-hidden="true" />
              {{ stat.detail }}
            </p>
          </div>
        </div>
      </article>
    </section>

    <section class="rounded-2xl border border-[#e4ebf3] bg-white px-3.5 py-3 shadow-[0_8px_24px_rgba(27,59,102,0.04)] sm:px-4" aria-label="Search and filter books">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div class="relative w-full lg:max-w-[420px]">
          <label for="books-search" class="sr-only">Search books by title, author or category</label>
          <UIcon
            name="i-lucide-search"
            class="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            id="books-search"
            v-model="search"
            type="search"
            placeholder="Search books by title, author or category..."
            aria-label="Search books by title, author or category"
            class="h-10 w-full rounded-xl border border-[#e4ebf3] bg-[#f9fbfe] pl-9 pr-9 text-sm leading-5 text-[#263f5f] shadow-sm outline-none transition-colors motion-reduce:transition-none placeholder:text-[#8a99ae] hover:border-[#cdd9e8] focus-visible:border-[#8ca9ce] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#edf4ff]"
          >
          <button
            v-if="search"
            type="button"
            aria-label="Clear search"
            class="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-[#8a99ae] transition-colors hover:bg-[#edf4ff] hover:text-[#173b70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ca9ce]"
            @click="clearSearch"
          >
            <UIcon name="i-lucide-x" class="size-4" aria-hidden="true" />
          </button>
        </div>

        <div class="flex flex-wrap items-center gap-2 sm:gap-3 lg:ml-auto">
          <p role="status" aria-live="polite" class="mr-auto text-xs tabular-nums text-[#7a8ba3] lg:mr-1">
            {{ visibleBooks.length }} of {{ rows.length }} shown
          </p>
          <UPopover>
            <UButton
              color="neutral"
              variant="outline"
              icon="i-lucide-filter"
              :aria-label="categoryFilters.length ? `Filters, ${categoryFilters.length} category filter${categoryFilters.length > 1 ? 's' : ''} active` : 'Filters'"
              class="!h-10 !rounded-xl !border-[#e4ebf3] !bg-white !px-4 shadow-sm motion-reduce:transition-none focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-[#8ca9ce]"
            >
              Filters
              <span
                v-if="categoryFilters.length"
                class="ml-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#edf4ff] px-1.5 text-[11px] font-bold text-[#173b70]"
              >
                {{ categoryFilters.length }}
              </span>
            </UButton>

            <template #content>
              <div class="flex w-64 flex-col gap-5 p-4">
                <div class="flex flex-col gap-2">
                  <p class="text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Category
                  </p>
                  <UCheckboxGroup
                    v-model="categoryFilters"
                    size="sm"
                    variant="list"
                    :items="categories.map((category) => category.name)"
                  />
                </div>

                <UButton
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  class="self-start"
                  @click="resetFilters"
                >
                  Clear filters
                </UButton>
              </div>
            </template>
          </UPopover>
        </div>
      </div>

      <div v-if="categoryFilters.length" class="mt-3 flex flex-wrap items-center gap-2 border-t border-[#edf1f6] pt-3" aria-label="Active category filters">
        <button
          v-for="name in categoryFilters"
          :key="name"
          type="button"
          :aria-label="`Remove ${name} filter`"
          class="inline-flex max-w-full items-center gap-1.5 truncate rounded-full bg-[#edf4ff] py-1 pl-2.5 pr-1.5 text-[11px] font-bold leading-4 text-[#173b70] ring-1 ring-inset ring-[#cdd9e8] transition-colors hover:bg-[#dce9fd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ca9ce]"
          @click="removeCategoryFilter(name)"
        >
          <span class="truncate">{{ name }}</span>
          <UIcon name="i-lucide-x" class="size-3.5 shrink-0" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="rounded-lg px-2 py-1 text-xs font-semibold text-[#667896] transition-colors hover:bg-[#f1f5fb] hover:text-[#304968] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ca9ce]"
          @click="resetFilters"
        >
          Clear all
        </button>
      </div>
    </section>

    <section class="hidden min-h-[520px] min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#e4ebf3] bg-white shadow-[0_8px_24px_rgba(27,59,102,0.05)] md:flex" aria-labelledby="catalog-heading">
      <div class="flex items-start justify-between gap-3 border-b border-[#edf1f6] px-5 pb-4 pt-5">
        <div>
          <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a99ae]">Catalog</p>
          <h2 id="catalog-heading" class="mt-1 font-serif text-lg font-bold leading-tight text-[#132f57]">Book collection</h2>
          <p class="mt-0.5 text-xs text-[#7486a0]">{{ visibleBooks.length }} of {{ rows.length }} titles{{ categoryFilters.length ? ` · ${categoryFilters.length} filter${categoryFilters.length > 1 ? 's' : ''} on` : '' }}</p>
        </div>
        <button
          v-if="hasActiveFilters"
          type="button"
          class="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-[#173b70] transition-colors hover:bg-[#edf4ff] hover:text-[#2b65ad] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ca9ce]"
          @click="clearAllFilters"
        >
          <UIcon name="i-lucide-rotate-ccw" class="size-3.5" aria-hidden="true" />
          Reset view
        </button>
      </div>
      <div
        class="flex min-h-0 flex-1 flex-col"
        role="region"
        aria-label="Books data grid"
      >
        <AppDataGrid
          v-model:api="gridApi"
          :rows="rows"
          :columns="columns"
          :quick-filter-text="search"
          :get-row-id="getRowId"
          :row-height="44"
          height="100%"
        />
      </div>
    </section>

    <div
      class="flex w-full min-w-0 flex-none flex-col gap-3 md:hidden"
      role="list"
      aria-label="Books list"
    >
      <article
        v-for="book in visibleBooks"
        :key="book.id"
        role="listitem"
        class="flex min-w-0 flex-col gap-2 overflow-hidden rounded-2xl bg-(--ui-bg-card) px-4 py-3 shadow-sm ring-1 ring-(--ui-border)"
      >
        <div class="flex min-w-0 flex-wrap items-start justify-between gap-2">
          <div class="min-w-0 flex-1 basis-40">
            <h2 class="truncate text-sm font-semibold leading-6 text-highlighted">
              {{ book.title }}
            </h2>
            <p class="mt-0.5 truncate text-sm leading-5 text-muted">
              {{ book.authors.map((author: Author) => author.name).join(', ') }}
            </p>
          </div>
          <span class="inline-flex max-w-full shrink-0 items-center truncate rounded-full bg-[#edf4ff] px-2.5 py-1 text-[11px] font-bold leading-4 text-[#173b70]">
            {{ book.category.name }}
          </span>
        </div>
        <div class="flex min-w-0 flex-wrap items-center justify-between gap-2 border-t border-(--ui-border) pt-2">
          <p class="text-sm leading-5 text-muted">
            <span class="font-semibold tabular-nums text-highlighted">{{ book.availableCopies }}</span>
            {{ book.availableCopies === 1 ? 'copy' : 'copies' }} available
          </p>
          <div class="flex shrink-0 items-center gap-1">
            <UButton
              icon="i-lucide-pencil"
              color="neutral"
              variant="ghost"
              size="sm"
              :aria-label="`Edit ${book.title}`"
              @click="openEdit(book)"
            />
            <UButton
              icon="i-lucide-trash-2"
              color="neutral"
              variant="ghost"
              size="sm"
              :aria-label="`Delete ${book.title}`"
              class="hover:!bg-red-50 hover:!text-red-600"
              @click="openDelete(book)"
            />
          </div>
        </div>
      </article>

      <div
        v-if="!loadError && visibleBooks.length === 0"
        class="flex flex-col items-center gap-2 rounded-2xl bg-(--ui-bg-card) px-6 py-10 text-center shadow-sm ring-1 ring-(--ui-border)"
      >
        <div class="flex size-11 items-center justify-center rounded-full bg-(--ui-bg-accented)">
          <UIcon name="i-lucide-book-open" class="size-5 text-muted" aria-hidden="true" />
        </div>
        <h2 class="text-sm font-semibold text-highlighted">
          {{ rows.length === 0 ? 'No books yet' : 'No books match your search' }}
        </h2>
        <p class="max-w-sm text-sm leading-6 text-muted">
          {{ rows.length === 0 ? 'Add your first book to start building the catalog. Books you add will appear here.' : 'Try a different search term or clear the category filters.' }}
        </p>
        <UButton
          v-if="rows.length === 0"
          icon="i-lucide-plus"
          class="!h-10 !rounded-xl !px-4 shadow-sm motion-reduce:transition-none focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-[#8ca9ce]"
          @click="openAdd"
        >
          Add Book
        </UButton>
        <UButton
          v-else
          color="neutral"
          variant="outline"
          size="sm"
          class="!rounded-xl"
          @click="resetFilters(); search = ''"
        >
          Clear search and filters
        </UButton>
      </div>
    </div>

    <p role="status" aria-live="polite" class="sr-only">
      {{ visibleBooks.length }} of {{ rows.length }} books shown
    </p>

    <div
      v-if="!loadError && rows.length === 0"
      class="mt-3 hidden flex-col items-center gap-2 rounded-2xl bg-(--ui-bg-card) px-6 py-10 text-center shadow-sm ring-1 ring-(--ui-border) md:flex"
    >
      <div class="flex size-11 items-center justify-center rounded-full bg-(--ui-bg-accented)">
        <UIcon name="i-lucide-book-open" class="size-5 text-muted" aria-hidden="true" />
      </div>
      <h2 class="text-sm font-semibold text-highlighted">
        No books yet
      </h2>
      <p class="max-w-sm text-sm leading-6 text-muted">
        Add your first book to start building the catalog. Books you add will appear in this table.
      </p>
      <UButton
        icon="i-lucide-plus"
        class="!h-10 !rounded-xl !px-4 shadow-sm motion-reduce:transition-none focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-[#8ca9ce]"
        @click="openAdd"
      >
        Add Book
      </UButton>
    </div>

    <UModal
      v-model:open="formOpen"
      :title="editingItem ? 'Edit Book' : 'Add Book'"
      :description="editingItem ? 'Update book details' : 'Add a new book to your library'"
      :ui="{
        overlay: '!bg-black/20 backdrop-blur-sm',
        content: '!max-w-2xl !rounded-xl !bg-(--ui-bg-card) !shadow-[0_8px_32px_rgba(0,0,0,0.04)] !ring-0 border border-(--ui-border)'
      }"
    >
      <template #content="{ close }">
        <div class="flex flex-col">
          <div class="flex shrink-0 items-center justify-between gap-4 border-b border-(--ui-border) px-4 py-3">
            <div class="flex items-center gap-4">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-(--ui-bg-accented)">
                <UIcon
                  name="i-lucide-book-open"
                  class="text-lg text-highlighted"
                />
              </div>
              <div>
                <h2 class="font-serif text-[20px] font-bold leading-tight text-highlighted">
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

          <div class="grow overflow-y-auto py-2 px-3">
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

          <div class="flex shrink-0 items-center justify-end gap-2 border-t border-(--ui-border) bg-(--ui-bg-accented) px-4 py-3">
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
          <div class="flex shrink-0 items-center justify-between gap-4 border-b border-(--ui-border) px-4 py-3">
            <div class="flex items-center gap-4">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50">
                  <UIcon
                    name="i-lucide-trash-2"
                    class="text-lg text-red-600"
                  />
              </div>
              <div>
                <h2 class="font-serif text-[20px] font-bold leading-tight text-highlighted">
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

          <div class="flex shrink-0 items-center justify-end gap-2 border-t border-(--ui-border) bg-(--ui-bg-accented) px-4 py-3">
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
