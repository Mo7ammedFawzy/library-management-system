<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<template>
  <nav aria-label="Breadcrumb" class="mb-5">
    <UBreadcrumb :items="items">
      <template #item="{ item }">
        <RouterLink
          v-if="item.to"
          :to="item.to"
          class="group inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-[#667896] transition-colors hover:bg-[#edf4ff] hover:text-[#173b70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ca9ce]"
        >
          <UIcon
            v-if="item.icon"
            :name="item.icon"
            class="size-4 text-[#8a99ae] transition-colors group-hover:text-[#2161bf]"
            aria-hidden="true"
          />
          {{ item.label }}
        </RouterLink>
        <span
          v-else
          class="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#edf4ff] px-2 text-sm font-semibold text-[#173b70]"
          aria-current="page"
        >
          <UIcon
            v-if="item.icon"
            :name="item.icon"
            class="size-4 text-[#2161bf]"
            aria-hidden="true"
          />
          {{ item.label }}
        </span>
      </template>
      <template #separator>
        <UIcon name="i-lucide-chevron-right" class="size-3.5 text-[#b5c1d0]" aria-hidden="true" />
      </template>
    </UBreadcrumb>
  </nav>
</template>
