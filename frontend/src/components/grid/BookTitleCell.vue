<script setup lang="ts">
import { computed } from 'vue'
import type { ICellRendererParams } from 'ag-grid-community'
import type { Book } from '../../services/books'

const props = defineProps<{ params: ICellRendererParams }>()
const book = computed(() => props.params.data as Book)

const initials = computed(() => {
  const words = book.value.title.split(/\s+/).filter(Boolean)
  return words
    .slice(0, 2)
    .map((word) => word.replace(/[^a-z0-9]/gi, '').charAt(0))
    .join('')
    .toUpperCase() || 'BK'
})
</script>

<template>
  <div class="book-title-cell">
    <span
      class="book-title-cell__cover"
      :data-category="book.category.name"
      aria-hidden="true"
    >
      <span class="book-title-cell__spine" />
      <span class="book-title-cell__initials">{{ initials }}</span>
    </span>

    <span class="book-title-cell__copy">
      <span
        class="book-title-cell__title"
        :title="book.title"
      >{{ book.title }}</span>
      <span
        class="book-title-cell__description"
        :title="book.description"
      >{{ book.description }}</span>
    </span>
  </div>
</template>

<style>
.book-title-cell {
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 0;
  align-items: center;
  gap: 0.625rem;
}

.book-title-cell__cover {
  position: relative;
  display: flex;
  width: 2rem;
  height: 2.625rem;
  flex: 0 0 auto;
  align-items: flex-end;
  justify-content: flex-end;
  overflow: hidden;
  border-radius: 0.1875rem 0.3125rem 0.3125rem 0.1875rem;
  background: #d8e3ec;
  padding: 0.3rem;
  color: #173c5e;
  font-family: var(--font-display);
  font-size: 0.6875rem;
  font-weight: 750;
  line-height: 1;
  box-shadow: 0 5px 10px rgba(20, 47, 70, 0.16);
}

.book-title-cell__cover[data-category='Programming'] {
  background: #d9aa3f;
  color: #17334b;
}

.book-title-cell__cover[data-category='Software Design'] {
  background: #d9e4eb;
  color: #214967;
}

.book-title-cell__cover[data-category='Fiction'] {
  background: #315f7b;
  color: #f3f6f8;
}

.book-title-cell__cover[data-category='Science'] {
  background: #477a72;
  color: #f4f8f7;
}

.book-title-cell__cover[data-category='History'] {
  background: #805945;
  color: #fbf7f3;
}

.book-title-cell__spine {
  position: absolute;
  top: 0.3rem;
  bottom: 0.3rem;
  left: 0.2rem;
  width: 1px;
  background: currentColor;
  opacity: 0.35;
}

.book-title-cell__copy {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 0.1rem;
}

.book-title-cell__title,
.book-title-cell__description {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-title-cell__title {
  color: #163957;
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 650;
  letter-spacing: -0.012em;
  line-height: 1.3;
}

.book-title-cell__description {
  color: #5f7489;
  font-size: 0.6875rem;
  line-height: 1.3;
}
</style>
