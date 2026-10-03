<script setup lang="ts">
import { formatDate, getStatus, type Borrowing } from '../../services/borrowings'
import { overdueLabel, statusClass, statusLabel } from '../../composables/useDashboard'
import DashboardPanel from './DashboardPanel.vue'

defineProps<{
  borrowings: Borrowing[]
  overdueCount: number
}>()
</script>

<template>
  <DashboardPanel
    size="narrow"
    kicker="Follow-up"
    title="Needs attention"
    description="Overdue loans that need a follow-up"
    heading-id="attention-heading"
    link-label="View all overdue"
    link-to="/borrowings"
    class="flex flex-col"
  >
    <div
      v-if="borrowings.length"
      class="overdue-alert"
      role="alert"
    >
      <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#df4634] text-white shadow-[0_4px_12px_rgba(223,70,52,0.3)]">
        <UIcon
          name="i-lucide-circle-alert"
          class="size-4"
          aria-hidden="true"
        />
      </div>
      <div class="min-w-0 flex-1">
        <p class="font-semibold text-[#9d3529]">{{ overdueCount }} {{ overdueCount === 1 ? 'loan needs' : 'loans need' }} attention</p>
        <p class="mt-0.5 truncate text-xs text-[#b3665c]">A gentle reminder can help keep the collection moving.</p>
      </div>
      <RouterLink
        to="/borrowings"
        aria-label="View overdue loans"
        class="hidden shrink-0 rounded-lg bg-[#9d3529] px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#7f2b21] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a09a] sm:inline-flex"
      >
        View loans
      </RouterLink>
    </div>

    <div
      v-if="borrowings.length"
      class="overdue-list flex-1 divide-y divide-[#edf1f6]"
    >
      <div
        v-for="borrowing in borrowings.slice(0, 5)"
        :key="borrowing.id"
        class="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-[#fff8f7]"
      >
        <div
          class="flex size-10 items-center justify-center rounded-xl bg-[#fff0ee] text-[#d84332] ring-1 ring-inset ring-[#f3d4cf]"
          title="Overdue"
        >
          <UIcon
            name="i-lucide-calendar-clock"
            class="size-5"
            aria-hidden="true"
          />
        </div>
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold text-[#263f5f]">{{ borrowing.bookResponse.title }}</p>
          <p class="mt-0.5 truncate text-xs text-[#7486a0]">{{ borrowing.userResponse.name }} · Due {{ formatDate(borrowing.dueDate) }}</p>
        </div>
        <div class="text-right">
          <p class="text-xs font-semibold text-[#df4634]">{{ overdueLabel(borrowing) }}</p>
          <span
            class="mt-1 inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold"
            :class="statusClass(getStatus(borrowing))"
          >
            {{ statusLabel(getStatus(borrowing)) }}
          </span>
        </div>
      </div>
    </div>

    <div
      v-else
      class="overdue-empty"
    >
      <div class="flex size-11 items-center justify-center rounded-full bg-[#eaf7f2] text-[#20876e] ring-1 ring-inset ring-[#bfe6d8]">
        <UIcon
          name="i-lucide-circle-check-big"
          class="size-5"
          aria-hidden="true"
        />
      </div>
      <p class="mt-3 font-semibold text-[#2c5260]">Everything is on track</p>
      <p class="mt-1 max-w-56 text-sm text-[#7486a0]">There are no overdue books to follow up today.</p>
    </div>
  </DashboardPanel>
</template>

<style scoped>
.overdue-alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.9rem 1rem 0.25rem;
  border: 1px solid #f0d2cd;
  border-radius: 0.625rem;
  background: #fff6f4;
  padding: 0.65rem 0.75rem;
  color: #6f3e37;
  font-size: 0.8125rem;
}

.overdue-list {
  padding: 0.9rem 1rem 1rem;
}

.overdue-empty {
  display: flex;
  min-height: 15rem;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0.9rem 1rem 1rem;
  border: 1px dashed #d9e2ec;
  border-radius: 0.625rem;
  background: #fafcfe;
  padding: 1.5rem 1.25rem;
  text-align: center;
}

@media (min-width: 640px) {
  .overdue-alert {
    gap: 0.875rem;
    padding: 0.7rem 0.8rem;
  }
}

@media (max-width: 767px) {
  .overdue-list {
    padding: 0.75rem 0.8rem 0.85rem;
  }
}

@media (max-width: 639px) {
  .overdue-alert,
  .overdue-empty {
    margin-inline: 0.8rem;
  }
}
</style>