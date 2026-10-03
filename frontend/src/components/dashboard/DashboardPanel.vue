<script setup lang="ts">
defineProps<{
  size: 'wide' | 'narrow'
  kicker: string
  title: string
  description: string
  headingId: string
  linkLabel?: string
  linkTo?: string
}>()
</script>

<template>
  <article
    class="dashboard-panel"
    :class="size === 'wide' ? 'dashboard-panel--wide' : 'dashboard-panel--narrow'"
    :aria-labelledby="headingId"
  >
    <div class="data-panel__header">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a99ae]">
          {{ kicker }}
        </p>
        <h2
          :id="headingId"
          class="mt-1 font-display text-lg font-bold leading-tight text-[#172f49]"
        >
          {{ title }}
        </h2>
        <p class="mt-0.5 text-xs text-[#7486a0]">
          {{ description }}
        </p>
      </div>

      <RouterLink
        v-if="linkTo && linkLabel"
        :to="linkTo"
        :aria-label="linkLabel"
        class="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-[#244a6c] transition-colors hover:bg-[#edf4ff] hover:text-[#2b65ad] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ca9ce]"
      >
        {{ linkLabel }}
        <UIcon
          name="i-lucide-chevron-right"
          class="size-3.5"
          aria-hidden="true"
        />
      </RouterLink>

      <slot name="aside" />
    </div>

    <slot />
  </article>
</template>

<style scoped>
.dashboard-panel {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--dashboard-border);
  border-radius: 0.75rem;
  background: #fff;
}

.dashboard-panel--wide {
  grid-column: span 7;
}

.dashboard-panel--narrow {
  grid-column: span 5;
}

.dashboard-panel :deep(.data-panel__header) {
  min-height: 4.5rem;
  align-items: center;
  border-bottom-color: var(--dashboard-divider);
  background: transparent;
  padding: 0.85rem 1rem;
}

.dashboard-panel a {
  min-height: 2.25rem;
  touch-action: manipulation;
}

@media (max-width: 1023px) {
  .dashboard-panel--wide,
  .dashboard-panel--narrow {
    grid-column: 1 / -1;
  }
}

@media (max-width: 767px) {
  .dashboard-panel :deep(.data-panel__header) {
    align-items: flex-start;
    padding: 0.8rem;
  }

  .dashboard-panel a {
    min-height: 2.75rem;
  }
}
</style>