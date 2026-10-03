<script setup lang="ts">
import { shallowRef } from 'vue'
import type { SelectMenuItem } from '@nuxt/ui'
import { BORROWING_STATUSES, type BorrowingStatus } from '../../services/borrowings'
import type { DateRangeKeys } from '../../composables/useBorrowingsPage'

const search = defineModel<string>('search', { required: true })
const statusDropdown = defineModel<string>('statusDropdown', { required: true })
const statusFilters = defineModel<BorrowingStatus[]>('statusFilters', { required: true })
const dateRange = defineModel<DateRangeKeys | null>('dateRange', { required: true })

defineProps<{
  statusOptions: SelectMenuItem[]
  rangeLabel: string
  hasDateRange: boolean
}>()

const emit = defineEmits<{
  reset: []
}>()

// The calendar owns its own `DateValue` objects while the filter state uses
// `YYYY-MM-DD` keys, so selections are translated on the way out and the
// calendar is remounted whenever the filters are cleared.
const calendarKey = shallowRef(0)

function clearFilters() {
  calendarKey.value += 1
  emit('reset')
}

function onCalendarUpdate(value: unknown) {
  const range = value as { start?: unknown, end?: unknown } | null
  dateRange.value = {
    start: range?.start ? toDateKey(range.start) : null,
    end: range?.end ? toDateKey(range.end) : null
  }
}

/** Converts a calendar date value into a `YYYY-MM-DD` key. */
function toDateKey(value: unknown) {
  const date = value instanceof Date ? value : new Date(String(value))
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const toolbarUi = {
  base: '!h-10 !rounded-lg !bg-(--ui-bg-card) !text-sm !ring-(--ui-border) shadow-sm focus-visible:!ring-2 focus-visible:!ring-primary focus-visible:!outline-none'
}
</script>

<template>
  <div class="borrowing-toolbar">
    <SearchInput
      v-model="search"
      label="Search by book title or member name"
      placeholder="Search by book title or member name..."
      class="borrowing-toolbar__search"
    />

    <div class="flex flex-col gap-1">
      <USelectMenu
        id="borrow-status"
        v-model="statusDropdown"
        :items="statusOptions"
        value-key="value"
        :search-input="false"
        aria-label="Filter by borrowing status"
        class="w-full lg:w-44"
        :ui="toolbarUi"
      />
    </div>

    <div class="flex flex-col gap-1">
      <UPopover>
        <button
          type="button"
          class="borrowing-toolbar__range"
        >
          <span
            class="truncate"
            :class="hasDateRange ? 'text-highlighted' : 'text-muted'"
          >
            {{ rangeLabel }}
          </span>
          <UIcon
            name="i-lucide-calendar"
            class="size-4 shrink-0 text-muted"
          />
        </button>

        <template #content>
          <UCalendar
            :key="calendarKey"
            range
            @update:model-value="onCalendarUpdate"
          />
        </template>
      </UPopover>
    </div>

    <UPopover>
      <UButton
        color="neutral"
        variant="outline"
        icon="i-lucide-filter"
        class="!h-10 !rounded-lg !bg-(--ui-bg-card) !px-4 shadow-sm"
      >
        Filters
      </UButton>

      <template #content>
        <div class="flex w-64 flex-col gap-5 p-4">
          <div class="flex flex-col gap-2">
            <p class="text-[11px] font-semibold uppercase tracking-wide text-muted">
              Status
            </p>
            <UCheckboxGroup
              v-model="statusFilters"
              size="sm"
              variant="list"
              :items="[...BORROWING_STATUSES]"
            />
          </div>

          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            class="self-start"
            @click="clearFilters"
          >
            Clear filters
          </UButton>
        </div>
      </template>
    </UPopover>
  </div>
</template>

<style scoped>
.borrowing-toolbar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-bottom: 1px solid var(--ui-border);
  padding: 0.75rem;
}

.borrowing-toolbar__range {
  display: flex;
  width: 100%;
  height: 2.5rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  border: 1px solid var(--ui-border);
  border-radius: 0.5rem;
  background: var(--ui-bg-card);
  padding: 0 0.75rem;
  font-size: 0.875rem;
  outline: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.borrowing-toolbar__range:focus-visible {
  border-color: var(--ui-color-primary);
  box-shadow: 0 0 0 1px var(--ui-color-primary);
}

@media (min-width: 1024px) {
  .borrowing-toolbar {
    flex-direction: row;
    align-items: center;
    overflow-x: auto;
  }

  .borrowing-toolbar__search {
    min-width: 220px;
    flex: 1;
  }
}
</style>