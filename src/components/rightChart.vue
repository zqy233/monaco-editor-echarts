<template>
  <article class="rightChart">
    <div class="rightChartDom" ref="chart"></div>
  </article>
</template>
<script setup lang="ts">
import { init, EChartsOption, EChartsType } from "echarts";
const chart = ref<null | HTMLElement>(null);
const props = withDefaults(
  defineProps<{
    option: EChartsOption | undefined;
  }>(),
  {
    option: undefined,
  }
);
let mychart: EChartsType;
const resize = () => {
  console.log(1111, props.option);
  mychart.resize();
  mychart.setOption(props.option);
  setTimeout(() => {
    mychart.resize();
    mychart.setOption(props.option);
  }, 500);
};
const createChart = () => {
  if (!props.option) return;
  if (!mychart) {
    mychart = init(chart.value as HTMLElement);
  } else {
    window.removeEventListener("resize", resize);
    mychart.clear(); // fix：上一次数据遗留的问题
  }
  mychart.setOption(props.option);
  window.addEventListener("resize", resize);
};
watch(
  () => props.option,
  () => {
    createChart();
  },
  {
    deep: true,
  }
);
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
