<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import type { GridApi } from 'ag-grid-community'
import { useBorrowingsPage } from '../composables/useBorrowingsPage'
import type { Borrowing } from '../services/borrowings'
import BorrowBookModal from '../components/borrowings/BorrowBookModal.vue'
import BorrowingDetailModal from '../components/borrowings/BorrowingDetailModal.vue'
import BorrowingsToolbar from '../components/borrowings/BorrowingsToolbar.vue'
import ErrorAlert from '../components/ErrorAlert.vue'

const {
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
  validate,
  openAdd,
  submitBorrow,
  submitReturn,
  resetFilters
} = useBorrowingsPage()

const gridApi = shallowRef<GridApi<Borrowing> | null>(null)
const hasDateRange = computed(() => dateRange.value?.start != null && dateRange.value.end != null)
</script>

<template>
  <div class="workspace-page mx-auto flex min-h-0 w-full flex-1 flex-col gap-5 pb-2">
    <section
      class="workspace-heading"
      aria-labelledby="borrowings-heading"
    >
      <div>
        <p class="workspace-kicker">Library manager · Circulation</p>
        <h1
          id="borrowings-heading"
          class="workspace-title"
        >
          Borrowings
        </h1>
        <p class="workspace-description">Track and manage all book borrowings.</p>
      </div>

      <UButton
        icon="i-lucide-plus"
        class="workspace-action !h-10 !rounded-xl !px-4"
        @click="openAdd"
      >
        New Borrowing
      </UButton>
    </section>

    <ErrorAlert
      v-if="loadError"
      :message="loadError"
    />

    <section class="borrowing-table-panel flex min-h-0 flex-1 flex-col">
      <BorrowingsToolbar
        v-model:search="search"
        v-model:status-dropdown="statusDropdown"
        v-model:status-filters="statusFilters"
        v-model:date-range="dateRange"
        :status-options="statusOptions"
        :range-label="rangeLabel"
        :has-date-range="hasDateRange"
        @reset="resetFilters"
      />

      <AppDataGrid
        v-model:api="gridApi"
        :rows="visibleRows"
        :columns="columns"
        :quick-filter-text="search"
        :get-row-id="getRowId"
        :row-height="52"
        height="100%"
      />
    </section>

    <BorrowBookModal
      v-model:open="addOpen"
      v-model:book-id="selectedBookId"
      v-model:user-id="selectedUserId"
      :book-options="bookOptions"
      :member-options="memberOptions"
      :state="borrowState"
      :error="formError"
      :saving="saving"
      :validate="validate"
      @submit="submitBorrow"
    />

    <BorrowingDetailModal
      v-model:open="detailOpen"
      :borrowing="detail"
      :status="detailStatus"
      :returning="returning"
      :return-error="returnError"
      @return="submitReturn"
    />
  </div>
</template>

<style scoped>
.borrowing-table-panel {
  overflow: hidden;
  border: 1px solid var(--ui-border);
  border-radius: 0.5rem;
  background: var(--ui-bg-card);
}

@media (max-width: 639px) {
  .borrowing-table-panel {
    border-radius: 0.375rem;
  }
}
</style>