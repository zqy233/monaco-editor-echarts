<template>
  <article class="rightChart">
    <div class="rightChartDom" ref="chart"></div>
  </article>
</template>
<script setup lang="ts">
import { init, EChartsOption, EChartsType } from "echarts"
const chart = ref<null | HTMLElement>(null)
const props = withDefaults(
  defineProps<{
    option: EChartsOption | undefined
  }>(),
  {
    option: undefined
  }
)
let mychart: EChartsType

const createChart = () => {
  if (!props.option) return

  if (!mychart) {
    mychart = init(chart.value as HTMLElement)
    mychart.setOption(props.option)
    window.addEventListener("resize", () => {
      mychart.resize()
    })
  } else {
    mychart.clear() // fix：上一次数据遗留的问题
    mychart.setOption(props.option)
  }
}
watch(
  () => props.option,
  () => {
    createChart()
  }
)
</script>
<style>
.rightChart {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.rightChartDom {
  width: 100%;
  height: 100%;
}
</style>
