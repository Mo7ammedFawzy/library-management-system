<script setup lang="ts">
import { computed } from 'vue'
import type { ICellRendererParams } from 'ag-grid-community'

interface ActionsCellParams extends ICellRendererParams {
  onEdit?: (params: ICellRendererParams) => void
  onDelete?: (params: ICellRendererParams) => void
}

interface ActionItem {
  name?: string
  title?: string
}

const props = defineProps<{
  params: ActionsCellParams
}>()

const itemName = computed(() => {
  const item = props.params.data as ActionItem | undefined
  return item?.title || item?.name || ''
})
</script>

<template>
  <div class="flex h-full items-center justify-end gap-1">
    <UButton
      v-if="props.params.onEdit"
      icon="i-lucide-pencil"
      color="neutral"
      variant="ghost"
      size="sm"
      :aria-label="itemName ? `Edit ${itemName}` : 'Edit item'"
      class="!size-8 !min-w-8 !rounded-lg !text-[#5b7188] hover:!bg-[#eaf0f5] hover:!text-[#173c5e]"
      @click="props.params.onEdit?.(props.params)"
    />
    <UButton
      v-if="props.params.onDelete"
      icon="i-lucide-trash-2"
      color="neutral"
      variant="ghost"
      size="sm"
      :aria-label="itemName ? `Delete ${itemName}` : 'Delete item'"
      class="!size-8 !min-w-8 !rounded-lg !text-[#718397] hover:!bg-red-50 hover:!text-red-700"
      @click="props.params.onDelete?.(props.params)"
    />
  </div>
</template>
