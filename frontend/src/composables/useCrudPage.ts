import { computed, onMounted, readonly, ref, shallowRef, type Ref } from 'vue'
import type { GridApi } from 'ag-grid-community'
import { push } from 'notivue'
import { ApiError } from '../services/api'

export interface CrudPageConfig<T, TState, TInput> {
  fetchFn: () => Promise<T[]>
  createFn: (input: TInput) => Promise<T>
  updateFn: (id: number, input: TInput) => Promise<T>
  deleteFn: (id: number) => Promise<void>
  getId: (item: T) => number
  /** Singular entity name used in notifications and error copy. */
  entityName: string
  /** Form state used when adding a new row. */
  emptyState: () => TState
  /** Form state seeded from an existing row when editing. */
  toState: (item: T) => TState
  /** Request payload derived from the current form state. */
  toInput: (state: TState) => TInput
}

/**
 * Owns the CRUD lifecycle for a grid page, including the form state.
 *
 * The form state lives here as the single source of truth: `openAdd`/`openEdit`
 * replace it through `emptyState`/`toState`, and the form components mutate it in
 * place. That removes the mirrored copy plus `watch(formOpen)` sync that a
 * caller-owned `ref` would require.
 */
export function useCrudPage<T, TState, TInput>(config: CrudPageConfig<T, TState, TInput>) {
  const rows = shallowRef<T[]>([])
  const gridApi = shallowRef<GridApi<T> | null>(null)
  const search = shallowRef('')
  const loadError = shallowRef('')

  const formOpen = shallowRef(false)
  const editingItem = shallowRef<T | null>(null)
  const saving = shallowRef(false)
  const formError = shallowRef('')

  const deleteTarget = shallowRef<T | null>(null)
  const deleting = shallowRef(false)
  const deleteError = shallowRef('')

  // Deep `ref` (not shallowRef): form components mutate nested fields in place,
  // e.g. `form.title = ...`, while openAdd/openEdit replace the whole object.
  const state = ref(config.emptyState()) as Ref<TState>

  const deleteModalOpen = computed({
    get: () => deleteTarget.value !== null,
    set: (value: boolean) => {
      if (!value) deleteTarget.value = null
    }
  })

  async function load() {
    loadError.value = ''
    try {
      rows.value = await config.fetchFn()
    } catch (e) {
      loadError.value = e instanceof ApiError ? e.message : `Failed to load ${config.entityName}s.`
    }
  }

  onMounted(load)

  function openAdd() {
    editingItem.value = null
    state.value = config.emptyState()
    formError.value = ''
    formOpen.value = true
  }

  function openEdit(item: T) {
    editingItem.value = item
    state.value = config.toState(item)
    formError.value = ''
    formOpen.value = true
  }

  async function submitForm() {
    saving.value = true
    formError.value = ''
    try {
      const input = config.toInput(state.value)
      if (editingItem.value) {
        await config.updateFn(config.getId(editingItem.value), input)
        push.success(`${config.entityName} updated successfully`)
      } else {
        await config.createFn(input)
        push.success(`${config.entityName} created successfully`)
      }
      await load()
      formOpen.value = false
    } catch (e) {
      formError.value = e instanceof ApiError ? e.message : `Failed to save ${config.entityName}.`
    } finally {
      saving.value = false
    }
  }

  function openDelete(item: T) {
    deleteTarget.value = item
    deleteError.value = ''
  }

  async function confirmDelete() {
    const target = deleteTarget.value
    if (!target) return
    deleting.value = true
    deleteError.value = ''
    try {
      await config.deleteFn(config.getId(target))
      push.success(`${config.entityName} deleted successfully`)
      await load()
      deleteTarget.value = null
    } catch (e) {
      deleteError.value = e instanceof ApiError ? e.message : `Failed to delete ${config.entityName}.`
    } finally {
      deleting.value = false
    }
  }

  return {
    // Writable: bound to the grid (`v-model:api`), the search input, and the form.
    gridApi,
    search,
    state,
    formOpen,
    deleteModalOpen,
    // Read-only view state — updates only through the actions below.
    // `rows` is a shallowRef replaced wholesale on load, so it is handed out
    // directly instead of a deep readonly proxy over the whole collection.
    rows,
    loadError: readonly(loadError),
    editingItem: readonly(editingItem),
    saving: readonly(saving),
    formError: readonly(formError),
    deleteTarget: readonly(deleteTarget),
    deleting: readonly(deleting),
    deleteError: readonly(deleteError),
    load,
    openAdd,
    openEdit,
    submitForm,
    openDelete,
    confirmDelete
  }
}