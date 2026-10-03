<script setup lang="ts">
import {
  createAuthor,
  deleteAuthor,
  fetchAuthors,
  updateAuthor,
  type Author
} from '../services/authors'
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
} = useNameCrudPage<Author, { name: string }>({
  fetchFn: fetchAuthors,
  createFn: createAuthor,
  updateFn: updateAuthor,
  deleteFn: deleteAuthor,
  entityName: 'author'
})

function clearSearch() {
  search.value = ''
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="mb-4">
      <h1
        id="authors-heading"
        class="font-serif text-[28px] font-bold leading-9 tracking-[-0.035em] text-[#132f57] sm:text-[30px]"
      >
        Authors
      </h1>
      <p class="mt-1 max-w-xl text-sm leading-relaxed text-[#667896]">
        Browse the authors in the library catalog.
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
        label="Search authors by name"
        placeholder="Search authors by name..."
        @update:model-value="search = $event"
      />

      <UButton
        icon="i-lucide-plus"
        class="!h-10 w-full justify-center !rounded-xl !px-4 shadow-sm md:w-auto"
        @click="openAdd"
      >
        Add Author
      </UButton>
    </div>

    <div
      v-if="rows.length > 0"
      class="flex min-h-[320px] flex-1 flex-col overflow-hidden rounded-2xl bg-(--ui-bg-card) shadow-sm ring-1 ring-(--ui-border)"
    >
      <AppDataGrid
        v-model:api="gridApi"
        :rows="rows"
        :columns="columns"
        :quick-filter-text="search"
        :get-row-id="getRowId"
        height="100%"
      />
    </div>

    <section
      v-else-if="!loadError"
      aria-labelledby="authors-empty-title"
      class="flex min-h-[320px] flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-[#e4ebf3] bg-white px-6 py-12 text-center shadow-[0_8px_24px_rgba(27,59,102,0.04)] sm:py-16"
    >
      <span class="flex size-12 items-center justify-center rounded-xl bg-[#edf4ff] text-[#173b70] ring-1 ring-inset ring-black/[0.04]">
        <UIcon
          name="i-lucide-pen-line"
          class="size-5"
          aria-hidden="true"
        />
      </span>
      <p
        id="authors-empty-title"
        class="text-sm font-semibold text-[#132f57]"
      >
        {{ search ? 'No authors match your search' : 'No authors yet' }}
      </p>
      <p class="max-w-sm text-sm leading-relaxed text-[#667896]">
        {{ search ? 'Try a different name or clear the search to see all authors.' : 'Add the first author to start building the library catalog.' }}
      </p>
      <div class="mt-2 flex flex-col items-center gap-2 sm:flex-row">
        <UButton
          v-if="search"
          color="neutral"
          variant="outline"
          icon="i-lucide-x"
          class="!h-10 !rounded-xl !bg-white !px-4 shadow-sm"
          @click="clearSearch"
        >
          Clear search
        </UButton>
        <UButton
          v-else
          icon="i-lucide-plus"
          class="!h-10 !rounded-xl !px-4 shadow-sm"
          @click="openAdd"
        >
          Add Author
        </UButton>
      </div>
    </section>

    <SimpleNameFormModal
      v-model:open="formOpen"
      v-model:name="name"
      entity-name="Author"
      :editing="editingItem !== null"
      field-id="author-name"
      placeholder="e.g. J.R.R. Tolkien"
      icon="i-lucide-user"
      submit-icon="i-lucide-user"
      :error="formError"
      :saving="saving"
      :validate="validate"
      @submit="submitForm"
    />

    <DeleteConfirmModal
      v-model:open="deleteModalOpen"
      entity-name="Author"
      :target-label="deleteTarget?.name ?? ''"
      :error="deleteError"
      :deleting="deleting"
      @confirm="confirmDelete"
    />
  </div>
</template>