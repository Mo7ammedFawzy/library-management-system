<script setup lang="ts">
import { computed } from 'vue'
import type { ICellRendererParams } from 'ag-grid-community'
import type { Book } from '../../services/books'

const props = defineProps<{ params: ICellRendererParams }>()
const name = computed(() => (props.params.data as Book).category.name)
</script>

<template>
  <div class="flex h-full min-w-0 items-center">
    <span
      class="category-label"
      :data-category="name"
    >
      <span
        class="category-label__marker"
        aria-hidden="true"
      />
      <span class="truncate">{{ name }}</span>
    </span>
  </div>
</template>

<style scoped>
.category-label {
  display: inline-flex;
  max-width: 100%;
  min-height: 1.75rem;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid #dce4eb;
  border-radius: 0.5rem;
  background: #f8fafc;
  padding: 0.25rem 0.55rem;
  color: #4e667e;
  font-size: 0.6875rem;
  font-weight: 650;
  line-height: 1;
}

.category-label__marker {
  width: 0.375rem;
  height: 0.375rem;
  flex: 0 0 auto;
  border-radius: 0.125rem;
  background: #668096;
}

.category-label[data-category='Programming'] .category-label__marker {
  background: #b27b13;
}

.category-label[data-category='Software Design'] .category-label__marker {
  background: #52758f;
}

.category-label[data-category='Fiction'] .category-label__marker {
  background: #315f7b;
}

.category-label[data-category='Science'] .category-label__marker {
  background: #477a72;
}

.category-label[data-category='History'] .category-label__marker {
  background: #805945;
}
</style>
