<script setup lang="ts">
import { computed } from 'vue'
import type { ICellRendererParams } from 'ag-grid-community'
import type { Book } from '../../services/books'

const props = defineProps<{ params: ICellRendererParams }>()
const copies = computed(() => Number((props.params.data as Book).availableCopies) || 0)
const tone = computed(() =>
  copies.value <= 2
    ? 'bg-[#fff0ee] text-[#b3261e] ring-[#f3c5c0]'
    : copies.value <= 4
      ? 'bg-[#fff6e5] text-[#8a5a00] ring-[#f0dcae]'
      : 'bg-[#eaf7f2] text-[#14684f] ring-[#bfe6d6]'
)
</script>

<template>
  <div class="flex h-full items-center justify-center">
    <span
      class="inline-flex min-w-9 items-center justify-center rounded-lg px-2 py-1 text-[13px] font-bold tabular-nums ring-1 ring-inset"
      :class="tone"
    >
      {{ copies }}
    </span>
  </div>
</template>
