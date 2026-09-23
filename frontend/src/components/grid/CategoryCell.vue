<script setup lang="ts">
import { computed } from 'vue'
import type { ICellRendererParams } from 'ag-grid-community'
import type { Book } from '../../services/books'

const props = defineProps<{ params: ICellRendererParams }>()
const name = computed(() => (props.params.data as Book).category.name)
</script>

<template>
  <div class="flex h-full items-center">
    <span
      class="inline-flex max-w-full items-center gap-1.5 truncate rounded-full bg-[#edf4ff] px-2.5 py-1 text-[11px] font-bold leading-4 text-[#173b70] ring-1 ring-inset ring-[#cdd9e8]"
    >
      <span class="size-1.5 shrink-0 rounded-full bg-[#2161bf]" aria-hidden="true" />
      <span class="truncate">{{ name }}</span>
    </span>
  </div>
</template>
