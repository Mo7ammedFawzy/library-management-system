<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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
import type { BreadcrumbItem, DropdownMenuItem } from '@nuxt/ui'
import { checkBackendHealth } from './services/api'
import { fetchCurrentUser, isLoggedIn, logout } from './services/auth'
import AppHeader from './components/layout/AppHeader.vue'
import AppSidebar from './components/layout/AppSidebar.vue'
import PageBreadcrumb from './components/PageBreadcrumb.vue'

const currentUser = ref<Awaited<ReturnType<typeof fetchCurrentUser>> | null>(null)

const displayName = computed(() => currentUser.value?.name ?? '')
const userRole = computed(() => (currentUser.value?.isAdmin ? 'Administrator' : 'Member'))

onMounted(async () => {
  if (isLoggedIn()) {
    try {
      currentUser.value = await fetchCurrentUser()
    } catch {
      // A stale or rejected token: drop it and send the user back to login.
      logout()
      router.push('/login')
    }
  }

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
const isDashboardPage = computed(() => route.path === '/dashboard')

const dashboardBreadcrumb: BreadcrumbItem = {
  label: 'Dashboard',
  icon: 'i-lucide-layout-dashboard',
  to: '/dashboard'
}

const breadcrumbsByPath: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [
    { label: 'Dashboard', icon: 'i-lucide-layout-dashboard' }
  ],
  '/books': [
    dashboardBreadcrumb,
    { label: 'Books', icon: 'i-lucide-library-big' }
  ],
  '/members': [
    dashboardBreadcrumb,
    { label: 'Members', icon: 'i-lucide-users-round' }
  ],
  '/borrowings': [
    dashboardBreadcrumb,
    { label: 'Borrowings', icon: 'i-lucide-repeat-2' }
  ],
  '/authors': [
    dashboardBreadcrumb,
    { label: 'Authors', icon: 'i-lucide-pen-line' }
  ],
  '/categories': [
    dashboardBreadcrumb,
    { label: 'Categories', icon: 'i-lucide-tags' }
  ],
  '/settings': [
    dashboardBreadcrumb,
    { label: 'Settings', icon: 'i-lucide-settings-2' }
  ],
  '/profile': [
    dashboardBreadcrumb,
    { label: 'Profile', icon: 'i-lucide-circle-user-round' }
  ],
  '/change-password': [
    { label: 'Profile', icon: 'i-lucide-circle-user-round', to: '/profile' },
    { label: 'Change password', icon: 'i-lucide-key-round' }
  ],
  '/shot': [
    dashboardBreadcrumb,
    { label: 'Preview', icon: 'i-lucide-image' }
  ]
}

const pageBreadcrumbItems = computed(() => {
  if (breadcrumbsByPath[route.path]) {
    return breadcrumbsByPath[route.path]
  }

  const label = route.path
    .split('/')
    .filter(Boolean)
    .pop()
    ?.replace(/-/g, ' ')
    .replace(/^./, character => character.toUpperCase()) || 'Workspace'

  return [dashboardBreadcrumb, { label }]
})

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

function openSidebar() {
  sidebarOpen.value = true
}

function handleLogout() {
  logout()
  router.push('/login')
}
</script>

<template>
  <Suspense>
    <UApp>
      <div
        v-if="isAuthPage"
        class="min-h-svh w-full bg-(--ui-bg) text-default"
      >
        <RouterView />
      </div>

      <div
        v-else
        class="app-shell flex h-svh overflow-hidden"
      >
        <AppSidebar
          v-model:open="sidebarOpen"
          :sections="navSections"
          @logout="handleLogout"
        />

        <div class="app-content flex min-w-0 flex-1 flex-col">
          <AppHeader
            :display-name="displayName"
            :role="userRole"
            :menu-items="headerMenuItems"
            @open-sidebar="openSidebar"
          />

          <main
            class="app-scroll flex min-h-0 w-full flex-1 flex-col overflow-x-hidden px-4 py-3 sm:px-6 lg:px-8"
            :class="isDashboardPage ? 'overflow-y-scroll pb-5 lg:py-7' : 'overflow-hidden pb-3 lg:py-4'"
          >
            <div class="mx-auto w-full max-w-[1400px] shrink-0">
              <PageBreadcrumb :items="pageBreadcrumbItems" />
            </div>
            <RouterView />
          </main>
        </div>
      </div>
    </UApp>
  </Suspense>

  <Notivue v-slot="item">
    <Notification
      :item="item"
      :theme="getNotivueTheme(item)"
    />
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