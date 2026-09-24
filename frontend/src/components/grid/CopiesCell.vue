<script setup lang="ts">
import { computed } from 'vue'
import type { ICellRendererParams } from 'ag-grid-community'
import type { Book } from '../../services/books'

const props = defineProps<{ params: ICellRendererParams }>()
const copies = computed(() => Number((props.params.data as Book).availableCopies) || 0)
const status = computed(() => copies.value <= 2 ? 'Low stock' : copies.value <= 4 ? 'Limited' : 'In stock')
</script>

<template>
  <div
    class="stock-cell"
    :data-stock="status.toLowerCase().replace(' ', '-')"
  >
    <span class="stock-cell__count">{{ copies }}</span>
    <span class="stock-cell__copy">
      <span>{{ copies === 1 ? 'copy' : 'copies' }}</span>
      <small>{{ status }}</small>
    </span>
  </div>
</template>

<style scoped>
.stock-cell {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.stock-cell__count {
  display: inline-flex;
  width: 1.75rem;
  height: 1.75rem;
  align-items: center;
  justify-content: center;
  border: 1px solid #cfe2da;
  border-radius: 0.5rem;
  background: #edf7f3;
  color: #17634f;
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  font-weight: 750;
  line-height: 1;
}

.stock-cell__copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  color: #526a81;
  font-size: 0.6875rem;
  line-height: 1.25;
}

.stock-cell__copy small {
  color: #5f7489;
  font-size: 0.625rem;
  line-height: 1.2;
}

.stock-cell[data-stock='low-stock'] .stock-cell__count {
  border-color: #efcac5;
  background: #fff0ee;
  color: #a9342b;
}

.stock-cell[data-stock='limited'] .stock-cell__count {
  border-color: #ead7a8;
  background: #fff7e7;
  color: #855700;
}

.stock-cell[data-stock='low-stock'] small {
  color: #a9342b;
}

.stock-cell[data-stock='limited'] small {
  color: #855700;
}
</style>
