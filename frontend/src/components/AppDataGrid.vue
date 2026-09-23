<script setup lang="ts">
import { watch } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import { themeQuartz, type ColDef, type GetRowIdParams, type GridApi, type GridReadyEvent } from 'ag-grid-community'
import '../lib/agGrid'

const props = withDefaults(defineProps<{
  rows: unknown[]
  columns: ColDef[]
  getRowId?: (params: GetRowIdParams) => string
  quickFilterText?: string
  rowHeight?: number
  headerHeight?: number
  pageSize?: number
  pageSizeSelector?: number[]
  height?: string
}>(), {
  getRowId: (params: GetRowIdParams) => String((params.data as { id: number | string }).id),
  quickFilterText: '',
  rowHeight: 40,
  headerHeight: 40,
  pageSize: 10,
  pageSizeSelector: () => [10, 20, 50, 100],
  height: '100%'
})

const emit = defineEmits<{
  (e: 'grid-ready', params: GridReadyEvent): void
}>()

const gridApi = defineModel<GridApi | null>('api', { default: null })

const lightTheme = themeQuartz.withParams({
  fontFamily: "'Inter Variable', ui-sans-serif, system-ui, sans-serif",
  fontSize: 14,
  headerFontFamily: "'Inter Variable', ui-sans-serif, system-ui, sans-serif",
  headerFontSize: 11,
  headerFontWeight: 700,
  headerTextColor: '#7a8ba3',
  headerBackgroundColor: '#f4f7fc',
  backgroundColor: '#ffffff',
  foregroundColor: '#263f5f',
  textColor: '#263f5f',
  subtleTextColor: '#8a99ae',
  borderColor: '#e4ebf3',
  borderWidth: 1,
  wrapperBorder: false,
  wrapperBorderRadius: 0,
  headerRowBorder: { color: '#e4ebf3', width: 1, style: 'solid' },
  rowBorder: { color: '#edf1f6', width: 1, style: 'solid' },
  columnBorder: false,
  oddRowBackgroundColor: '#fafcff',
  rowHoverColor: '#eef4fb',
  selectedRowBackgroundColor: '#e6effe',
  rangeSelectionBackgroundColor: '#dbe7fd',
  rangeSelectionBorderColor: '#2161bf',
  accentColor: '#2161bf',
  focusShadow: { color: '#8ca9ce', width: 2, style: 'solid', offset: 0, radius: 8 },
  inputBackgroundColor: '#f9fbfe',
  inputTextColor: '#263f5f',
  inputBorder: { color: '#e4ebf3', width: 1, style: 'solid' },
  inputFocusBorder: { color: '#8ca9ce', width: 1, style: 'solid' },
  inputFocusShadow: { color: '#edf4ff', width: 4, style: 'solid', offset: 0, radius: 8 },
  checkboxCheckedBackgroundColor: '#2161bf',
  checkboxCheckedBorderColor: '#2161bf',
  checkboxUncheckedBorderColor: '#c3cfdf',
  rowHeight: props.rowHeight,
  headerHeight: props.headerHeight,
  paginationPanelHeight: 52,
  spacing: 8,
  iconSize: 16
})

const theme = lightTheme

const defaultColDef: ColDef = {
  sortable: true,
  resizable: true,
  filter: false,
  minWidth: 90,
  suppressHeaderMenuButton: true
}

function onGridReady(params: GridReadyEvent) {
  gridApi.value = params.api
  params.api.setGridOption('quickFilterText', props.quickFilterText)
  emit('grid-ready', params)
}

watch(() => props.quickFilterText, (value) => {
  gridApi.value?.setGridOption('quickFilterText', value)
})
</script>

<template>
  <AgGridVue
    class="ag-theme-athenaeum"
    :style="{ width: '100%', height, flex: '1 1 0%', minHeight: '0' }"
    :theme="theme"
    :column-defs="columns"
    :row-data="rows"
    :default-col-def="defaultColDef"
    :get-row-id="getRowId"
    :pagination="true"
    :pagination-page-size="pageSize"
    :pagination-page-size-selector="pageSizeSelector"
    @grid-ready="onGridReady"
  />
</template>

<style scoped>
:deep(.ag-header) {
  background:
    linear-gradient(#f4f7fc, #f4f7fc) padding-box,
    linear-gradient(90deg, #e5a214 0%, #e5a214 64px, transparent 64px) border-box;
  border-bottom: 2px solid #e4ebf3;
  border-radius: 0;
}

:deep(.ag-header-cell-text) {
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

:deep(.ag-header-cell) {
  transition: background-color 150ms ease;
}

:deep(.ag-header-cell:hover) {
  background-color: #e9eff8;
}

:deep(.ag-header-row) {
  border-bottom-width: 1px;
}

:deep(.ag-row) {
  transition: background-color 150ms ease, box-shadow 150ms ease;
}

:deep(.ag-row-even) {
  background-color: #fff;
}

:deep(.ag-row-odd) {
  background-color: #fafcff;
}

:deep(.ag-row-hover) {
  background-color: #eef4fb;
  box-shadow: inset 3px 0 0 #2161bf;
}

:deep(.ag-row-selected) {
  background-color: #e6effe;
  box-shadow: inset 3px 0 0 #2161bf;
}

:deep(.ag-cell) {
  display: flex;
  align-items: center;
  line-height: 1.4;
  border-right: 1px dashed transparent;
}

:deep(.ag-cell:focus-visible) {
  outline: 2px solid #8ca9ce;
  outline-offset: -2px;
  border-radius: 6px;
}

:deep(.ag-root-wrapper) {
  border-radius: 0 0 0.75rem 0.75rem;
  overflow: hidden;
}

:deep(.ag-center-cols-viewport) {
  scrollbar-width: thin;
  scrollbar-color: #c3cfdf transparent;
}

:deep(.ag-paging-panel) {
  border-top: 1px solid #e4ebf3;
  background: linear-gradient(#fbfcfe, #f4f7fc);
  font-size: 13px;
  color: var(--ui-text-muted);
  padding-inline: 16px;
}

:deep(.ag-paging-button) {
  border-radius: 8px;
  transition: background-color 150ms ease, color 150ms ease;
}

:deep(.ag-paging-button:hover:not(:disabled)) {
  background-color: #edf4ff;
  color: #173b70;
}

:deep(.ag-paging-button:disabled) {
  opacity: 0.4;
}

:deep(.ag-filter-toolpanel-search),
:deep(.ag-text-field-input),
:deep(.ag-number-field-input) {
  border-radius: 8px;
}

@media (prefers-reduced-motion: reduce) {
  :deep(.ag-row),
  :deep(.ag-header-cell),
  :deep(.ag-paging-button) {
    transition: none;
  }
}
</style>
