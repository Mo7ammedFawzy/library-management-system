<script setup lang="ts">
import ErrorAlert from './ErrorAlert.vue'
import ModalShell from './ModalShell.vue'

const open = defineModel<boolean>('open', { required: true })

defineProps<{
  entityName: string
  targetLabel: string
  error: string
  deleting: boolean
}>()

const emit = defineEmits<{
  confirm: []
}>()
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      overlay: '!bg-black/20 backdrop-blur-sm',
      content: '!max-w-md !rounded-xl !bg-(--ui-bg-card) !shadow-[0_8px_32px_rgba(0,0,0,0.04)] !ring-0 border border-(--ui-border)'
    }"
  >
    <template #content>
      <ModalShell
        :title="`Delete ${entityName}?`"
        subtitle="This action cannot be undone"
        icon="i-lucide-trash-2"
        tone="danger"
        @close="open = false"
      >
        <p class="text-sm leading-relaxed text-highlighted">
          Are you sure you want to delete
          <span class="font-semibold">"{{ targetLabel }}"</span>?
        </p>

        <ErrorAlert
          v-if="error"
          class="mt-3"
          :message="error"
        />

        <template #footer>
          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            class="!rounded-lg !px-8 !py-2.5 !bg-transparent ring-(--ui-border-accented) hover:!bg-(--ui-bg-accented)"
            @click="open = false"
          >
            Cancel
          </UButton>
          <UButton
            color="error"
            variant="solid"
            icon="i-lucide-trash-2"
            size="lg"
            class="!rounded-lg !px-8 !py-2.5"
            :loading="deleting"
            @click="emit('confirm')"
          >
            Delete
          </UButton>
        </template>
      </ModalShell>
    </template>
  </UModal>
</template>