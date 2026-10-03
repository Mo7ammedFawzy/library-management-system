<script setup lang="ts">
import StatusBadge from '../grid/StatusBadge.vue'
import type { Borrowing, BorrowingStatus } from '../../services/borrowings'
import { formatDate } from '../../services/borrowings'
import ModalShell from '../ModalShell.vue'

const open = defineModel<boolean>('open', { required: true })

defineProps<{
  borrowing: Borrowing | null
  status: BorrowingStatus
  returning: boolean
  returnError: string
}>()

const emit = defineEmits<{
  return: [borrowing: Borrowing]
}>()
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      overlay: '!bg-black/20 backdrop-blur-sm',
      content: '!max-w-lg !rounded-xl !bg-(--ui-bg-card) !shadow-[0_8px_32px_rgba(0,0,0,0.04)] !ring-0 border border-(--ui-border)'
    }"
  >
    <template #content>
      <ModalShell
        title="Borrowing Details"
        :subtitle="borrowing ? `#${borrowing.id}` : ''"
        icon="i-lucide-book-open"
        @close="open = false"
      >
        <div
          v-if="borrowing"
          class="flex flex-col gap-4"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-(--ui-bg-accented)">
                <UIcon
                  name="i-lucide-book-marked"
                  class="size-4 text-highlighted"
                />
              </div>
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-highlighted">
                  {{ borrowing.bookResponse.title }}
                </p>
                <p class="truncate text-xs text-muted">
                  {{ borrowing.bookResponse.authors.map((author) => author.name).join(', ') }}
                </p>
              </div>
            </div>
            <StatusBadge :status="status" />
          </div>

          <div class="h-px bg-(--ui-border)" />

          <div class="flex items-start justify-between gap-4">
            <p class="text-xs font-medium uppercase tracking-wide text-muted">
              Member
            </p>
            <div class="text-right">
              <p class="text-sm font-medium text-highlighted">
                {{ borrowing.userResponse.name }}
              </p>
              <p class="text-xs text-muted">
                {{ borrowing.userResponse.email }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div class="flex flex-col gap-1 rounded-lg border border-(--ui-border) bg-(--ui-bg-accented) p-3">
              <p class="text-[10px] font-semibold uppercase tracking-wide text-muted">
                Borrow Date
              </p>
              <p class="text-sm font-medium text-highlighted">
                {{ formatDate(borrowing.borrowDate) }}
              </p>
            </div>
            <div class="flex flex-col gap-1 rounded-lg border border-(--ui-border) bg-(--ui-bg-accented) p-3">
              <p class="text-[10px] font-semibold uppercase tracking-wide text-muted">
                Due Date
              </p>
              <p class="text-sm font-medium text-highlighted">
                {{ formatDate(borrowing.dueDate) }}
              </p>
            </div>
            <div class="flex flex-col gap-1 rounded-lg border border-(--ui-border) bg-(--ui-bg-accented) p-3">
              <p class="text-[10px] font-semibold uppercase tracking-wide text-muted">
                Return Date
              </p>
              <p
                class="text-sm font-medium"
                :class="borrowing.returnDate ? 'text-highlighted' : 'text-muted'"
              >
                {{ formatDate(borrowing.returnDate) }}
              </p>
            </div>
          </div>

          <div
            v-if="!borrowing.returnDate"
            class="flex flex-col gap-2"
          >
            <UButton
              color="primary"
              variant="solid"
              icon="i-lucide-book-check"
              class="!rounded-lg"
              :loading="returning"
              @click="emit('return', borrowing)"
            >
              Return Book
            </UButton>
            <p
              v-if="returnError"
              class="text-xs text-red-500"
            >
              {{ returnError }}
            </p>
          </div>
        </div>
      </ModalShell>
    </template>
  </UModal>
</template>