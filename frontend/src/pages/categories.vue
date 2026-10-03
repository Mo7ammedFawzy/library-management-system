<script setup lang="ts">
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
  type Category
} from '../services/categories'
import { useNameCrudPage } from '../composables/useNameCrudPage'
import DeleteConfirmModal from '../components/DeleteConfirmModal.vue'
import ErrorAlert from '../components/ErrorAlert.vue'
import SearchInput from '../components/SearchInput.vue'
import SimpleNameFormModal from '../components/SimpleNameFormModal.vue'

const {
  rows,
  gridApi,
  search,
  loadError,
  formOpen,
  editingItem,
  saving,
  formError,
  deleteTarget,
  deleting,
  deleteError,
  deleteModalOpen,
  openAdd,
  submitForm,
  confirmDelete,
  name,
  columns,
  getRowId,
  validate
} = useNameCrudPage<Category, { name: string }>({
  fetchFn: fetchCategories,
  createFn: createCategory,
  updateFn: updateCategory,
  deleteFn: deleteCategory,
  entityName: 'category'
})
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="mb-4">
      <h1 class="font-display text-2xl font-semibold tracking-tight text-highlighted">
        Categories
      </h1>
      <p class="mt-1 text-sm text-muted">
        Organize the library collection by category.
      </p>
    </div>

    <ErrorAlert
      v-if="loadError"
      class="mb-4"
      :message="loadError"
    />

    <div class="mb-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <SearchInput
        :model-value="search"
        class="md:w-[400px]"
        label="Search categories by name"
        placeholder="Search categories by name..."
        @update:model-value="search = $event"
      />

      <UButton
        icon="i-lucide-plus"
        class="!h-10 w-full justify-center !rounded-lg !px-4 shadow-sm md:w-auto"
        @click="openAdd"
      >
        Add Category
      </UButton>
    </div>

    <div class="flex min-h-[320px] flex-1 flex-col overflow-hidden rounded-2xl bg-(--ui-bg-card) shadow-sm ring-1 ring-(--ui-border)">
      <AppDataGrid
        v-model:api="gridApi"
        :rows="rows"
        :columns="columns"
        :quick-filter-text="search"
        :get-row-id="getRowId"
        height="100%"
      />
    </div>

    <SimpleNameFormModal
      v-model:open="formOpen"
      v-model:name="name"
      entity-name="Category"
      :editing="editingItem !== null"
      field-id="category-name"
      placeholder="e.g. Science Fiction"
      icon="i-lucide-tags"
      submit-icon="i-lucide-tag"
      :error="formError"
      :saving="saving"
      :validate="validate"
      @submit="submitForm"
    />

    <DeleteConfirmModal
      v-model:open="deleteModalOpen"
      entity-name="Category"
      :target-label="deleteTarget?.name ?? ''"
      :error="deleteError"
      :deleting="deleting"
      @confirm="confirmDelete"
    />
  </div>
</template>