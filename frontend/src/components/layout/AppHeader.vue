<script setup lang="ts">
import { computed } from 'vue'
import type { DropdownMenuItem } from '@nuxt/ui'

const props = defineProps<{
  displayName: string
  role: string
  menuItems: DropdownMenuItem[][]
}>()

const emit = defineEmits<{
  openSidebar: []
}>()

const initials = computed(() =>
  props.displayName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'MF'
)
</script>

<template>
  <UHeader :ui="{ root: 'sticky top-0 z-30 !h-[4.5rem] border-b border-[#dce5ef] bg-white px-4 shadow-[0_1px_0_rgba(24,47,73,0.03)] sm:px-6' }">
    <template #left>
      <div class="flex w-full min-w-0 items-center gap-2.5">
        <UButton
          icon="i-lucide-panel-left-open"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Open sidebar"
          class="text-[#5e718d] hover:bg-[#f1f5fb] hover:text-[#173b70] lg:hidden"
          @click="emit('openSidebar')"
        />
        <label class="group relative hidden w-full max-w-xl md:block">
          <UIcon
            name="i-lucide-search"
            class="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#71829a] transition-colors group-focus-within:text-[#173b70]"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search books, members, loans..."
            aria-label="Search books, members, loans"
            class="h-10 w-full rounded-xl border border-[#dce5ef] bg-[#f8fafc] pl-10 pr-16 text-sm text-[#263f5f] outline-none transition-all placeholder:text-[#92a0b2] hover:border-[#b8c8dc] focus:border-[#8ca9ce] focus:bg-white focus:ring-4 focus:ring-[#edf4ff]"
          >
          <kbd
            class="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border border-[#e4ebf3] bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#7a8ba3] lg:inline-flex"
            aria-hidden="true"
          >
            ⌘K
          </kbd>
        </label>
        <UButton
          icon="i-lucide-search"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Search"
          class="text-[#304968] hover:bg-[#f1f5fb] md:hidden"
        />
      </div>
    </template>

    <template #right>
      <div class="flex items-center gap-1.5 sm:gap-3">
        <div class="relative">
          <UButton
            icon="i-lucide-bell"
            color="neutral"
            variant="ghost"
            aria-label="Notifications, 3 unread"
            class="!rounded-xl !bg-[#f8fafc] text-[#304968] ring-1 ring-[#dce5ef] transition-colors hover:!bg-[#eef4fa] hover:text-[#173b70] focus-visible:!ring-[#8ca9ce]"
          />
          <span
            class="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e5a214] px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white"
            aria-hidden="true"
          >3</span>
        </div>

        <span
          class="hidden h-6 w-px bg-[#e4ebf3] sm:block"
          aria-hidden="true"
        />

        <UDropdownMenu
          :items="menuItems"
          :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
          :ui="{ content: 'w-52 rounded-xl border-[#e4ebf3]' }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            aria-label="Account options"
            class="!h-auto !gap-2.5 !rounded-xl !border !border-transparent !px-2 !py-1.5 transition-colors hover:!border-[#e4ebf3] hover:!bg-[#f6f8fc] focus-visible:!ring-2 focus-visible:!ring-[#8ca9ce]"
          >
            <span class="relative shrink-0">
              <UAvatar
                size="sm"
                :text="initials"
                color="primary"
                class="!bg-[#315f8d] !text-white ring-2 ring-[#e8f0f7] shadow-[0_2px_8px_rgba(23,59,112,0.14)]"
              />
              <span
                class="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white bg-[#20876e]"
                aria-hidden="true"
              />
            </span>
            <span class="hidden min-w-0 text-left sm:block">
              <span class="block max-w-28 truncate text-sm font-semibold text-[#132f57]">{{ displayName }}</span>
              <span class="block truncate text-[11px] text-[#7a8ba3]">{{ role }}</span>
            </span>
            <UIcon
              name="i-lucide-chevron-down"
              class="hidden size-4 shrink-0 text-[#7486a0] sm:block"
              aria-hidden="true"
            />
          </UButton>
        </UDropdownMenu>
      </div>
    </template>
  </UHeader>
</template>