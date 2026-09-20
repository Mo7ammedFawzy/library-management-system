<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ColDef, ICellRendererParams, ValueGetterParams } from 'ag-grid-community'
import ActionsCell from '../components/grid/ActionsCell.vue'
import type { FormError, BreadcrumbItem } from '@nuxt/ui'
import {
  createAuthor,
  deleteAuthor,
  fetchAuthors,
  updateAuthor,
  type Author
} from '../services/authors'
import { useCrudPage } from '../composables/useCrudPage'

const breadcrumbItems = ref<BreadcrumbItem[]>([
  { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/dashboard' },
  { label: 'Authors', icon: 'i-lucide-pen-line' }
])

const fieldUi = {
  base: '!rounded-xl !bg-(--ui-bg-card) !py-3 !text-sm !ring-(--ui-border) !placeholder:text-muted focus-visible:!ring-2 focus-visible:!ring-primary focus-visible:!outline-none'
}

function validateName(state: { name: string }): FormError[] {
  const errors: FormError[] = []
  if (!state.name.trim()) {
    errors.push({ name: 'name', message: 'Name is required' })
  }
  return errors
}

function getRowId(params: ICellRendererParams<Author>) {
  return String((params.data as Author).id)
}

const columns: ColDef[] = [
  {
    headerName: '#',
    sortable: false,
    filter: false,
    width: 48,
    valueGetter: (params: ValueGetterParams) => (params.node?.rowIndex ?? 0) + 1,
    cellStyle: { textAlign: 'center' },
    cellClass: 'text-dimmed'
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 2,
    cellStyle: { fontWeight: '500' },
    cellClass: 'text-highlighted'
  },
  {
    headerName: 'Actions',
    sortable: false,
    filter: false,
    width: 104,
    pinned: 'right',
    headerClass: 'ag-right-aligned-header',
    cellRenderer: ActionsCell,
    cellRendererParams: {
      onEdit: (params: ICellRendererParams) => openEdit(params.data as Author),
      onDelete: (params: ICellRendererParams) => openDelete(params.data as Author)
    }
  }
]

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
  openAdd,
  openEdit,
  setFormState,
  submitForm,
  openDelete,
  confirmDelete
} = useCrudPage<Author, { name: string }>({
  fetchFn: fetchAuthors,
  createFn: createAuthor,
  updateFn: updateAuthor,
  deleteFn: deleteAuthor,
  getRowId,
  columns,
  validate: validateName,
  toInput: (state: { name: string }) => ({ name: state.name.trim() }),
  entityName: 'author'
})

const name = ref('')

watch(formOpen, (open: boolean) => {
  if (open) {
    if (editingItem.value) {
      name.value = (editingItem.value as Author).name
    } else {
      name.value = ''
    }
  }
})

watch(name, (val: string) => {
  setFormState({ name: val })
})
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="mb-4">
      <UBreadcrumb class="mb-2" :items="breadcrumbItems">
        <template #item="{ item }">
          <span
            :aria-current="!item.to ? 'page' : undefined"
            :class="[
              'flex items-center gap-1.5 text-sm transition-colors',
              item.to ? 'text-muted hover:text-highlighted cursor-pointer' : 'font-semibold text-highlighted'
            ]"
          >
            <UIcon
              v-if="item.icon"
              :name="item.icon"
              aria-hidden="true"
              class="size-4 text-muted"
            />
            {{ item.label }}
          </span>
        </template>
        <template #separator>
          <UIcon name="i-lucide-chevron-right" aria-hidden="true" class="size-3.5 text-muted" />
        </template>
      </UBreadcrumb>
      <h1 id="authors-heading" class="font-serif text-[28px] font-bold leading-9 tracking-[-0.035em] text-[#132f57] sm:text-[30px]">
        Authors
      </h1>
      <p class="mt-1 max-w-xl text-sm leading-relaxed text-[#667896]">
        Browse the authors in the library catalog.
      </p>
    </div>

    <div
      v-if="loadError"
      role="alert"
      class="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-950 dark:bg-red-950/40 dark:text-red-300"
    >
      <UIcon
        name="i-lucide-alert-circle"
        class="size-4 shrink-0"
      />
      <span>{{ loadError }}</span>
    </div>

    <div class="mb-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div class="relative w-full md:w-[400px]">
        <UIcon
          name="i-lucide-search"
          aria-hidden="true"
          class="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-muted"
        />
        <input
          v-model="search"
          type="search"
          placeholder="Search authors by name..."
          aria-label="Search authors by name"
          class="h-10 w-full rounded-xl border border-[#e4ebf3] bg-[#f9fbfe] pl-9 pr-4 text-sm text-[#263f5f] shadow-sm outline-none transition-all placeholder:text-[#92a0b2] hover:border-[#cdd9e8] focus:border-[#8ca9ce] focus:bg-white focus:ring-4 focus:ring-[#edf4ff]"
        >
      </div>

      <UButton
        icon="i-lucide-plus"
        class="!h-10 w-full justify-center !rounded-xl !px-4 shadow-sm md:w-auto"
        @click="openAdd"
      >
        Add Author
      </UButton>
    </div>

    <div v-if="rows.length > 0" class="flex min-h-[320px] flex-1 flex-col overflow-hidden rounded-2xl bg-(--ui-bg-card) shadow-sm ring-1 ring-(--ui-border)">
      <AppDataGrid
        v-model:api="gridApi"
        :rows="rows"
        :columns="columns"
        :quick-filter-text="search"
        :get-row-id="(params) => String((params.data as Author).id)"
        height="100%"
      />
    </div>

    <section
      v-else-if="!loadError"
      aria-labelledby="authors-empty-title"
      class="flex min-h-[320px] flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-[#e4ebf3] bg-white px-6 py-12 text-center shadow-[0_8px_24px_rgba(27,59,102,0.04)] sm:py-16"
    >
      <span class="flex size-12 items-center justify-center rounded-xl bg-[#edf4ff] text-[#173b70] ring-1 ring-inset ring-black/[0.04]">
        <UIcon name="i-lucide-pen-line" class="size-5" aria-hidden="true" />
      </span>
      <p id="authors-empty-title" class="text-sm font-semibold text-[#132f57]">
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
          @click="search = ''"
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

    <UModal
      v-model:open="formOpen"
      :ui="{
        overlay: '!bg-black/20 backdrop-blur-sm',
        content: '!max-w-md !rounded-xl !bg-(--ui-bg-card) !shadow-[0_8px_32px_rgba(0,0,0,0.04)] !ring-0 border border-(--ui-border)'
      }"
    >
      <template #content="{ close }">
        <div class="flex flex-col">
          <div class="flex shrink-0 items-center justify-between gap-4 border-b border-(--ui-border) px-4 py-3">
            <div class="flex items-center gap-4">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-(--ui-bg-accented)">
                <UIcon
                  name="i-lucide-user"
                  class="text-lg text-highlighted"
                />
              </div>
              <div>
                <h2 class="font-display text-[20px] font-semibold leading-tight text-highlighted">
                  {{ editingItem ? 'Edit Author' : 'Add Author' }}
                </h2>
                <p class="text-xs font-medium text-muted">
                  {{ editingItem ? 'Update author name' : 'Add a new author to your library' }}
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

          <div class="grow px-4 py-4">
            <div
              v-if="formError"
              class="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-950 dark:bg-red-950/40 dark:text-red-300"
            >
              <UIcon
                name="i-lucide-alert-circle"
                class="size-4 shrink-0"
              />
              <span>{{ formError }}</span>
            </div>

            <UForm
              ref="entityForm"
              :state="{ name }"
              :validate="validateName"
              class="flex flex-col gap-2"
              @submit="submitForm"
            >
              <label
                for="author-name"
                class="text-sm font-medium text-highlighted"
              >
                Name <span class="text-error">*</span>
              </label>
              <UInput
                id="author-name"
                v-model="name"
                placeholder="e.g. J.R.R. Tolkien"
                :ui="fieldUi"
              />
            </UForm>
          </div>

          <div class="flex shrink-0 items-center justify-end gap-2 border-t border-(--ui-border) bg-(--ui-bg-accented) px-4 py-3">
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              class="!rounded-xl !px-8 !py-2.5 !bg-transparent ring-(--ui-border-accented) hover:!bg-(--ui-bg-accented)"
              @click="close"
            >
              Cancel
            </UButton>
            <UButton
              color="primary"
              variant="solid"
              :icon="editingItem ? 'i-lucide-save' : 'i-lucide-user'"
              size="lg"
              class="!rounded-xl !px-8 !py-2.5 !bg-brand-700 dark:!bg-primary-400 hover:!bg-brand-600 dark:hover:!bg-primary-300"
              :loading="saving"
              @click="entityForm?.submit()"
            >
              {{ editingItem ? 'Save Changes' : 'Add Author' }}
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
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/50">
                <UIcon
                  name="i-lucide-trash-2"
                  class="text-lg text-red-600 dark:text-red-400"
                />
              </div>
              <div>
                <h2 class="font-display text-[20px] font-semibold leading-tight text-highlighted">
                  Delete Author?
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
              <span class="font-semibold">"{{ deleteTarget?.name }}"</span>?
            </p>

            <div
              v-if="deleteError"
              class="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-950 dark:bg-red-950/40 dark:text-red-300"
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