<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  subtitle?: string
  icon?: string
  tone?: 'default' | 'danger'
}>(), {
  subtitle: '',
  icon: '',
  tone: 'default'
})

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="modal-shell">
    <div class="modal-shell__header">
      <div class="flex items-center gap-4">
        <div
          class="flex size-12 shrink-0 items-center justify-center rounded-full"
          :class="tone === 'danger' ? 'bg-red-50' : 'bg-(--ui-bg-accented)'"
        >
          <UIcon
            :name="icon"
            class="text-lg"
            :class="tone === 'danger' ? 'text-red-600' : 'text-highlighted'"
            aria-hidden="true"
          />
        </div>
        <div>
          <h2 class="modal-shell__title">
            {{ title }}
          </h2>
          <p
            v-if="subtitle"
            class="modal-shell__subtitle"
          >
            {{ subtitle }}
          </p>
        </div>
      </div>

      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-x"
        aria-label="Close modal"
        @click="emit('close')"
      />
    </div>

    <div class="modal-shell__body">
      <slot />
    </div>

    <div class="modal-shell__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.modal-shell {
  display: flex;
  flex-direction: column;
}

.modal-shell__header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid var(--ui-border);
  padding: 0.75rem 1rem;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcfd 100%);
}

.modal-shell__title {
  color: var(--ui-text-highlighted);
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.25;
}

.modal-shell__subtitle {
  margin-top: 0.125rem;
  color: var(--ui-text-muted);
  font-size: 0.75rem;
  font-weight: 500;
}

.modal-shell__body {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
}

.modal-shell__footer {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  border-top: 1px solid var(--ui-border);
  background: var(--ui-bg-accented);
  padding: 0.75rem 1rem;
  box-shadow: 0 -1px 0 rgba(220, 229, 239, 0.7);
}

.modal-shell__footer :deep(button) {
  min-height: 2.75rem;
}
</style>