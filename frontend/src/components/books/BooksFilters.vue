<script setup lang="ts">
interface ShelfOption {
  name: string
  count: number
}

const search = defineModel<string>('search', { required: true })
// Named `activeCategories`, not `shelves`: a model called `shelves` would
// shadow the `shelves` prop below and silently retype the v-for items.
const activeCategories = defineModel<string[]>('activeCategories', { required: true })

defineProps<{
  totalCount: number
  visibleCount: number
  hasActiveFilters: boolean
  shelves: ShelfOption[]
}>()

const emit = defineEmits<{
  clearAll: []
  selectAll: []
}>()

function toggleShelf(name: string) {
  activeCategories.value = activeCategories.value.includes(name)
    ? activeCategories.value.filter((shelf) => shelf !== name)
    : [...activeCategories.value, name]
}
</script>

<template>
  <section
    class="books-filters"
    aria-label="Search and filter books"
  >
    <div class="books-filters__toolbar">
      <div class="books-filters__title">
        <h2>Browse the collection</h2>
      </div>

      <SearchInput
        :model-value="search"
        class="books-filters__search"
        label="Search books by title, author, description or category"
        placeholder="Search the catalogue..."
        @update:model-value="search = $event"
      />

      <div class="books-filters__meta">
        <p
          role="status"
          aria-live="polite"
          class="books-filters__count"
        >
          <strong>{{ visibleCount }}</strong> of {{ totalCount }} titles
        </p>
        <button
          v-if="hasActiveFilters"
          type="button"
          class="books-filters__reset"
          aria-label="Reset catalogue filters"
          @click="emit('clearAll')"
        >
          <UIcon
            name="i-lucide-rotate-ccw"
            class="size-3.5"
            aria-hidden="true"
          />
          Reset
        </button>
      </div>
    </div>

    <div
      class="books-filters__shelves"
      role="group"
      aria-label="Filter by shelf"
    >
      <span class="books-filters__shelves-label">Shelves</span>
      <div class="books-filters__shelf-list">
        <button
          type="button"
          :aria-pressed="activeCategories.length === 0"
          :class="{ 'books-filters__shelf--active': activeCategories.length === 0 }"
          @click="emit('selectAll')"
        >
          All titles
          <span>{{ totalCount }}</span>
        </button>
        <button
          v-for="shelf in shelves"
          :key="shelf.name"
          type="button"
          :aria-pressed="activeCategories.includes(shelf.name)"
          :class="{ 'books-filters__shelf--active': activeCategories.includes(shelf.name) }"
          @click="toggleShelf(shelf.name)"
        >
          {{ shelf.name }}
          <span>{{ shelf.count }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.books-filters {
  position: relative;
  z-index: 2;
  flex: none;
  margin-top: -0.5rem;
  margin-bottom: -1px;
  border: 1px solid #dce5ee;
  border-radius: 0.8rem 0.8rem 0 0;
  background: #fff;
  padding: 0.45rem 0.75rem 0.4rem;
  box-shadow: 0 8px 20px rgba(26, 55, 81, 0.06);
}

.books-filters__toolbar {
  display: grid;
  grid-template-columns: minmax(9rem, 0.55fr) minmax(16rem, 1.45fr) auto;
  align-items: center;
  gap: 0.65rem;
}

.books-filters__title h2 {
  color: #102f49;
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 650;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.books-filters__meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}

.books-filters__count {
  white-space: nowrap;
  color: #5d7289;
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
}

.books-filters__count strong {
  color: #203c57;
  font-weight: 700;
}

.books-filters__reset {
  display: inline-flex;
  min-height: 2rem;
  align-items: center;
  gap: 0.3rem;
  border-radius: 0.45rem;
  padding: 0 0.5rem;
  color: #44617d;
  font-size: 0.75rem;
  font-weight: 650;
  transition: background-color 150ms ease, color 150ms ease;
}

.books-filters__reset:hover {
  background: #edf3f8;
  color: #183d60;
}

.books-filters__shelves {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 0.4rem;
  border-top: 1px solid #edf1f5;
  padding-top: 0.4rem;
}

.books-filters__shelves-label {
  flex: 0 0 auto;
  padding-top: 0.35rem;
  color: #61758a;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.books-filters__shelf-list {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.books-filters__shelf-list button {
  display: inline-flex;
  min-height: 1.8rem;
  align-items: center;
  gap: 0.35rem;
  border: 1px solid #dfe6ed;
  border-radius: 0.45rem;
  background: #fff;
  padding: 0.18rem 0.4rem 0.18rem 0.5rem;
  color: #50677f;
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1;
  transition: border-color 150ms ease, background-color 150ms ease, color 150ms ease, transform 150ms ease;
}

.books-filters__shelf-list button span {
  display: inline-flex;
  min-width: 1.1rem;
  height: 1.1rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  background: #eef3f7;
  color: #64798f;
  font-size: 0.6875rem;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
}

.books-filters__shelf-list button:hover {
  border-color: #bfccd9;
  background: #f8fafc;
  color: #203f5c;
}

.books-filters__shelf-list button:active {
  transform: translateY(1px);
}

.books-filters__shelf-list .books-filters__shelf--active {
  border-color: #173c5e;
  background: #173c5e;
  color: #fff;
}

.books-filters__shelf-list .books-filters__shelf--active span {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

:deep(.books-filters__search .search-field__input) {
  height: 2.25rem;
  border-color: #d6e0ea;
  border-radius: 0.55rem;
  background: #f8fafc;
  color: #213c55;
}

@media (max-width: 767px) {
  .books-filters {
    margin-top: 0;
    border-radius: 0.8rem;
    padding: 0.5rem;
    box-shadow: 0 5px 16px rgba(26, 55, 81, 0.05);
  }

  .books-filters__toolbar {
    grid-template-columns: 1fr auto;
    gap: 0.4rem;
  }

  .books-filters__title {
    grid-column: 1;
  }

  .books-filters__meta {
    grid-column: 2;
  }

  .books-filters__search {
    grid-row: 2;
    grid-column: 1 / -1;
  }

  :deep(.books-filters__search .search-field__input) {
    height: 2.5rem;
    font-size: 0.875rem;
  }

  .books-filters__shelves {
    gap: 0.4rem;
  }

  .books-filters__shelves-label {
    padding-top: 0.4rem;
  }

  .books-filters__shelf-list {
    width: 100%;
  }

  .books-filters__shelf-list button {
    min-height: 2.25rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .books-filters__reset,
  .books-filters__shelf-list button {
    transition: none;
  }
}
</style>