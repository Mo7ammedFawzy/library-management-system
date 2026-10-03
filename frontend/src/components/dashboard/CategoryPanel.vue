<script setup lang="ts">
import type { CategorySlice } from '../../composables/useDashboard'
import CategoryDonutChart from './CategoryDonutChart.vue'
import DashboardPanel from './DashboardPanel.vue'

defineProps<{
  slices: CategorySlice[]
  total: number
}>()
</script>

<template>
  <DashboardPanel
    size="narrow"
    kicker="Collection"
    title="Books by category"
    description="How your collection is distributed"
    heading-id="category-heading"
    link-label="View all categories"
    link-to="/categories"
  >
    <div class="category-body grid min-w-0 grid-cols-1 items-center justify-items-center gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:justify-items-stretch">
      <CategoryDonutChart
        :items="slices"
        :total="total"
      />

      <div class="w-full min-w-0 max-w-[250px] divide-y divide-[#edf1f6] sm:max-w-none">
        <div
          v-for="category in slices"
          :key="category.name"
          class="flex items-center justify-between gap-4 py-2.5 transition-colors first:pt-0 last:pb-0 hover:bg-[#f8fbff]"
        >
          <span class="flex min-w-0 items-center gap-2.5 text-sm font-medium text-[#304968]">
            <span
              class="size-2.5 shrink-0 rounded-full ring-1 ring-inset ring-black/10"
              :style="{ backgroundColor: category.color }"
              aria-hidden="true"
            />
            <span class="truncate">{{ category.name }}</span>
          </span>
          <span class="shrink-0 rounded-md bg-[#f6f8fc] px-2 py-0.5 text-xs font-semibold text-[#304968]">
            {{ category.count }} <span class="font-normal text-[#7a8ba3]">{{ category.percentage }}%</span>
          </span>
        </div>
        <div
          v-if="!slices.length"
          class="py-8 text-center text-sm text-[#7a8ba3]"
        >
          No categories yet
        </div>
      </div>
    </div>
  </DashboardPanel>
</template>

<style scoped>
.category-body {
  min-height: 15.5rem;
  padding: 0.9rem 1rem 1rem;
}

@media (max-width: 767px) {
  .category-body {
    min-height: auto;
    padding: 0.75rem 0.8rem 0.85rem;
  }
}
</style>