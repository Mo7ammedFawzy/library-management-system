<script setup lang="ts">
import ActivityChart from './ActivityChart.vue'
import DashboardPanel from './DashboardPanel.vue'

defineProps<{
  labels: string[]
  counts: number[]
  total: number
}>()
</script>

<template>
  <DashboardPanel
    size="wide"
    kicker="Circulation"
    title="Library activity"
    description="Loans created over the last seven days"
    heading-id="activity-heading"
  >
    <template #aside>
      <div class="dashboard-summary">
        <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#72849d]">This week</p>
        <p class="mt-0.5 font-display text-base font-bold leading-none text-[#244a6c]">{{ total }} loans</p>
      </div>
    </template>

    <div
      class="dashboard-panel__body min-w-0"
      role="img"
      :aria-label="`Loans per day over the last seven days, ${total} loans in total`"
    >
      <ActivityChart
        :labels="labels"
        :counts="counts"
        aria-hidden="true"
      />
    </div>
  </DashboardPanel>
</template>

<style scoped>
.dashboard-summary {
  flex-shrink: 0;
  border-left: 2px solid #b9cce0;
  padding: 0.15rem 0 0.15rem 0.65rem;
  text-align: right;
}

.dashboard-panel__body {
  padding: 0.9rem 1rem 1rem;
}

@media (min-width: 640px) {
  .dashboard-summary {
    padding: 0 0 0 0.65rem;
  }
}

@media (max-width: 767px) {
  .dashboard-panel__body {
    padding: 0.75rem 0.8rem 0.85rem;
  }
}
</style>