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
  root: '[--sidebar-width:16rem] [--sidebar-width-icon:4.5rem] border-r border-[#e4ebf3] bg-white',
  header: 'flex min-h-20 items-center overflow-hidden px-5 group-data-[state=collapsed]/sidebar:px-0',
  body: 'flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pb-4 pt-2 group-data-[state=collapsed]/sidebar:px-2'
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

const quickActions = [
  { label: 'Add new book', icon: 'i-lucide-plus', to: '/books' },
  { label: 'Add new member', icon: 'i-lucide-user-plus', to: '/members' },
  { label: 'New borrowing', icon: 'i-lucide-book-plus', to: '/borrowings' }
]

const activeNavClass = "bg-[#edf4ff] text-[#173b70] before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:bg-[#e5a214] before:content-['']"
const inactiveNavClass = 'text-[#60728e] hover:bg-[#f5f8fc] hover:text-[#173b70]'

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
            <div v-if="state === 'collapsed'" class="flex w-full items-center justify-center">
              <UButton
                icon="i-lucide-panel-left-open"
                color="neutral"
                variant="ghost"
                size="sm"
                aria-label="Expand sidebar"
                class="text-[#304968]"
                @click="toggleSidebar"
              />
            </div>

            <div v-else class="flex min-w-0 flex-1 items-center justify-between gap-3">
              <RouterLink to="/dashboard" class="flex min-w-0 items-center gap-2.5" aria-label="Athenaeum dashboard">
                <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#173b70] text-[#f5c54a] shadow-[0_8px_16px_rgba(23,59,112,0.18)]">
                  <UIcon name="i-lucide-book-open" class="size-5" />
                </span>
                <span class="min-w-0">
                  <span class="block truncate font-serif text-lg font-bold tracking-[0.04em] text-[#173b70]">ATHENAEUM</span>
                  <span class="block truncate text-[9px] font-bold uppercase tracking-[0.12em] text-[#b47a0d]">Library manager</span>
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
            <nav class="flex flex-1 flex-col" :class="state === 'expanded' ? 'px-1' : 'px-0'">
              <div v-for="section in navSections" :key="section.label" class="mb-5 last:mb-0">
                <p
                  v-if="state === 'expanded'"
                  class="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.13em] text-[#98a6ba]"
                >
                  {{ section.label }}
                </p>

                <ul class="space-y-1">
                  <li v-for="item in section.items" :key="item.to" :class="state === 'collapsed' ? 'flex justify-center' : ''">
                    <RouterLink
                      :to="item.to"
                      class="relative flex items-center gap-3 font-medium transition-colors"
                      :class="[
                        state === 'expanded' ? 'rounded-xl px-3 py-2.5 text-sm' : 'size-10 justify-center rounded-xl',
                        item.active
                          ? activeNavClass
                          : inactiveNavClass
                      ]"
                      :title="state === 'collapsed' ? item.label : undefined"
                    >
                      <UIcon :name="item.icon" class="size-[18px] shrink-0" />
                      <span v-if="state === 'expanded'" class="truncate">{{ item.label }}</span>
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </nav>
          </template>

          <template #footer="{ state }">
            <div class="flex min-w-0 flex-1 flex-col gap-3 border-t border-[#edf1f6] pt-3">
              <div v-if="state === 'expanded'" class="flex items-center gap-2.5 rounded-xl bg-[#f6f8fc] px-3 py-2.5">
                <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#173b70] ring-1 ring-[#e4ebf3]">
                  <UIcon name="i-lucide-landmark" class="size-4" />
                </span>
                <span class="min-w-0">
                  <span class="block truncate text-xs font-semibold text-[#304968]">Athenaeum Library</span>
                  <span class="block truncate text-[10px] text-[#7f8fa5]">A thoughtful collection</span>
                </span>
              </div>
              <UButton
                color="error"
                variant="ghost"
                icon="i-lucide-log-out"
                aria-label="Logout"
                class="!h-auto !w-full !rounded-xl !px-2 !py-2.5 !text-[#a2433c] hover:!bg-[#fff3f1]"
                :class="state === 'collapsed' ? '!justify-center' : '!justify-start !gap-3'"
                @click="handleLogout"
              >
                <span v-if="state === 'expanded'" class="text-sm font-medium">Logout</span>
              </UButton>
            </div>
          </template>
        </USidebar>

        <div class="flex min-w-0 flex-1 flex-col bg-[#f7f9fc]">
          <UHeader :ui="{ root: '!h-20 border-b border-[#e4ebf3] bg-white px-4 sm:px-6' }">
            <template #left>
              <div class="flex w-full items-center gap-3">
                <label class="relative hidden w-full max-w-xl md:block">
                  <UIcon name="i-lucide-search" class="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#71829a]" />
                  <input
                    type="search"
                    placeholder="Search books, members, loans..."
                    class="h-10 w-full rounded-xl border border-[#e4ebf3] bg-[#f9fbfe] pl-10 pr-4 text-sm text-[#263f5f] outline-none transition-colors placeholder:text-[#92a0b2] focus:border-[#8ca9ce] focus:bg-white focus:ring-4 focus:ring-[#edf4ff]"
                  >
                </label>
              </div>
            </template>

            <template #right>
              <div class="flex items-center gap-2 sm:gap-4">
                <div class="relative">
                  <UButton icon="i-lucide-bell" color="neutral" variant="ghost" aria-label="Notifications" class="text-[#304968]" />
                  <span class="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-[#e5a214] text-[8px] font-bold text-white ring-2 ring-white">3</span>
                </div>

                <UDropdownMenu
                  :items="headerMenuItems"
                  :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
                  :ui="{ content: 'w-48' }"
                >
                  <UButton color="neutral" variant="ghost" aria-label="Account options" class="!h-auto !gap-2 !rounded-xl !px-1.5 !py-1">
                    <UAvatar size="sm" text="MF" color="primary" class="shrink-0 ring-2 ring-[#edf4ff]" />
                    <span class="hidden min-w-0 text-left sm:block">
                      <span class="block truncate text-sm font-semibold text-[#263f5f]">Mohammad Fawzy</span>
                      <span class="block truncate text-[11px] text-[#7a8ba3]">Administrator</span>
                    </span>
                    <UIcon name="i-lucide-chevron-down" class="hidden size-4 shrink-0 text-[#7486a0] sm:block" />
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
