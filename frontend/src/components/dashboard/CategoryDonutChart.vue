<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import {
  LegendComponent,
  TooltipComponent,
  TitleComponent
} from 'echarts/components'
import type { ComposeOption } from 'echarts/core'
import type { PieSeriesOption } from 'echarts/charts'
import type {
  LegendComponentOption,
  TitleComponentOption,
  TooltipComponentOption
} from 'echarts/components'

use([CanvasRenderer, PieChart, LegendComponent, TooltipComponent, TitleComponent])

type ECOption = ComposeOption<
  PieSeriesOption | LegendComponentOption | TitleComponentOption | TooltipComponentOption
>

export interface DonutItem {
  name: string
  count: number
  color: string
}

const props = defineProps<{
  items: DonutItem[]
  total: number
}>()

const option = computed<ECOption>(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: '#132f57',
    borderWidth: 0,
    textStyle: { color: '#fff', fontSize: 12 },
    formatter: '{b}: {c} ({d}%)'
  },
  title: {
    text: String(props.total),
    subtext: 'Total books',
    left: 'center',
    top: 'center',
    textStyle: { color: '#132f57', fontSize: 30, fontWeight: 700, fontFamily: 'Georgia, serif' },
    subtextStyle: { color: '#7486a0', fontSize: 12 },
    itemGap: 2
  },
  series: [
    {
      type: 'pie',
      radius: ['62%', '84%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: true,
      padAngle: 1,
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { scale: true, scaleSize: 4 },
      data: props.items.map((item) => ({
        name: item.name,
        value: item.count,
        itemStyle: { color: item.color }
      }))
    }
  ]
}))
</script>

<template>
  <VChart :option="option" autoresize class="size-48 shrink-0" aria-label="Books by category chart" />
</template>
