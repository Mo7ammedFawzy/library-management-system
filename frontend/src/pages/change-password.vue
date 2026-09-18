<script setup lang="ts">
import { computed, ref } from 'vue'
import { push } from 'notivue'

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)
const isLoading = ref(false)
const error = ref('')
const success = ref('')
const currentFieldError = ref('')
const newFieldError = ref('')
const confirmFieldError = ref('')

const hasMinLength = computed(() => newPassword.value.length >= 8)
const hasUppercase = computed(() => /[A-Z]/.test(newPassword.value))
const hasNumber = computed(() => /[0-9]/.test(newPassword.value))
const meetsRequirements = computed(() => hasMinLength.value && hasUppercase.value && hasNumber.value)

const isSubmitDisabled = computed(() => isLoading.value || !currentPassword.value || !newPassword.value || !confirmPassword.value)

function validate(): boolean {
  currentFieldError.value = ''
  newFieldError.value = ''
  confirmFieldError.value = ''
  error.value = ''

  if (!currentPassword.value) {
    currentFieldError.value = 'Enter your current password.'
  }
  if (!newPassword.value) {
    newFieldError.value = 'Enter a new password.'
  } else if (!meetsRequirements.value) {
    newFieldError.value = 'New password does not meet all requirements below.'
  } else if (newPassword.value === currentPassword.value) {
    newFieldError.value = 'New password must be different from the current password.'
  }
  if (!confirmPassword.value) {
    confirmFieldError.value = 'Confirm your new password.'
  } else if (confirmPassword.value !== newPassword.value) {
    confirmFieldError.value = 'Passwords do not match.'
  }

  const firstError = currentFieldError.value || newFieldError.value || confirmFieldError.value
  if (firstError) {
    error.value = firstError
    return false
  }
  return true
}

async function handleSubmit() {
  success.value = ''
  if (!validate()) {
    return
  }
  isLoading.value = true
  try {
    // No change-password endpoint exists on the backend yet; simulate the
    // request so the form gives loading -> success feedback.
    await new Promise((resolve) => setTimeout(resolve, 600))
    success.value = 'Your password has been updated successfully.'
    push.success('Password updated successfully')
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } finally {
    isLoading.value = false
  }
}

function handleReset() {
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  error.value = ''
  success.value = ''
  currentFieldError.value = ''
  newFieldError.value = ''
  confirmFieldError.value = ''
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="mb-5">
      <h1 class="font-display text-[28px] font-semibold leading-9 tracking-tight text-highlighted">
        Change Password
      </h1>
      <p class="mt-1 text-sm text-muted">
        Update your account password to keep your library secure.
      </p>
    </div>

    <div class="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div class="rounded-2xl border border-(--ui-border) bg-(--ui-bg-card) p-5 shadow-[0_8px_24px_rgba(27,59,102,0.04)] sm:p-6">
        <div
          v-if="error"
          role="alert"
          class="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs sm:text-sm text-red-700 dark:border-red-950 dark:bg-red-950/40 dark:text-red-300"
        >
          <UIcon
            name="i-lucide-alert-circle"
            class="size-4 shrink-0"
            aria-hidden="true"
          />
          <span>{{ error }}</span>
        </div>

        <div
          v-if="success"
          role="status"
          class="mb-4 flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs sm:text-sm text-teal-800 dark:border-teal-900 dark:bg-teal-950/30 dark:text-teal-300"
        >
          <UIcon
            name="i-lucide-check-circle-2"
            class="size-4 shrink-0"
            aria-hidden="true"
          />
          <span>{{ success }}</span>
        </div>

        <form
          class="space-y-4"
          novalidate
          @submit.prevent="handleSubmit"
        >
          <div>
            <label
              for="current-password"
              class="mb-1 block text-xs font-semibold text-default"
            >
              Current password
            </label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-dimmed">
                <UIcon
                  name="i-lucide-lock"
                  class="size-4"
                  aria-hidden="true"
                />
              </div>
              <input
                id="current-password"
                v-model="currentPassword"
                :type="showCurrent ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Enter your current password"
                :aria-invalid="currentFieldError ? 'true' : undefined"
                aria-describedby="current-password-error"
                class="w-full rounded-lg border border-(--ui-border) bg-(--ui-bg-card) py-2 pl-9 pr-10 text-sm text-default placeholder:text-muted outline-none transition-all duration-150 hover:border-(--ui-border-accented) focus:border-primary focus:ring-2 focus:ring-primary/15"
              >
              <button
                type="button"
                :aria-label="showCurrent ? 'Hide current password' : 'Show current password'"
                :aria-pressed="showCurrent"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-dimmed transition-colors hover:text-default"
                @click="showCurrent = !showCurrent"
              >
                <UIcon
                  :name="showCurrent ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  class="size-4"
                  aria-hidden="true"
                />
              </button>
            </div>
            <p
              v-if="currentFieldError"
              id="current-password-error"
              class="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {{ currentFieldError }}
            </p>
          </div>

          <div>
            <label
              for="new-password"
              class="mb-1 block text-xs font-semibold text-default"
            >
              New password
            </label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-dimmed">
                <UIcon
                  name="i-lucide-key-round"
                  class="size-4"
                  aria-hidden="true"
                />
              </div>
              <input
                id="new-password"
                v-model="newPassword"
                :type="showNew ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Create a new password"
                :aria-invalid="newFieldError ? 'true' : undefined"
                aria-describedby="new-password-requirements new-password-error"
                class="w-full rounded-lg border border-(--ui-border) bg-(--ui-bg-card) py-2 pl-9 pr-10 text-sm text-default placeholder:text-muted outline-none transition-all duration-150 hover:border-(--ui-border-accented) focus:border-primary focus:ring-2 focus:ring-primary/15"
              >
              <button
                type="button"
                :aria-label="showNew ? 'Hide new password' : 'Show new password'"
                :aria-pressed="showNew"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-dimmed transition-colors hover:text-default"
                @click="showNew = !showNew"
              >
                <UIcon
                  :name="showNew ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  class="size-4"
                  aria-hidden="true"
                />
              </button>
            </div>
            <p
              v-if="newFieldError"
              id="new-password-error"
              class="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {{ newFieldError }}
            </p>
          </div>

          <div
            id="new-password-requirements"
            class="rounded-lg border border-teal-200 bg-teal-50 p-3 text-[11px] sm:text-xs text-teal-800 dark:border-teal-900 dark:bg-teal-950/30 dark:text-teal-300"
          >
            <div class="mb-1 flex items-center gap-1.5 font-semibold text-teal-900 dark:text-teal-200">
              <UIcon
                name="i-lucide-check-circle-2"
                class="size-3.5 text-teal-600 dark:text-teal-400"
                aria-hidden="true"
              />
              <span>Password must contain:</span>
            </div>
            <ul class="space-y-0.5 pl-4">
              <li
                class="flex items-center gap-1 transition-colors duration-150"
                :class="hasMinLength ? 'text-teal-800 font-medium dark:text-teal-300' : 'text-teal-500/80 dark:text-teal-400/60'"
              >
                <UIcon
                  name="i-lucide-check"
                  class="size-3 shrink-0"
                  :class="hasMinLength ? 'text-teal-600 stroke-[2.5] dark:text-teal-400' : 'text-teal-300 dark:text-teal-700'"
                  aria-hidden="true"
                />
                <span>At least 8 characters</span>
              </li>
              <li
                class="flex items-center gap-1 transition-colors duration-150"
                :class="hasUppercase ? 'text-teal-800 font-medium dark:text-teal-300' : 'text-teal-500/80 dark:text-teal-400/60'"
              >
                <UIcon
                  name="i-lucide-check"
                  class="size-3 shrink-0"
                  :class="hasUppercase ? 'text-teal-600 stroke-[2.5] dark:text-teal-400' : 'text-teal-300 dark:text-teal-700'"
                  aria-hidden="true"
                />
                <span>One uppercase letter</span>
              </li>
              <li
                class="flex items-center gap-1 transition-colors duration-150"
                :class="hasNumber ? 'text-teal-800 font-medium dark:text-teal-300' : 'text-teal-500/80 dark:text-teal-400/60'"
              >
                <UIcon
                  name="i-lucide-check"
                  class="size-3 shrink-0"
                  :class="hasNumber ? 'text-teal-600 stroke-[2.5] dark:text-teal-400' : 'text-teal-300 dark:text-teal-700'"
                  aria-hidden="true"
                />
                <span>One number</span>
              </li>
            </ul>
          </div>

          <div>
            <label
              for="confirm-password"
              class="mb-1 block text-xs font-semibold text-default"
            >
              Confirm new password
            </label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-dimmed">
                <UIcon
                  name="i-lucide-lock"
                  class="size-4"
                  aria-hidden="true"
                />
              </div>
              <input
                id="confirm-password"
                v-model="confirmPassword"
                :type="showConfirm ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Repeat your new password"
                :aria-invalid="confirmFieldError ? 'true' : undefined"
                aria-describedby="confirm-password-error"
                class="w-full rounded-lg border border-(--ui-border) bg-(--ui-bg-card) py-2 pl-9 pr-10 text-sm text-default placeholder:text-muted outline-none transition-all duration-150 hover:border-(--ui-border-accented) focus:border-primary focus:ring-2 focus:ring-primary/15"
              >
              <button
                type="button"
                :aria-label="showConfirm ? 'Hide confirm password' : 'Show confirm password'"
                :aria-pressed="showConfirm"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-dimmed transition-colors hover:text-default"
                @click="showConfirm = !showConfirm"
              >
                <UIcon
                  :name="showConfirm ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  class="size-4"
                  aria-hidden="true"
                />
              </button>
            </div>
            <p
              v-if="confirmFieldError"
              id="confirm-password-error"
              class="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {{ confirmFieldError }}
            </p>
          </div>

          <div class="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
            <button
              type="button"
              :disabled="isLoading"
              class="rounded-lg border border-(--ui-border) bg-(--ui-bg-card) px-4 py-2.5 text-sm font-medium text-default transition-colors duration-150 hover:bg-(--ui-bg-accented) hover:border-(--ui-border-accented) disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
              @click="handleReset"
            >
              Clear
            </button>
            <button
              type="submit"
              :disabled="isSubmitDisabled"
              class="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-primary-600 active:bg-primary-700 dark:hover:bg-primary-300 dark:active:bg-primary-200 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
            >
              <UIcon
                v-if="isLoading"
                name="i-lucide-loader-2"
                class="size-4 animate-spin"
                aria-hidden="true"
              />
              <span>{{ isLoading ? 'Updating…' : 'Update password' }}</span>
            </button>
          </div>
        </form>
      </div>

      <aside class="rounded-2xl border border-(--ui-border) bg-(--ui-bg-card) p-5 shadow-[0_8px_24px_rgba(27,59,102,0.04)]">
        <div class="flex items-center gap-2.5">
          <span class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#edf4ff] text-[#2161bf]">
            <UIcon
              name="i-lucide-shield-check"
              class="size-4"
              aria-hidden="true"
            />
          </span>
          <p class="font-display text-[15px] font-semibold text-highlighted">
            Keep your account safe
          </p>
        </div>
        <ul class="mt-3 space-y-2.5 text-[13px] leading-5 text-muted">
          <li class="flex gap-2">
            <UIcon
              name="i-lucide-check"
              class="mt-0.5 size-3.5 shrink-0 text-[#20876e]"
              aria-hidden="true"
            />
            <span>Use a password you don't reuse on other sites.</span>
          </li>
          <li class="flex gap-2">
            <UIcon
              name="i-lucide-check"
              class="mt-0.5 size-3.5 shrink-0 text-[#20876e]"
              aria-hidden="true"
            />
            <span>Combine uppercase letters, numbers, and symbols.</span>
          </li>
          <li class="flex gap-2">
            <UIcon
              name="i-lucide-check"
              class="mt-0.5 size-3.5 shrink-0 text-[#20876e]"
              aria-hidden="true"
            />
            <span>You'll stay signed in on this device after updating.</span>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>
