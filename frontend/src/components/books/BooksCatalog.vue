<script setup lang="ts">
import { computed } from 'vue'
import type { ColDef, GetRowIdParams, GridApi } from 'ag-grid-community'
import type { Book } from '../../services/books'

const gridApi = defineModel<GridApi<Book> | null>('api')

const props = defineProps<{
  rows: Book[]
  visibleBooks: Book[]
  columns: ColDef<Book>[]
  getRowId: (params: GetRowIdParams) => string
  hasLoadError: boolean
}>()

const emit = defineEmits<{
  add: []
  reset: []
}>()

const hasRows = computed(() => props.rows.length > 0)
const showGrid = computed(() => !props.hasLoadError && hasRows.value && props.visibleBooks.length > 0)
const emptyTitle = computed(() => (hasRows.value ? 'No books match this view' : 'The shelves are waiting'))
const emptyDescription = computed(() =>
  hasRows.value
    ? 'Try a broader search or reset the selected shelves.'
    : 'Add the first title to begin building the Athenaeum collection.'
)
</script>

<template>
  <section
    class="books-catalog"
    aria-labelledby="catalog-heading"
  >
    <header class="books-catalog__header">
      <div class="books-catalog__title">
        <span
          class="books-catalog__icon"
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
      <div class="books-catalog__meta">
        <span
          class="size-1.5 rounded-full bg-[#20876e]"
          aria-hidden="true"
        />
        Inventory view
      </div>
    </header>

    <div
      v-if="showGrid"
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
      v-else-if="!hasLoadError"
      class="books-catalog__empty"
    >
      <span
        class="books-catalog__empty-icon"
        aria-hidden="true"
      >
        <UIcon
          :name="hasRows ? 'i-lucide-search-x' : 'i-lucide-library-big'"
          class="size-6"
        />
      </span>
      <h3>{{ emptyTitle }}</h3>
      <p>{{ emptyDescription }}</p>
      <UButton
        v-if="!hasRows"
        icon="i-lucide-plus"
        class="!min-h-11 !rounded-[10px] !px-5"
        @click="emit('add')"
      >
        Add a title
      </UButton>
      <UButton
        v-else
        color="neutral"
        variant="outline"
        icon="i-lucide-rotate-ccw"
        class="!min-h-11 !rounded-[10px] !px-5"
        @click="emit('reset')"
      >
        Reset view
      </UButton>
    </div>
  </section>
</template>

<style scoped>
.books-catalog {
  position: relative;
  z-index: 1;
  /* Flex column is required: the grid below resolves `height: 100%` against this
     element, so a block container collapses the row viewport to zero height. */
  display: flex;
  flex-direction: column;
  flex: 1 1 62%;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  border: 1px solid #dce5ee;
  border-radius: 0 0 0.8rem 0.8rem;
  background: #fff;
  box-shadow: 0 8px 24px rgba(26, 55, 81, 0.055);
}

.books-catalog__header {
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

.books-catalog__title {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.625rem;
}

.books-catalog__icon {
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

.books-catalog__title h2 {
  color: #102f49;
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 650;
  line-height: 1.25;
}

.books-catalog__title p {
  margin-top: 0.1rem;
  color: #62768b;
  font-size: 0.625rem;
}

.books-catalog__meta {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: #64788f;
  font-size: 0.6875rem;
  font-weight: 650;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.books-catalog__empty {
  display: flex;
  min-height: 22rem;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1.5rem;
  text-align: center;
}

.books-catalog__empty-icon {
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

.books-catalog__empty h3 {
  margin-top: 1rem;
  color: #102f49;
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 650;
  letter-spacing: -0.025em;
}

.books-catalog__empty p {
  max-width: 28rem;
  margin-top: 0.45rem;
  color: #6d8094;
  font-size: 0.8125rem;
  line-height: 1.6;
}

.books-catalog__empty :deep(button) {
  margin-top: 1.25rem;
}
</style>