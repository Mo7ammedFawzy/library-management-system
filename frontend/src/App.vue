<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'
import {
  Notivue,
  Notification,
  push,
  lightTheme,
  type NotivueItem,
  type NotivueTheme
} from 'notivue'
import type { DropdownMenuItem } from '@nuxt/ui'
import { checkBackendHealth } from './services/api'
import { logout } from './services/auth'

onMounted(async () => {
  const notification = push.promise({
    title: 'Connecting',
    message: 'Checking the server connection...',
    props: { compact: true }
  })
  const [healthy] = await Promise.all([
    checkBackendHealth(),
    new Promise((resolve) => setTimeout(resolve, 3000))
  ])
  if (healthy) {
    notification.resolve({
      title: 'Server connected',
      message: 'Everything is up and running. Enjoy!',
      props: { compact: true }
    })
  } else {
    notification.reject({
      title: 'Server not connected',
      message: 'No worries — sample data is being used for now.',
      props: { compact: true }
    })
  }
})

const route = useRoute()
const router = useRouter()

const isAuthPage = computed(() => ['/login', '/register'].includes(route.path))

const notivueCompactTheme: NotivueTheme = {
  ...lightTheme,
  '--nv-width': '18rem',
  '--nv-spacing': '0.4375rem',
  '--nv-radius': '0.75rem',
  '--nv-icon-size': '1rem',
  '--nv-title-size': '0.8125rem',
  '--nv-message-size': '0.75rem'
}

function getNotivueTheme(item: NotivueItem) {
  return item.props?.compact === true ? notivueCompactTheme : lightTheme
}

const sidebarOpen = useLocalStorage('sidebar-open', true)

const sidebarUi = {
  root: '[--sidebar-width:16rem] [--sidebar-width-icon:4.5rem] border-r border-[#e4ebf3] bg-white/95 backdrop-blur-sm',
  header: 'flex min-h-20 items-center overflow-hidden border-b border-[#edf1f6] px-5 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:px-0',
  body: 'flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pb-4 pt-4 group-data-[state=collapsed]/sidebar:px-2'
}

const navItem = (label: string, icon: string, to: string) => ({
  label,
  icon,
  to,
  active: route.path === to
})

const navSections = computed(() => [
  {
    label: 'Workspace',
    items: [
      navItem('Dashboard', 'i-lucide-layout-dashboard', '/dashboard'),
      navItem('Books', 'i-lucide-library-big', '/books'),
      navItem('Members', 'i-lucide-users-round', '/members'),
      navItem('Borrowings', 'i-lucide-repeat-2', '/borrowings')
    ]
  },
  {
    label: 'Catalog',
    items: [
      navItem('Authors', 'i-lucide-pen-line', '/authors'),
      navItem('Categories', 'i-lucide-tags', '/categories')
    ]
  },
  {
    label: 'Preferences',
    items: [navItem('Settings', 'i-lucide-settings-2', '/settings')]
  }
])

const activeNavClass = "bg-[#edf4ff] font-semibold text-[#173b70] shadow-[inset_0_0_0_1px_#dbe7f7] before:absolute before:inset-y-[6px] before:left-0 before:w-1 before:rounded-r-full before:bg-[#e5a214] before:content-['']"
const inactiveNavClass = 'font-medium text-[#60728e] hover:bg-[#f5f8fc] hover:text-[#173b70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ca9ce] focus-visible:ring-offset-1'

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function closeSidebar() {
  sidebarOpen.value = false
}

const headerMenuItems: DropdownMenuItem[][] = [
  [
    {
      label: 'Profile',
      icon: 'i-lucide-circle-user-round',
      to: '/profile'
    },
    {
      label: 'Change password',
      icon: 'i-lucide-key-round',
      to: '/change-password'
    }
  ]
]

function handleLogout() {
  logout()
  router.push('/login')
}
</script>

<template>
  <Suspense>
    <UApp>
      <div v-if="isAuthPage" class="min-h-svh w-full bg-[#f7f9fc] text-default">
        <RouterView />
      </div>

      <div v-else class="flex h-svh overflow-hidden bg-[#f7f9fc]">
        <USidebar
          v-model:open="sidebarOpen"
          collapsible="icon"
          :ui="sidebarUi"
        >
          <template #header="{ state }">
            <div v-if="state === 'collapsed'" class="flex w-full flex-col items-center gap-2 py-1">
              <RouterLink
                to="/dashboard"
                aria-label="Athenaeum dashboard"
                class="flex size-10 items-center justify-center rounded-xl bg-[#173b70] text-[#f5c54a] shadow-[0_8px_16px_rgba(23,59,112,0.22)] transition-transform hover:scale-[1.03]"
              >
                <UIcon name="i-lucide-book-open" class="size-5" />
              </RouterLink>
              <UButton
                icon="i-lucide-panel-left-open"
                color="neutral"
                variant="ghost"
                size="xs"
                aria-label="Expand sidebar"
                class="text-[#5e718d] hover:bg-[#f1f5fb] hover:text-[#173b70]"
                @click="toggleSidebar"
              />
            </div>

            <div v-else class="flex min-w-0 flex-1 items-center justify-between gap-3">
              <RouterLink to="/dashboard" class="group flex min-w-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ca9ce]" aria-label="Athenaeum dashboard">
                <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#173b70] text-[#f5c54a] shadow-[0_8px_16px_rgba(23,59,112,0.22)] ring-1 ring-[#132f57] transition-transform group-hover:scale-[1.02]">
                  <UIcon name="i-lucide-book-open" class="size-5" />
                </span>
                <span class="min-w-0">
                  <span class="block truncate font-display text-[1.05rem] font-semibold tracking-[0.06em] text-[#132f57]">ATHENAEUM</span>
                  <span class="mt-0.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#b47a0d]">
                    <span class="h-px w-4 bg-[#e5a214]" aria-hidden="true" />
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
                class="hidden text-[#5e718d] lg:inline-flex"
                @click="toggleSidebar"
              />
              <UButton
                icon="i-lucide-x"
                color="neutral"
                variant="ghost"
                size="sm"
                aria-label="Close menu"
                class="text-[#5e718d] lg:hidden"
                @click="closeSidebar"
              />
            </div>
          </template>

          <template #default="{ state }">
            <nav class="flex flex-1 flex-col" :class="state === 'expanded' ? 'px-1' : 'px-0'" aria-label="Primary">
              <div v-for="section in navSections" :key="section.label" class="mb-6 last:mb-0">
                <p
                  v-if="state === 'expanded'"
                  class="mb-2 flex items-center gap-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#98a6ba]"
                >
                  {{ section.label }}
                </p>
                <div v-else class="mx-auto mb-2 h-px w-6 bg-[#edf1f6]" aria-hidden="true" />

                <ul class="space-y-1">
                  <li v-for="item in section.items" :key="item.to" :class="state === 'collapsed' ? 'flex justify-center' : ''">
                    <RouterLink
                      :to="item.to"
                      class="relative flex items-center gap-3 transition-all duration-150 motion-reduce:transition-none"
                      :class="[
                        state === 'expanded' ? 'rounded-xl px-3 py-2.5 text-sm' : 'size-10 justify-center rounded-xl',
                        item.active
                          ? activeNavClass
                          : inactiveNavClass
                      ]"
                      :title="state === 'collapsed' ? item.label : undefined"
                      :aria-current="item.active ? 'page' : undefined"
                    >
                      <UIcon :name="item.icon" class="size-[18px] shrink-0" aria-hidden="true" />
                      <span v-if="state === 'expanded'" class="truncate">{{ item.label }}</span>
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
            <div class="flex min-w-0 flex-1 flex-col gap-2.5 border-t border-[#edf1f6] bg-white/60 pt-3">
              <div v-if="state === 'expanded'" class="flex items-center gap-2.5 rounded-xl border border-[#e4ebf3] bg-[#f6f8fc] px-3 py-2.5">
                <span class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#173b70] text-[#f5c54a] shadow-[0_4px_12px_rgba(23,59,112,0.18)]">
                  <UIcon name="i-lucide-landmark" class="size-4" aria-hidden="true" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-xs font-semibold text-[#132f57]">Athenaeum Library</span>
                  <span class="mt-0.5 flex items-center gap-1 text-[10px] text-[#7f8fa5]">
                    <span class="size-1.5 rounded-full bg-[#20876e]" aria-hidden="true" />
                    Open · Main branch
                  </span>
                </span>
              </div>
              <UButton
                color="error"
                variant="ghost"
                icon="i-lucide-log-out"
                aria-label="Logout"
                class="!h-auto !w-full !rounded-xl !px-2 !py-2.5 !text-[#a2433c] hover:!bg-[#fff3f1] focus-visible:!ring-2 focus-visible:!ring-[#e8a09a]"
                :class="state === 'collapsed' ? '!justify-center' : '!justify-start !gap-3'"
                @click="handleLogout"
              >
                <span v-if="state === 'expanded'" class="text-sm font-medium">Logout</span>
              </UButton>
            </div>
          </template>
        </USidebar>

        <div class="flex min-w-0 flex-1 flex-col bg-[#f7f9fc]">
          <UHeader :ui="{ root: 'sticky top-0 z-30 !h-20 border-b border-[#e4ebf3] bg-white/90 px-4 backdrop-blur-md sm:px-6' }">
            <template #left>
              <div class="flex w-full items-center gap-2.5">
                <UButton
                  icon="i-lucide-panel-left-open"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  aria-label="Open sidebar"
                  class="text-[#5e718d] hover:bg-[#f1f5fb] hover:text-[#173b70] lg:hidden"
                  @click="toggleSidebar"
                />
                <label class="group relative hidden w-full max-w-xl md:block">
                  <UIcon name="i-lucide-search" class="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#71829a] transition-colors group-focus-within:text-[#173b70]" aria-hidden="true" />
                  <input
                    type="search"
                    placeholder="Search books, members, loans..."
                    aria-label="Search books, members, loans"
                    class="h-10 w-full rounded-xl border border-[#e4ebf3] bg-[#f9fbfe] pl-10 pr-16 text-sm text-[#263f5f] outline-none transition-all placeholder:text-[#92a0b2] hover:border-[#cdd9e8] focus:border-[#8ca9ce] focus:bg-white focus:ring-4 focus:ring-[#edf4ff]"
                  >
                  <kbd class="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border border-[#e4ebf3] bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#7a8ba3] lg:inline-flex" aria-hidden="true">
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
                    class="!rounded-xl text-[#304968] ring-1 ring-transparent transition-colors hover:!bg-[#f1f5fb] hover:text-[#173b70] focus-visible:!ring-[#8ca9ce]"
                  />
                  <span class="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e5a214] px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white" aria-hidden="true">3</span>
                </div>

                <span class="hidden h-6 w-px bg-[#e4ebf3] sm:block" aria-hidden="true" />

                <UDropdownMenu
                  :items="headerMenuItems"
                  :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
                  :ui="{ content: 'w-52 rounded-xl border-[#e4ebf3]' }"
                >
                  <UButton color="neutral" variant="ghost" aria-label="Account options" class="!h-auto !gap-2.5 !rounded-xl !border !border-transparent !px-2 !py-1.5 transition-colors hover:!border-[#e4ebf3] hover:!bg-[#f6f8fc] focus-visible:!ring-2 focus-visible:!ring-[#8ca9ce]">
                    <span class="relative shrink-0">
                      <UAvatar size="sm" text="MF" color="primary" class="!bg-[#173b70] !text-[#f5c54a] ring-2 ring-[#edf4ff]" />
                      <span class="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white bg-[#20876e]" aria-hidden="true" />
                    </span>
                    <span class="hidden min-w-0 text-left sm:block">
                      <span class="block max-w-28 truncate text-sm font-semibold text-[#132f57]">Mohammad Fawzy</span>
                      <span class="block truncate text-[11px] text-[#7a8ba3]">Administrator</span>
                    </span>
                    <UIcon name="i-lucide-chevron-down" class="hidden size-4 shrink-0 text-[#7486a0] sm:block" aria-hidden="true" />
                  </UButton>
                </UDropdownMenu>
              </div>
            </template>
          </UHeader>

          <main class="app-scroll flex min-h-0 w-full flex-1 flex-col overflow-y-scroll overflow-x-hidden px-4 py-5 lg:px-8 lg:py-7">
            <RouterView />
          </main>
        </div>
      </div>
    </UApp>
  </Suspense>

  <Notivue v-slot="item">
    <Notification :item="item" :theme="getNotivueTheme(item)" />
  </Notivue>
</template>

<style>
.Notivue__notification[data-notivue='promise-reject'] {
  --nv-bg: var(--nv-warning-bg);
  --nv-fg: var(--nv-warning-fg);
  --nv-accent: var(--nv-warning-accent, var(--nv-global-accent));
  --nv-border: var(--nv-warning-border);
}
</style>
