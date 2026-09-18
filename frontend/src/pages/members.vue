<script setup lang="ts">
import { ref } from 'vue'
import type { BreadcrumbItem } from '@nuxt/ui'

const breadcrumbItems = ref<BreadcrumbItem[]>([
  { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/dashboard' },
  { label: 'Members', icon: 'i-lucide-users-round' }
])
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="mb-4">
      <UBreadcrumb class="mb-2" :items="breadcrumbItems">
        <template #item="{ item }">
          <span
            :class="[
              'flex items-center gap-1.5 text-sm transition-colors',
              item.to ? 'text-muted hover:text-highlighted cursor-pointer' : 'font-semibold text-highlighted'
            ]"
          >
            <UIcon
              v-if="item.icon"
              :name="item.icon"
              class="size-4 text-muted"
              aria-hidden="true"
            />
            {{ item.label }}
          </span>
        </template>
        <template #separator>
          <UIcon name="i-lucide-chevron-right" class="size-3.5 text-muted" aria-hidden="true" />
        </template>
      </UBreadcrumb>
      <p class="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a99ae]">
        <span class="h-[3px] w-8 rounded-full bg-[#e5a214]" aria-hidden="true" />
        Workspace · Members
      </p>
      <h1 id="members-heading" class="font-serif text-[28px] font-bold leading-9 tracking-[-0.035em] text-[#132f57] sm:text-[30px]">
        Members
      </h1>
      <p class="mt-1 max-w-xl text-sm leading-relaxed text-[#667896]">
        Manage library members and their accounts.
      </p>
    </div>

    <section
      aria-labelledby="members-empty-title"
      class="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#e4ebf3] bg-white px-6 py-12 text-center shadow-[0_8px_24px_rgba(27,59,102,0.04)] sm:py-16"
    >
      <span class="flex size-12 items-center justify-center rounded-xl bg-[#edf4ff] text-[#173b70] ring-1 ring-inset ring-black/[0.04]">
        <UIcon name="i-lucide-users-round" class="size-5" aria-hidden="true" />
      </span>
      <p id="members-empty-title" class="text-sm font-semibold text-[#132f57]">
        Member directory coming soon
      </p>
      <p class="w-full max-w-sm text-sm leading-relaxed text-[#667896]">
        Member profiles, contact details, and loan history will live here.
        For now, you can manage member loans from Borrowings.
      </p>
      <div class="mt-2 flex flex-col items-center gap-2 sm:flex-row">
        <UButton
          to="/borrowings"
          icon="i-lucide-repeat-2"
          class="!h-[38px] !rounded-xl !px-4 shadow-sm"
        >
          View borrowings
        </UButton>
        <UButton
          to="/books"
          color="neutral"
          variant="outline"
          icon="i-lucide-library-big"
          class="!h-[38px] !rounded-xl !bg-white !px-4 shadow-sm"
        >
          Browse books
        </UButton>
      </div>
    </section>
  </div>
</template>
