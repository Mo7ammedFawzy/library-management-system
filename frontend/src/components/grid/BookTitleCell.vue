<script setup lang="ts">
import { computed } from 'vue'
import type { ICellRendererParams } from 'ag-grid-community'
import type { Book } from '../../services/books'

const props = defineProps<{ params: ICellRendererParams }>()
const book = computed(() => props.params.data as Book)
</script>

<template>
  <div class="flex h-full min-w-0 items-center gap-2.5">
    <span
      class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#edf4ff] text-[#2161bf] ring-1 ring-inset ring-[#cdd9e8]"
      aria-hidden="true"
    >
      <UIcon name="i-lucide-book-open" class="size-4" />
    </span>
    <span class="min-w-0 truncate font-serif text-[14px] font-bold tracking-[-0.01em] text-[#132f57]">
      {{ book.title }}
    </span>
  </div>
</template>
