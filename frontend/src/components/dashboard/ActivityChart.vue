<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent
} from 'echarts/components'
import type { ComposeOption } from 'echarts/core'
import type { LineSeriesOption } from 'echarts/charts'
import type {
  GridComponentOption,
  TooltipComponentOption
} from 'echarts/components'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent])

type ECOption = ComposeOption<
  LineSeriesOption | GridComponentOption | TooltipComponentOption
>

const props = defineProps<{
  labels: string[]
  counts: number[]
}>()

const option = computed<ECOption>(() => ({
  grid: { left: 8, right: 12, top: 16, bottom: 0, containLabel: true },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'line', lineStyle: { color: '#8ca9ce', type: 'dashed' } },
    backgroundColor: '#132f57',
    borderWidth: 0,
    textStyle: { color: '#fff', fontSize: 12 },
    formatter: (params: unknown) => {
      const point = Array.isArray(params) ? params[0] : params as { axisValue?: string, value?: number }
      const value = typeof point.value === 'number' ? point.value : 0
      return `${point.axisValue ?? ''}: ${value} loan${value === 1 ? '' : 's'}`
    }
  },
  xAxis: {
    type: 'category',
    data: props.labels,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#7a8ba3', fontSize: 11 }
  },
  yAxis: {
    type: 'value',
    minInterval: 1,
    splitLine: { lineStyle: { color: '#e8eef6' } },
    axisLabel: { color: '#93a0b2', fontSize: 11 }
  },
  series: [
    {
      type: 'line',
      data: props.counts,
      smooth: true,
      symbol: 'circle',
      symbolSize: 9,
      itemStyle: { color: '#173b70', borderColor: '#ffffff', borderWidth: 2.5 },
      lineStyle: { color: '#173b70', width: 3, cap: 'round' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(43,101,173,0.18)' },
            { offset: 1, color: 'rgba(43,101,173,0.015)' }
          ]
        }
      }
    }
  ]
}))
</script>

<template>
  <VChart :option="option" autoresize class="h-52 w-full" aria-label="Weekly library activity chart" />
</template>
