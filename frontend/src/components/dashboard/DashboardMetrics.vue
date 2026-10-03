<script setup lang="ts">
import type { DashboardStat } from '../../composables/useDashboard'

defineProps<{
  stats: DashboardStat[]
}>()
</script>

<template>
  <section
    class="dashboard-metrics"
    aria-label="Library statistics"
  >
    <article
      v-for="stat in stats"
      :key="stat.label"
      class="dashboard-metric"
    >
      <div class="flex items-start gap-3">
        <div
          class="metric-card__icon"
          :class="stat.iconClass"
        >
          <UIcon
            :name="stat.icon"
            class="size-5"
            aria-hidden="true"
          />
        </div>
        <div class="min-w-0 flex-1">
          <p class="metric-card__label">{{ stat.label }}</p>
          <p class="metric-card__value">
            {{ stat.value.toLocaleString() }}
          </p>
          <p class="metric-card__detail">
            <span
              class="size-1.5 shrink-0 rounded-full"
              :class="stat.dotClass"
              aria-hidden="true"
            />
            {{ stat.detail }}
          </p>
        </div>
      </div>
    </article>
  </section>
</template>

<style scoped>
.dashboard-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  overflow: hidden;
  border: 1px solid var(--dashboard-border);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.9);
}

.dashboard-metric {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  transition: background-color 160ms ease;
}

.dashboard-metric + .dashboard-metric {
  border-left: 1px solid var(--dashboard-divider);
}

.dashboard-metric:hover {
  background: #f9fbfd;
}

.dashboard-metric :deep(.metric-card__icon) {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.55rem;
}

.dashboard-metric :deep(.metric-card__label) {
  font-size: 0.65rem;
}

.dashboard-metric :deep(.metric-card__value) {
  margin-top: 0.2rem;
  font-size: 1.4rem;
  font-variant-numeric: tabular-nums;
}

.dashboard-metric :deep(.metric-card__detail) {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.35rem;
  color: var(--dashboard-muted);
}

@media (max-width: 639px) {
  .dashboard-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard-metric {
    padding: 0.8rem;
  }

  .dashboard-metric + .dashboard-metric {
    border-left: 0;
  }

  .dashboard-metric:nth-child(even) {
    border-left: 1px solid var(--dashboard-divider);
  }

  .dashboard-metric:nth-child(n + 3) {
    border-top: 1px solid var(--dashboard-divider);
  }
}

@media (max-width: 380px) {
  .dashboard-metrics {
    grid-template-columns: 1fr;
  }

  .dashboard-metric:nth-child(even) {
    border-left: 0;
  }

  .dashboard-metric:nth-child(n + 2) {
    border-top: 1px solid var(--dashboard-divider);
  }
}
</style>