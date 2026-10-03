<script setup lang="ts">
import { useTemplateRef } from 'vue'
import type { FormError, SelectMenuItem } from '@nuxt/ui'
import type { BorrowingFormState } from '../../composables/useBorrowingsPage'
import ErrorAlert from '../ErrorAlert.vue'
import ModalShell from '../ModalShell.vue'

const open = defineModel<boolean>('open', { required: true })

const selectedBookId = defineModel<number | null>('bookId', { required: true })
const selectedUserId = defineModel<number | null>('userId', { required: true })

defineProps<{
  bookOptions: SelectMenuItem[]
  memberOptions: SelectMenuItem[]
  state: BorrowingFormState
  error: string
  saving: boolean
  validate: (state: BorrowingFormState) => FormError[]
}>()

const emit = defineEmits<{
  submit: []
}>()

const formRef = useTemplateRef<{ submit: () => Promise<void> }>('form')

const fieldUi = {
  base: '!rounded-lg !bg-(--ui-bg-card) !py-3 !text-sm !ring-(--ui-border) !placeholder:text-muted focus-visible:!ring-2 focus-visible:!ring-primary focus-visible:!outline-none'
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="New Borrowing"
    description="Borrow a book for a member"
    :ui="{
      overlay: '!bg-black/20 backdrop-blur-sm',
      content: '!max-w-lg !rounded-xl !bg-(--ui-bg-card) !shadow-[0_8px_32px_rgba(0,0,0,0.04)] !ring-0 border border-(--ui-border)'
    }"
  >
    <template #content="{ close }">
      <ModalShell
        title="New Borrowing"
        subtitle="Borrow a book for a member"
        icon="i-lucide-book-open"
        @close="close()"
      >
        <ErrorAlert
          v-if="error"
          :message="error"
        />

        <UForm
          ref="formRef"
          :state="state"
          :validate="validate"
          class="flex flex-col gap-6"
          @submit="emit('submit')"
        >
          <div class="flex flex-col gap-2">
            <label
              for="borrow-member"
              class="text-sm font-medium text-highlighted"
            >
              Member <span class="text-error">*</span>
            </label>
            <USelectMenu
              id="borrow-member"
              v-model="selectedUserId"
              :items="memberOptions"
              value-key="value"
              :search-input="true"
              :ui="fieldUi"
              icon="i-lucide-user"
              placeholder="Select member"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label
              for="borrow-book"
              class="text-sm font-medium text-highlighted"
            >
              Book <span class="text-error">*</span>
            </label>
            <USelectMenu
              id="borrow-book"
              v-model="selectedBookId"
              :items="bookOptions"
              value-key="value"
              :search-input="true"
              :ui="fieldUi"
              icon="i-lucide-book-open"
              placeholder="Select book to borrow"
            />
          </div>
        </UForm>

        <template #footer>
          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            class="!rounded-lg !px-8 !py-2.5 !bg-transparent ring-(--ui-border-accented) hover:!bg-(--ui-bg-accented)"
            @click="close()"
          >
            Cancel
          </UButton>
          <UButton
            color="primary"
            variant="solid"
            icon="i-lucide-book-open"
            size="lg"
            class="!rounded-lg !px-8 !py-2.5 !bg-brand-700 dark:!bg-primary-400 hover:!bg-brand-600 dark:hover:!bg-primary-300"
            :loading="saving"
            @click="formRef?.submit()"
          >
            Borrow Book
          </UButton>
        </template>
      </ModalShell>
    </template>
  </UModal>
</template>