<script setup lang="ts">
import { useBooksPage } from '../composables/useBooksPage'
import BookFormModal from '../components/books/BookFormModal.vue'
import BooksCatalog from '../components/books/BooksCatalog.vue'
import BooksFilters from '../components/books/BooksFilters.vue'
import BooksHero from '../components/books/BooksHero.vue'
import DeleteConfirmModal from '../components/DeleteConfirmModal.vue'
import ErrorAlert from '../components/ErrorAlert.vue'

const {
  rows,
  gridApi,
  search,
  loadError,
  formOpen,
  form,
  editingItem,
  saving,
  formError,
  deleteTarget,
  deleting,
  deleteError,
  deleteModalOpen,
  visibleBooks,
  totalCopies,
  lowStockCount,
  collectionHealth,
  categoryCounts,
  categoryFilters,
  categoryOptions,
  authorOptions,
  hasActiveFilters,
  columns,
  getRowId,
  validate,
  openAdd,
  submitForm,
  confirmDelete,
  selectAllCategories,
  clearAllFilters,
  incrementCopies,
  decrementCopies
} = useBooksPage()
</script>

<template>
  <div class="books-page workspace-page mx-auto flex min-h-0 w-full min-w-0 flex-1 flex-col gap-2 overflow-hidden">
    <BooksHero
      :total-titles="rows.length"
      :total-copies="totalCopies"
      :shelf-count="categoryCounts.length"
      :low-stock-count="lowStockCount"
      :collection-health="collectionHealth"
      @add="openAdd"
    />

    <ErrorAlert
      v-if="loadError"
      :message="loadError"
    />

    <BooksFilters
      v-model:search="search"
      v-model:active-categories="categoryFilters"
      :total-count="rows.length"
      :visible-count="visibleBooks.length"
      :has-active-filters="hasActiveFilters"
      :shelves="categoryCounts"
      @clear-all="clearAllFilters"
      @select-all="selectAllCategories"
    />

    <BooksCatalog
      v-model:api="gridApi"
      :rows="rows"
      :visible-books="visibleBooks"
      :columns="columns"
      :get-row-id="getRowId"
      :has-load-error="Boolean(loadError)"
      @add="openAdd"
      @reset="clearAllFilters"
    />

    <p
      role="status"
      aria-live="polite"
      class="sr-only"
    >
      {{ visibleBooks.length }} of {{ rows.length }} books shown
    </p>

    <BookFormModal
      v-model:open="formOpen"
      v-model:form="form"
      :editing="editingItem !== null"
      :category-options="categoryOptions"
      :author-options="authorOptions"
      :error="formError"
      :saving="saving"
      :validate="validate"
      @submit="submitForm"
      @increment-copies="incrementCopies"
      @decrement-copies="decrementCopies"
    />

    <DeleteConfirmModal
      v-model:open="deleteModalOpen"
      entity-name="Book"
      :target-label="deleteTarget?.title ?? ''"
      :error="deleteError"
      :deleting="deleting"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.books-page {
  gap: 0.5rem;
}

.books-page :deep(.ag-header) {
  background: #eef3f7;
  border-bottom-color: #cfdbe7;
  box-shadow: inset 0 -1px 0 #d7e1ea;
}

.books-page :deep(.ag-header-cell-text) {
  color: #61768c;
  font-size: 0.625rem;
  font-weight: 750;
  letter-spacing: 0.1em;
}

.books-page :deep(.ag-header-cell:hover) {
  background: #e6eef5;
}

.books-page :deep(.ag-row) {
  border-bottom-color: #dfe7ee;
}

.books-page :deep(.ag-row-even) {
  background: #fff;
}

.books-page :deep(.ag-row-odd) {
  background: #f8fafc;
}

.books-page :deep(.ag-row-hover) {
  background: #f0f5f9;
  box-shadow:
    inset 3px 0 0 #d6a433,
    inset 0 0 0 1px rgba(116, 148, 177, 0.16);
}

.books-page :deep(.ag-row-selected) {
  background: #e9f1f7;
  box-shadow: inset 3px 0 0 #2b5b86;
}

.books-page :deep(.ag-cell) {
  padding-inline: 12px;
  border-right-color: rgba(218, 226, 234, 0.7);
  color: #304a62;
}

/* No `position` override here: AG Grid v36 positions every `.ag-cell` absolutely
   and offsets the rest of the row by this cell's height if only one cell is put
   back into flow, which shifts Author/Shelf/Stock one row down. */
.books-page :deep(.ag-cell.book-title-column) {
  background: rgba(237, 243, 248, 0.38);
  padding-inline: 10px 12px;
}

.books-page :deep(.ag-cell.book-title-column::before) {
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

.books-page :deep(.ag-row:hover .ag-cell.book-title-column::before) {
  opacity: 1;
}

.books-page :deep(.ag-cell.author-column) {
  color: #294963;
  font-weight: 550;
}

.books-page :deep(.ag-cell.category-column),
.books-page :deep(.ag-cell.stock-column) {
  padding-inline: 8px;
}

.books-page :deep(.book-index-cell) {
  color: #7890a4;
  font-size: 0.625rem;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.books-page :deep(.ag-paging-panel) {
  background: #f7f9fb;
  color: #64788d;
  font-size: 0.6875rem;
}

.books-page :deep(.ag-root-wrapper) {
  border-radius: 0 0 0.8rem 0.8rem;
}

@media (max-width: 767px) {
  .books-page {
    gap: 0.4rem;
  }
}
</style>