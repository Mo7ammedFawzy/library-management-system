<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import type { FormError } from '@nuxt/ui'
import ErrorAlert from './ErrorAlert.vue'
import ModalShell from './ModalShell.vue'

const open = defineModel<boolean>('open', { required: true })
const name = defineModel<string>('name', { required: true })

const props = defineProps<{
  entityName: string
  editing: boolean
  fieldId: string
  placeholder: string
  icon: string
  submitIcon: string
  error: string
  saving: boolean
  validate: (state: { name: string }) => FormError[]
}>()

const emit = defineEmits<{
  submit: []
}>()

const form = useTemplateRef<{ submit: () => Promise<void> }>('form')

const fieldUi = {
  base: '!rounded-lg !bg-(--ui-bg-card) !py-3 !text-sm !ring-(--ui-border) !placeholder:text-muted focus-visible:!ring-2 focus-visible:!ring-primary focus-visible:!outline-none'
}

const title = computed(() => (props.editing ? `Edit ${props.entityName}` : `Add ${props.entityName}`))
const subtitle = computed(() =>
  props.editing
    ? `Update ${props.entityName.toLowerCase()} details`
    : `Add a new ${props.entityName.toLowerCase()} to your library`
)
const submitLabel = computed(() => (props.editing ? 'Save Changes' : `Add ${props.entityName}`))
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      overlay: '!bg-black/20 backdrop-blur-sm',
      content: '!max-w-md !rounded-xl !bg-(--ui-bg-card) !shadow-[0_8px_32px_rgba(0,0,0,0.04)] !ring-0 border border-(--ui-border)'
    }"
  >
    <template #content="{ close }">
      <ModalShell
        :title="title"
        :subtitle="subtitle"
        :icon="icon"
        @close="close()"
      >
        <ErrorAlert
          v-if="error"
          :message="error"
        />

        <UForm
          ref="form"
          :state="{ name }"
          :validate="validate"
          class="flex flex-col gap-2"
          @submit="emit('submit')"
        >
          <label
            :for="fieldId"
            class="text-sm font-medium text-highlighted"
          >
            Name <span class="text-error">*</span>
          </label>
          <UInput
            :id="fieldId"
            v-model="name"
            :placeholder="placeholder"
            :ui="fieldUi"
          />
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
            :icon="editing ? 'i-lucide-save' : submitIcon"
            size="lg"
            class="!rounded-lg !px-8 !py-2.5 !bg-brand-700 dark:!bg-primary-400 hover:!bg-brand-600 dark:hover:!bg-primary-300"
            :loading="saving"
            @click="form?.submit()"
          >
            {{ submitLabel }}
          </UButton>
        </template>
      </ModalShell>
    </template>
  </UModal>
</template>