<script setup lang="ts">
const open = defineModel<boolean>('open', { required: true })

interface NavItem {
  label: string
  icon: string
  to: string
  active: boolean
}

interface NavSection {
  label: string
  items: NavItem[]
}

defineProps<{
  sections: NavSection[]
}>()

const emit = defineEmits<{
  logout: []
}>()

const activeNavClass = "bg-white/[0.11] font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)] before:absolute before:inset-y-[7px] before:left-0 before:w-1 before:rounded-r-full before:bg-[#e5a214] before:content-['']"
const inactiveNavClass = 'font-medium text-[#a9bacd] hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-1 focus-visible:ring-offset-[#172f49]'

const sidebarUi = {
  root: '[--sidebar-width:16rem] [--sidebar-width-icon:4.5rem] border-r border-white/[0.08] bg-[#142b43] text-white shadow-[8px_0_28px_rgba(18,43,68,0.08)]',
  header: 'flex min-h-[4.5rem] items-center overflow-hidden border-b border-white/[0.08] px-5 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:px-0',
  body: 'flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pb-4 pt-5 group-data-[state=collapsed]/sidebar:px-2'
}
</script>

<template>
  <USidebar
    v-model:open="open"
    collapsible="icon"
    :ui="sidebarUi"
  >
    <template #header="{ state }">
      <div
        v-if="state === 'collapsed'"
        class="flex w-full flex-col items-center gap-2 py-1"
      >
        <RouterLink
          to="/dashboard"
          aria-label="Athenaeum dashboard"
          class="flex size-10 items-center justify-center rounded-xl bg-white/10 text-[#f5c54a] ring-1 ring-white/15 transition-transform hover:scale-[1.03]"
        >
          <UIcon name="i-lucide-book-open" class="size-5" />
        </RouterLink>
        <UButton
          icon="i-lucide-panel-left-open"
          color="neutral"
          variant="ghost"
          size="xs"
          aria-label="Expand sidebar"
          class="text-[#aabbd0] hover:bg-white/10 hover:text-white"
          @click="open = !open"
        />
      </div>

      <div
        v-else
        class="flex min-w-0 flex-1 items-center justify-between gap-3"
      >
        <RouterLink
          to="/dashboard"
          class="group flex min-w-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ca9ce]"
          aria-label="Athenaeum dashboard"
        >
          <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#f5c54a] ring-1 ring-white/15 transition-transform group-hover:scale-[1.02]">
            <UIcon name="i-lucide-book-open" class="size-5" />
          </span>
          <span class="min-w-0">
            <span class="block truncate font-display text-[1.05rem] font-semibold tracking-[0.06em] text-white">ATHENAEUM</span>
            <span class="mt-0.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#b47a0d]">
              <span
                class="h-px w-4 bg-[#e5a214]"
                aria-hidden="true"
              />
              Library manager
            </span>
          </span>
        </RouterLink>
        <UButton
          icon="i-lucide-panel-left-close"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Collapse sidebar"
          class="hidden text-[#aabbd0] hover:bg-white/10 hover:text-white lg:inline-flex"
          @click="open = false"
        />
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Close menu"
          class="text-[#aabbd0] hover:bg-white/10 hover:text-white lg:hidden"
          @click="open = false"
        />
      </div>
    </template>

    <template #default="{ state }">
      <nav
        class="flex flex-1 flex-col"
        :class="state === 'expanded' ? 'px-1' : 'px-0'"
        aria-label="Primary"
      >
        <div
          v-for="section in sections"
          :key="section.label"
          class="mb-6 last:mb-0"
        >
          <p
            v-if="state === 'expanded'"
            class="mb-2 flex items-center gap-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9fb0c7]"
          >
            {{ section.label }}
          </p>
          <div
            v-else
            class="mx-auto mb-2 h-px w-6 bg-white/10"
            aria-hidden="true"
          />

          <ul class="space-y-1">
            <li
              v-for="item in section.items"
              :key="item.to"
              :class="state === 'collapsed' ? 'flex justify-center' : ''"
            >
              <RouterLink
                :to="item.to"
                class="relative flex items-center gap-3 transition-all duration-150 motion-reduce:transition-none"
                :class="[
                  state === 'expanded' ? 'rounded-xl px-3 py-2.5 text-sm' : 'size-10 justify-center rounded-xl',
                  item.active ? activeNavClass : inactiveNavClass
                ]"
                :title="state === 'collapsed' ? item.label : undefined"
                :aria-current="item.active ? 'page' : undefined"
              >
                <UIcon
                  :name="item.icon"
                  class="size-[18px] shrink-0"
                  aria-hidden="true"
                />
                <span
                  v-if="state === 'expanded'"
                  class="truncate"
                >{{ item.label }}</span>
                <span
                  v-if="state === 'collapsed' && item.active"
                  class="absolute -right-0.5 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[#e5a214]"
                  aria-hidden="true"
                />
              </RouterLink>
            </li>
          </ul>
        </div>
      </nav>
    </template>

    <template #footer="{ state }">
      <div class="flex min-w-0 flex-1 flex-col gap-2.5 border-t border-white/10 bg-[#142b43] pt-4">
        <div
          v-if="state === 'expanded'"
          class="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
        >
          <span class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#e5a214]/15 text-[#f5c54a] ring-1 ring-[#e5a214]/25">
            <UIcon
              name="i-lucide-landmark"
              class="size-4"
              aria-hidden="true"
            />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block truncate text-xs font-semibold text-white">Athenaeum Library</span>
            <span class="mt-0.5 flex items-center gap-1 text-[10px] text-[#aabbd0]">
              <span
                class="size-1.5 rounded-full bg-[#20876e]"
                aria-hidden="true"
              />
              Open · Main branch
            </span>
          </span>
        </div>
        <UButton
          color="error"
          variant="ghost"
          icon="i-lucide-log-out"
          aria-label="Logout"
          class="!h-auto !w-full !rounded-xl !px-2 !py-2.5 !text-[#f6b5aa] hover:!bg-white/10 focus-visible:!ring-2 focus-visible:!ring-[#f6b5aa]"
          :class="state === 'collapsed' ? '!justify-center' : '!justify-start !gap-3'"
          @click="emit('logout')"
        >
          <span
            v-if="state === 'expanded'"
            class="text-sm font-medium"
          >Logout</span>
        </UButton>
      </div>
    </template>
  </USidebar>
</template>