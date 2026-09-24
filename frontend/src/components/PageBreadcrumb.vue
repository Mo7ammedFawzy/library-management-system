<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<template>
  <nav
    aria-label="Breadcrumb"
    class="mb-2 flex min-h-6 items-center"
  >
    <UBreadcrumb
      :items="items"
      class="min-w-0"
    >
      <template #item="{ item }">
        <RouterLink
          v-if="item.to"
          :to="item.to"
          class="group inline-flex min-h-7 items-center gap-1.5 rounded-md px-1.5 text-xs font-medium text-[#6d8095] transition-colors hover:bg-[#edf3f8] hover:text-[#173b70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ca9ce]"
        >
          <UIcon
            v-if="item.icon"
            :name="item.icon"
            class="size-3.5 text-[#8a99ae] transition-colors group-hover:text-[#2161bf]"
            aria-hidden="true"
          />
          {{ item.label }}
        </RouterLink>
        <span
          v-else
          class="relative inline-flex min-h-7 items-center gap-1.5 rounded-r-md py-0.5 pl-2.5 pr-1.5 text-xs font-semibold text-[#173b70] before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:bg-[#e5a214] before:content-['']"
          aria-current="page"
        >
          <UIcon
            v-if="item.icon"
            :name="item.icon"
            class="size-3.5 text-[#2b5b86]"
            aria-hidden="true"
          />
          {{ item.label }}
        </span>
      </template>
      <template #separator>
        <UIcon
          name="i-lucide-chevron-right"
          class="size-3 text-[#b5c1d0]"
          aria-hidden="true"
        />
      </template>
    </UBreadcrumb>
  </nav>
</template>
