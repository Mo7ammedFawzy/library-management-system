<script setup lang="ts">
import { formatDate } from '../../services/borrowings'
import {
  ACTIVITY_KIND_STYLE,
  activityKindLabel,
  type ActivityItem
} from '../../composables/useDashboard'
import DashboardPanel from './DashboardPanel.vue'

defineProps<{
  items: ActivityItem[]
}>()
</script>

<template>
  <DashboardPanel
    size="wide"
    kicker="Timeline"
    title="Recent activity"
    description="Catalog and circulation updates"
    heading-id="recent-heading"
    link-label="View all activity"
    link-to="/borrowings"
    class="flex flex-col"
  >
    <div class="flex-1 divide-y divide-[#edf1f6]">
      <div
        v-for="item in items"
        :key="item.id"
        class="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 rounded-xl px-2 py-3 transition-colors hover:bg-[#f8fbff] sm:grid-cols-[2.5rem_minmax(0,1.4fr)_minmax(0,1fr)_auto] sm:items-center"
      >
        <div
          class="flex size-10 items-center justify-center rounded-xl ring-1 ring-inset ring-black/[0.04]"
          :class="ACTIVITY_KIND_STYLE[item.kind].chip"
          :title="activityKindLabel(item.kind)"
        >
          <UIcon
            :name="ACTIVITY_KIND_STYLE[item.kind].icon"
            class="size-5"
            aria-hidden="true"
          />
        </div>
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold text-[#263f5f]">{{ item.title }}</p>
          <p class="mt-0.5 flex items-center gap-1.5 truncate text-xs text-[#7486a0]">
            <span class="inline-flex rounded-md bg-[#f1f5fb] px-1.5 py-0.5 text-[10px] font-semibold text-[#36577f]">{{ activityKindLabel(item.kind) }}</span>
            <span class="truncate">{{ item.subtitle }}</span>
          </p>
        </div>
        <div class="mt-2 flex items-center gap-2 sm:mt-0">
          <div
            v-if="item.actorInitials"
            aria-hidden="true"
            class="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#f1f5fb] text-[9px] font-bold text-[#36577f]"
          >
            {{ item.actorInitials }}
          </div>
          <div
            v-else
            aria-hidden="true"
            class="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#f1f5fb] text-[#36577f]"
          >
            <UIcon name="i-lucide-library-big" class="size-3.5" />
          </div>
          <div class="min-w-0 text-xs leading-tight">
            <p class="text-[#667896]">{{ item.actorLine1 }}</p>
            <p class="truncate font-medium text-[#304968]">{{ item.actorLine2 }}</p>
          </div>
        </div>
        <p class="col-start-2 mt-2 text-xs text-[#7a8ba3] sm:col-start-auto sm:mt-0 sm:text-right">
          {{ formatDate(item.date) }}
        </p>
      </div>
      <div
        v-if="!items.length"
        class="py-12 text-center text-sm text-[#7a8ba3]"
      >
        Activity will appear here as books circulate.
      </div>
    </div>
  </DashboardPanel>
</template>