import { computed } from 'vue'
import type { ColDef, ColDefField, GetRowIdParams, ICellRendererParams } from 'ag-grid-community'
import type { FormError } from '@nuxt/ui'
import ActionsCell from '../components/grid/ActionsCell.vue'
import { useCrudPage } from './useCrudPage'

interface NamedEntity {
  id: number
  name: string
}

export interface NameCrudPageConfig<T extends NamedEntity, TInput> {
  fetchFn: () => Promise<T[]>
  createFn: (input: TInput) => Promise<T>
  updateFn: (id: number, input: TInput) => Promise<T>
  deleteFn: (id: number) => Promise<void>
  entityName: string
}

export function validateName(state: { name: string }): FormError[] {
  return state.name.trim() ? [] : [{ name: 'name', message: 'Name is required' }]
}

/**
 * Shared CRUD page state for the name-only catalog entities (authors,
 * categories). Owns the single form field, keeps it in sync with the modal
 * lifecycle, builds the standard grid columns, and delegates list loading,
 * saving and deleting to `useCrudPage`.
 */
export function useNameCrudPage<T extends NamedEntity, TInput>(config: NameCrudPageConfig<T, TInput>) {
  const crud = useCrudPage<T, { name: string }, TInput>({
    fetchFn: config.fetchFn,
    createFn: config.createFn,
    updateFn: config.updateFn,
    deleteFn: config.deleteFn,
    getId: (item) => item.id,
    entityName: config.entityName,
    emptyState: () => ({ name: '' }),
    toState: (item) => ({ name: item.name }),
    toInput: (state) => ({ name: state.name.trim() }) as TInput
  })

  /**
   * Two-way view of the single form field for `v-model:name` on the modal.
   * It reads and writes `crud.state` rather than holding a second copy, so the
   * modal and the composable can never disagree.
   */
  const name = computed({
    get: () => crud.state.value.name,
    set: (value: string) => {
      crud.state.value.name = value
    }
  })

  function getRowId(params: GetRowIdParams) {
    return String((params.data as T).id)
  }

  const columns: ColDef<T>[] = [
    {
      headerName: '#',
      colId: 'index',
      sortable: false,
      filter: false,
      width: 48,
      valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
      cellStyle: { textAlign: 'center' },
      cellClass: 'text-dimmed'
    },
    {
      field: 'name' as ColDefField<T>,
      headerName: 'Name',
      flex: 2,
      cellStyle: { fontWeight: '500' },
      cellClass: 'text-highlighted'
    },
    {
      colId: 'actions',
      headerName: 'Actions',
      sortable: false,
      filter: false,
      width: 104,
      pinned: 'right',
      headerClass: 'ag-right-aligned-header',
      cellRenderer: ActionsCell,
      cellRendererParams: {
        onEdit: (params: ICellRendererParams) => crud.openEdit(params.data as T),
        onDelete: (params: ICellRendererParams) => crud.openDelete(params.data as T)
      }
    }
  ]

  return {
    ...crud,
    name,
    columns,
    getRowId,
    validate: validateName
  }
}