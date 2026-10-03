<script setup lang="ts">
import { shallowRef, watch } from 'vue'

const props = withDefaults(defineProps<{
  label: string
  placeholder?: string
  initial?: string
}>(), {
  placeholder: '',
  initial: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const search = shallowRef(props.initial)

watch(() => props.initial, (value) => {
  search.value = value
})

function update(value: string) {
  search.value = value
  emit('update:modelValue', value)
}

function clear() {
  update('')
}
</script>

<template>
  <div class="search-field">
    <label :for="label" class="sr-only">
      {{ label }}
    </label>
    <UIcon
      name="i-lucide-search"
      class="search-field__icon"
      aria-hidden="true"
    />
    <input
      :id="label"
      :value="search"
      type="search"
      :placeholder="placeholder"
      :aria-label="label"
      class="search-field__input"
      @input="update(($event.target as HTMLInputElement).value)"
    >
    <button
      v-if="search"
      type="button"
      class="search-field__clear"
      :aria-label="`Clear ${label.toLowerCase()}`"
      @click="clear"
    >
      <UIcon
        name="i-lucide-x"
        class="size-4"
        aria-hidden="true"
      />
    </button>
  </div>
</template>

<style scoped>
.search-field {
  position: relative;
  width: 100%;
}

.search-field__icon {
  position: absolute;
  top: 50%;
  left: 0.75rem;
  width: 1.125rem;
  height: 1.125rem;
  color: var(--ui-text-muted);
  pointer-events: none;
  transform: translateY(-50%);
}

.search-field__input {
  width: 100%;
  height: 2.5rem;
  border: 1px solid var(--ui-border);
  border-radius: 0.75rem;
  background: var(--ui-bg);
  padding: 0 2.5rem;
  color: var(--ui-text-highlighted);
  font-size: 0.875rem;
  outline: none;
  transition: border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease;
}

.search-field__input::placeholder {
  color: var(--ui-text-dimmed);
}

.search-field__input:hover {
  border-color: var(--ui-border-accented);
}

.search-field__input:focus-visible {
  border-color: #8ca9ce;
  background: #fff;
  box-shadow: 0 0 0 4px #edf4ff;
}

.search-field__clear {
  position: absolute;
  top: 50%;
  right: 0.5rem;
  display: flex;
  width: 1.75rem;
  height: 1.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  color: var(--ui-text-muted);
  transform: translateY(-50%);
  transition: background-color 150ms ease, color 150ms ease;
}

.search-field__clear:hover {
  background: #edf3f8;
  color: #173b70;
}

@media (prefers-reduced-motion: reduce) {
  .search-field__input,
  .search-field__clear {
    transition: none;
  }
}
</style>