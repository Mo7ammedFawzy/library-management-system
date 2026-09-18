<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent } from 'echarts/components'
import type { ECharts, EChartsCoreOption } from 'echarts/core'

echarts.use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent])

export interface DonutItem {
  name: string
  count: number
  color: string
}

const props = defineProps<{
  items: DonutItem[]
  total: number
}>()

const el = ref<HTMLDivElement | null>(null)
let chart: ECharts | null = null
let observer: ResizeObserver | null = null

function buildOption(): EChartsCoreOption {
  return {
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
  }
}

function render() {
  if (!chart) return
  chart.setOption(buildOption(), { notMerge: true })
}

onMounted(() => {
  if (!el.value) return
  chart = echarts.init(el.value)
  render()
  observer = new ResizeObserver(() => chart?.resize())
  observer.observe(el.value)
})

watch(() => [props.items, props.total], render, { deep: true })

onBeforeUnmount(() => {
  observer?.disconnect()
  chart?.dispose()
  chart = null
})
</script>

<template>
  <div ref="el" role="img" aria-label="Books by category chart" style="width: 192px; height: 192px" class="shrink-0" />
</template>
