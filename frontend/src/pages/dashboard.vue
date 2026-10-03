<script setup lang="ts">
import { useDashboard } from '../composables/useDashboard'
import ActivityPanel from '../components/dashboard/ActivityPanel.vue'
import CategoryPanel from '../components/dashboard/CategoryPanel.vue'
import DashboardMetrics from '../components/dashboard/DashboardMetrics.vue'
import OverduePanel from '../components/dashboard/OverduePanel.vue'
import RecentActivityPanel from '../components/dashboard/RecentActivityPanel.vue'

const {
  stats,
  categoryBreakdown,
  recentActivity,
  activityChart,
  overdueBorrowings,
  overdueBooks,
  totalBooks,
  authorCount,
  categoryCount,
  greeting,
  dateLabel,
  today
} = useDashboard()
</script>

<template>
  <div class="dashboard-page workspace-page mx-auto flex w-full flex-col gap-4 pb-2">
    <section
      class="dashboard-hero"
      aria-labelledby="dashboard-greeting"
    >
      <div class="dashboard-hero__copy">
        <p class="workspace-kicker">Library manager · Overview</p>
        <h1
          id="dashboard-greeting"
          class="workspace-title"
        >
          {{ greeting }}, Mohammad
        </h1>
        <p class="workspace-description">
          Here’s an overview of your library today — circulation, collection health, and what needs a nudge.
        </p>
      </div>

      <div class="dashboard-date">
        <span class="dashboard-date__icon">
          <UIcon
            name="i-lucide-calendar-days"
            class="size-4"
            aria-hidden="true"
          />
        </span>
        <span class="font-medium"><span class="sr-only">Today's date: </span><time :datetime="today">{{ dateLabel }}</time></span>
      </div>
    </section>

    <DashboardMetrics :stats="stats" />

    <section class="dashboard-grid">
      <ActivityPanel
        :labels="activityChart.labels"
        :counts="activityChart.counts"
        :total="activityChart.total"
      />

      <CategoryPanel
        :slices="categoryBreakdown"
        :total="totalBooks"
      />
    </section>

    <section class="dashboard-grid">
      <RecentActivityPanel :items="recentActivity" />

      <OverduePanel
        :borrowings="overdueBorrowings"
        :overdue-count="overdueBooks"
      />
    </section>

    <footer class="dashboard-footer">
      <span class="inline-flex items-center gap-1.5">
        <span
          class="size-1.5 rounded-full bg-[#20876e]"
          aria-hidden="true"
        />
        {{ authorCount }} authors · {{ categoryCount }} categories
      </span>
      <span
        class="hidden text-[#c7d1de] sm:inline"
        aria-hidden="true"
      >·</span>
      <span>Athenaeum Library Management</span>
    </footer>
  </div>
</template>

<style scoped>
.dashboard-page {
  --dashboard-border: #dfe6ee;
  --dashboard-divider: #e9eef4;
  --dashboard-muted: #6b7d93;
  --dashboard-text: #1c3552;
  color: var(--dashboard-text);
}

.dashboard-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 0.5rem 0.25rem 0.75rem;
}

.dashboard-hero__copy {
  min-width: 0;
}

.dashboard-page :deep(.workspace-kicker) {
  margin-bottom: 0.55rem;
  color: #64778f;
}

.dashboard-page :deep(.workspace-title) {
  font-size: clamp(1.65rem, 2.2vw, 2rem);
}

.dashboard-page :deep(.workspace-description) {
  max-width: 40rem;
  margin-top: 0.4rem;
}

.dashboard-date {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.65rem;
  border: 1px solid var(--dashboard-border);
  border-radius: 0.625rem;
  background: rgba(255, 255, 255, 0.72);
  padding: 0.55rem 0.75rem;
  color: #405772;
  font-size: 0.8125rem;
}

.dashboard-date__icon {
  display: flex;
  width: 1.75rem;
  height: 1.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.4rem;
  background: #eaf2fb;
  color: #315f8d;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1rem;
}

.dashboard-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  border-top: 1px solid var(--dashboard-divider);
  padding-top: 0.8rem;
  color: #7a8ba1;
  font-size: 0.7rem;
  text-align: center;
}

@media (min-width: 640px) {
  .dashboard-footer {
    flex-direction: row;
    justify-content: center;
    gap: 0.5rem;
  }
}

@media (max-width: 767px) {
  .dashboard-hero {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.9rem;
    padding-inline: 0;
  }

  .dashboard-date {
    width: 100%;
  }
}
</style>