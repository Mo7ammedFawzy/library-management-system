<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import type { FormError, SelectMenuItem } from '@nuxt/ui'
import type { BookFormState } from '../../composables/useBooksPage'
import ErrorAlert from '../ErrorAlert.vue'
import ModalShell from '../ModalShell.vue'

const open = defineModel<boolean>('open', { required: true })
const form = defineModel<BookFormState>('form', { required: true })

const props = defineProps<{
  editing: boolean
  categoryOptions: SelectMenuItem[]
  authorOptions: SelectMenuItem[]
  error: string
  saving: boolean
  validate: (state: BookFormState) => FormError[]
}>()

const emit = defineEmits<{
  submit: []
  incrementCopies: []
  decrementCopies: []
}>()

const formRef = useTemplateRef<{ submit: () => Promise<void> }>('form')

const fieldUi = {
  base: '!rounded-[10px] !bg-white !py-3 !text-sm !ring-[#d6e0ea] !placeholder:text-[#65798e] focus-visible:!ring-2 focus-visible:ring-[#7398bd] focus-visible:!outline-none'
}

const copiesUi = {
  ...fieldUi,
  trailing: '!pe-0',
  base: `${fieldUi.base} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`
}

const title = computed(() => (props.editing ? 'Edit Book' : 'Add Book'))
const subtitle = computed(() =>
  props.editing ? 'Update book details' : 'Add a new book to your library'
)
const submitLabel = computed(() => (props.editing ? 'Save Changes' : 'Add Book'))
const submitIcon = computed(() => (props.editing ? 'i-lucide-save' : 'i-lucide-book-open'))
</script>

<template>
  <UModal
    v-model:open="open"
    :title="title"
    :description="subtitle"
    :ui="{
      overlay: '!bg-black/20 backdrop-blur-sm',
      content: 'books-modal !max-w-2xl !rounded-2xl !bg-white !shadow-[0_24px_70px_rgba(15,39,66,0.18)] !ring-1 !ring-[#cbd7e4]'
    }"
  >
    <template #content="{ close }">
      <ModalShell
        :title="title"
        :subtitle="subtitle"
        icon="i-lucide-book-open"
        @close="close()"
      >
        <ErrorAlert
          v-if="error"
          :message="error"
        />

        <UForm
          ref="formRef"
          :state="form"
          :validate="validate"
          class="flex flex-col gap-6"
          @submit="emit('submit')"
        >
          <div class="flex flex-col gap-2">
            <label
              for="book-title"
              class="text-sm font-medium text-highlighted"
            >
              Title <span class="text-error">*</span>
            </label>
            <UInput
              id="book-title"
              v-model="form.title"
              placeholder="e.g. Clean Code"
              :ui="fieldUi"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label
              for="book-description"
              class="text-sm font-medium text-highlighted"
            >
              Description <span class="text-error">*</span>
            </label>
            <UTextarea
              id="book-description"
              v-model="form.description"
              placeholder="Brief summary of the book (at least 10 characters)"
              :rows="3"
              :ui="fieldUi"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label
                for="book-category"
                class="text-sm font-medium text-highlighted"
              >
                Category <span class="text-error">*</span>
              </label>
              <USelectMenu
                id="book-category"
                v-model="form.categoryId"
                :items="categoryOptions"
                value-key="value"
                :search-input="false"
                :ui="fieldUi"
                icon="i-lucide-tag"
                placeholder="Select category"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label
                for="book-copies"
                class="text-sm font-medium text-highlighted"
              >
                Copies <span class="text-error">*</span>
              </label>
              <UInput
                id="book-copies"
                v-model="form.availableCopies"
                type="number"
                min="1"
                :ui="copiesUi"
              >
                <template #trailing>
                  <div class="flex h-full flex-col border-l border-(--ui-border)">
                    <button
                      type="button"
                      class="flex flex-1 items-center justify-center px-2 text-muted transition-colors motion-reduce:transition-none hover:bg-(--ui-bg-accented) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8ca9ce]"
                      aria-label="Increase copies"
                      @click="emit('incrementCopies')"
                    >
                      <UIcon
                        name="i-lucide-chevron-up"
                        class="size-3.5"
                      />
                    </button>
                    <button
                      type="button"
                      class="flex flex-1 items-center justify-center border-t border-(--ui-border) px-2 text-muted transition-colors motion-reduce:transition-none hover:bg-(--ui-bg-accented) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8ca9ce]"
                      aria-label="Decrease copies"
                      @click="emit('decrementCopies')"
                    >
                      <UIcon
                        name="i-lucide-chevron-down"
                        class="size-3.5"
                      />
                    </button>
                  </div>
                </template>
              </UInput>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label
              for="book-authors"
              class="text-sm font-medium text-highlighted"
            >
              Authors <span class="text-error">*</span>
            </label>
            <USelectMenu
              id="book-authors"
              v-model="form.authorIds"
              :items="authorOptions"
              value-key="value"
              multiple
              search-input
              :ui="fieldUi"
              icon="i-lucide-users"
              placeholder="Select one or more authors"
            />
          </div>
        </UForm>

        <template #footer>
          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            class="!rounded-xl !px-8 !py-2.5 !bg-transparent ring-black/10 hover:!bg-black/10"
            @click="close()"
          >
            Cancel
          </UButton>
          <UButton
            color="primary"
            variant="solid"
            :icon="submitIcon"
            size="lg"
            class="!rounded-xl !px-8 !py-2.5 !bg-brand-700 hover:!bg-brand-600"
            :loading="saving"
            @click="formRef?.submit()"
          >
            {{ submitLabel }}
          </UButton>
        </template>
      </ModalShell>
    </template>
  </UModal>
</template>

<style scoped>
:deep(input),
:deep(textarea) {
  transition: border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease;
}
</style>