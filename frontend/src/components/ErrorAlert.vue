<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <div
    v-if="message"
    role="alert"
    class="error-alert"
  >
    <UIcon
      name="i-lucide-alert-circle"
      class="size-4 shrink-0"
      aria-hidden="true"
    />
    <span>{{ message }}</span>
  </div>
</template>

<style scoped>
.error-alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #f1c4bd;
  border-radius: 0.75rem;
  background: #fff0ee;
  padding: 0.625rem 1rem;
  color: #b3261e;
  font-size: 0.875rem;
}
</style>