<script setup lang="ts">
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'

const displayName = useLocalStorage('settings-display-name', 'Mohammad Fawzy')
const email = useLocalStorage('settings-email', 'admin@athenaeum.local')
const loanDays = useLocalStorage('settings-loan-days', 14)
const emailReminders = useLocalStorage('settings-email-reminders', true)
const overdueDigest = useLocalStorage('settings-overdue-digest', false)

const isSaving = ref(false)
const savedAt = ref('')
const saveError = ref('')

async function handleSave() {
  isSaving.value = true
  saveError.value = ''
  try {
    await new Promise((resolve) => setTimeout(resolve, 600))
    savedAt.value = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date())
  } catch {
    saveError.value = 'Could not save settings. Please try again.'
  } finally {
    isSaving.value = false
  }
}

function handleReset() {
  displayName.value = 'Mohammad Fawzy'
  email.value = 'admin@athenaeum.local'
  loanDays.value = 14
  emailReminders.value = true
  overdueDigest.value = false
  savedAt.value = ''
  saveError.value = ''
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="mb-3">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="font-display text-[28px] font-semibold leading-9 tracking-tight text-highlighted">
            Settings
          </h1>
          <p class="mt-1 text-sm text-muted">
            Configure your account and library preferences.
          </p>
        </div>
      </div>
    </div>

    <form
      class="flex w-full max-w-3xl flex-col gap-5"
      @submit.prevent="handleSave"
    >
      <section
        aria-labelledby="settings-account"
        class="rounded-2xl bg-(--ui-bg-card) p-5 shadow-[0_8px_24px_rgba(27,59,102,0.04)] ring-1 ring-(--ui-border)"
      >
        <div class="flex items-center gap-3">
          <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#edf4ff] text-[#2161bf]">
            <UIcon
              name="i-lucide-circle-user-round"
              class="size-5"
              aria-hidden="true"
            />
          </span>
          <div>
            <h2
              id="settings-account"
              class="font-display text-[18px] font-semibold leading-tight text-highlighted"
            >
              Account
            </h2>
            <p class="mt-0.5 text-sm text-muted">
              How your name and email appear in Athenaeum.
            </p>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              for="settings-name"
              class="mb-1 block text-xs font-semibold text-default"
            >
              Display name
            </label>
            <input
              id="settings-name"
              v-model="displayName"
              type="text"
              autocomplete="name"
              placeholder="Your display name"
              class="w-full rounded-xl border border-(--ui-border) bg-(--ui-bg-card) px-3 py-2 text-sm text-default outline-none transition-all duration-150 motion-reduce:transition-none placeholder:text-muted hover:border-(--ui-border-accented) focus:border-[#8ca9ce] focus:ring-4 focus:ring-[#edf4ff]"
            >
          </div>
          <div>
            <label
              for="settings-email"
              class="mb-1 block text-xs font-semibold text-default"
            >
              Email address
            </label>
            <input
              id="settings-email"
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="you@library.org"
              class="w-full rounded-xl border border-(--ui-border) bg-(--ui-bg-card) px-3 py-2 text-sm text-default outline-none transition-all duration-150 motion-reduce:transition-none placeholder:text-muted hover:border-(--ui-border-accented) focus:border-[#8ca9ce] focus:ring-4 focus:ring-[#edf4ff]"
            >
          </div>
        </div>
      </section>

      <section
        aria-labelledby="settings-library"
        class="rounded-2xl bg-(--ui-bg-card) p-5 shadow-[0_8px_24px_rgba(27,59,102,0.04)] ring-1 ring-(--ui-border)"
      >
        <div class="flex items-center gap-3">
          <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf7f2] text-[#20876e]">
            <UIcon
              name="i-lucide-settings-2"
              class="size-5"
              aria-hidden="true"
            />
          </span>
          <div>
            <h2
              id="settings-library"
              class="font-display text-[18px] font-semibold leading-tight text-highlighted"
            >
              Library preferences
            </h2>
            <p class="mt-0.5 text-sm text-muted">
              Defaults applied to new loans and reminders.
            </p>
          </div>
        </div>

        <div class="mt-4">
          <label
            for="settings-loan-days"
            class="mb-1 block text-xs font-semibold text-default"
          >
            Default loan period (days)
          </label>
          <input
            id="settings-loan-days"
            v-model.number="loanDays"
            type="number"
            min="1"
            max="90"
            aria-describedby="settings-loan-days-hint"
            class="w-full rounded-xl border border-(--ui-border) bg-(--ui-bg-card) px-3 py-2 text-sm text-default outline-none transition-all duration-150 motion-reduce:transition-none placeholder:text-muted hover:border-(--ui-border-accented) focus:border-[#8ca9ce] focus:ring-4 focus:ring-[#edf4ff] sm:max-w-52"
          >
          <p
            id="settings-loan-days-hint"
            class="mt-1 text-xs text-dimmed"
          >
            Used when checking out a book without a custom due date.
          </p>
        </div>

        <div class="mt-4 flex flex-col gap-3">
          <div class="flex items-start gap-2.5 rounded-xl border border-(--ui-border-muted) bg-(--ui-bg-elevated)/40 px-3 py-2.5">
            <input
              id="settings-email-reminders"
              v-model="emailReminders"
              type="checkbox"
              class="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-(--ui-border-accented) accent-primary"
            >
            <span>
              <label
                for="settings-email-reminders"
                class="block cursor-pointer text-sm font-medium text-default"
              >
                Due-date reminders
              </label>
              <span class="mt-0.5 block text-xs text-muted">
                Email members before their loans are due.
              </span>
            </span>
          </div>
          <div class="flex items-start gap-2.5 rounded-xl border border-(--ui-border-muted) bg-(--ui-bg-elevated)/40 px-3 py-2.5">
            <input
              id="settings-overdue-digest"
              v-model="overdueDigest"
              type="checkbox"
              class="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-(--ui-border-accented) accent-primary"
            >
            <span>
              <label
                for="settings-overdue-digest"
                class="block cursor-pointer text-sm font-medium text-default"
              >
                Daily overdue digest
              </label>
              <span class="mt-0.5 block text-xs text-muted">
                One morning summary of loans that need attention.
              </span>
            </span>
          </div>
        </div>
      </section>

      <div class="flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center">
        <button
          type="submit"
          :disabled="isSaving"
          class="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 motion-reduce:transition-none hover:bg-primary-600 active:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <UIcon
            v-if="isSaving"
            name="i-lucide-loader-2"
            class="size-4 animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
          <span>{{ isSaving ? 'Saving…' : 'Save settings' }}</span>
        </button>
        <button
          type="button"
          :disabled="isSaving"
          class="cursor-pointer rounded-xl border border-(--ui-border) bg-(--ui-bg-card) px-4 py-2.5 text-sm font-medium text-default transition-colors duration-150 motion-reduce:transition-none hover:border-(--ui-border-accented) hover:bg-(--ui-bg-accented) disabled:cursor-not-allowed disabled:opacity-70"
          @click="handleReset"
        >
          Reset to defaults
        </button>
        <p
          aria-live="polite"
          class="text-xs text-muted sm:ml-1"
        >
          <span
            v-if="saveError"
            class="font-medium text-[#d84332]"
          >{{ saveError }}</span>
          <span v-else-if="savedAt">Saved · {{ savedAt }}</span>
        </p>
      </div>
    </form>
  </div>
</template>

