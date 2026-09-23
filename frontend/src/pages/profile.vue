<script setup lang="ts">
import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'

const displayName = useLocalStorage('settings-display-name', 'Mohammad Fawzy')
const email = useLocalStorage('settings-email', 'admin@athenaeum.local')

const initials = computed(() => {
  const letters = displayName.value.trim().split(/\s+/).filter(Boolean).map((part) => part[0]).slice(0, 2).join('')
  return (letters || 'MF').toUpperCase()
})
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="mb-3">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="font-display text-[28px] font-semibold leading-9 tracking-tight text-highlighted">
            My Profile
          </h1>
          <p class="mt-1 text-sm text-muted">
            Your account details and role in Athenaeum.
          </p>
        </div>
      </div>
    </div>

    <div class="flex w-full max-w-3xl flex-col gap-5">
      <section aria-labelledby="profile-identity" class="rounded-2xl bg-(--ui-bg-card) p-5 shadow-[0_8px_24px_rgba(27,59,102,0.04)] ring-1 ring-(--ui-border)">
        <div class="flex items-center gap-4">
          <UAvatar size="xl" :text="initials" color="primary" class="!bg-[#173b70] !text-[#f5c54a] shrink-0 ring-2 ring-[#edf4ff]" />
          <div class="min-w-0">
            <h2 id="profile-identity" class="truncate font-display text-[18px] font-semibold leading-tight text-highlighted">
              {{ displayName }}
            </h2>
            <p class="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
              <span class="size-1.5 shrink-0 rounded-full bg-[#20876e]" aria-hidden="true" />
              Administrator
            </p>
          </div>
        </div>

        <dl class="mt-5 grid grid-cols-1 gap-4 border-t border-(--ui-border-muted) pt-4 sm:grid-cols-2">
          <div class="min-w-0">
            <dt class="mb-1 block text-xs font-semibold text-default">
              Display name
            </dt>
            <dd class="truncate text-sm font-medium text-default" :title="displayName">
              {{ displayName }}
            </dd>
          </div>
          <div class="min-w-0">
            <dt class="mb-1 block text-xs font-semibold text-default">
              Email address
            </dt>
            <dd class="truncate text-sm font-medium text-default" :title="email">
              {{ email }}
            </dd>
          </div>
          <div class="min-w-0">
            <dt class="mb-1 block text-xs font-semibold text-default">
              Role
            </dt>
            <dd class="truncate text-sm font-medium text-default">
              Administrator
            </dd>
          </div>
          <div class="min-w-0">
            <dt class="mb-1 block text-xs font-semibold text-default">
              Library
            </dt>
            <dd class="truncate text-sm font-medium text-default">
              Athenaeum Library · Main branch
            </dd>
          </div>
        </dl>
      </section>

      <div class="flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center">
        <RouterLink
          to="/settings"
          class="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 motion-reduce:transition-none hover:bg-primary-600 active:bg-primary-700"
        >
          <UIcon name="i-lucide-settings-2" class="size-4" aria-hidden="true" />
          <span>Edit in Settings</span>
        </RouterLink>
        <RouterLink
          to="/change-password"
          class="flex items-center justify-center gap-2 rounded-xl border border-(--ui-border) bg-(--ui-bg-card) px-4 py-2.5 text-sm font-medium text-default transition-colors duration-150 motion-reduce:transition-none hover:border-(--ui-border-accented) hover:bg-(--ui-bg-accented)"
        >
          <UIcon name="i-lucide-key-round" class="size-4" aria-hidden="true" />
          <span>Change password</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
