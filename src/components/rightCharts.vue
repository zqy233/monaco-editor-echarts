<template>
  <div class="chart" ref="chart"></div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import { init } from "echarts"
const chart = ref<null | HTMLElement>(null)
const props = withDefaults(
  defineProps<{
    option: any
  }>(),
  {}
)
let mychart: any = null
onMounted(() => {
  mychart = init(chart.value as HTMLElement)
  mychart.setOption(props.option)
  window.addEventListener("resize", () => {
    mychart.resize()
  })
})
watch(
  () => props.option,
  () => {
    mychart.setOption(props.option)
  }
)
</script>
<style>
.chart {
  width: 100%;
  height: 100%;
}
</style>
