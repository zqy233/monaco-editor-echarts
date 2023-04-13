<template>
  <div class="chartPreviewImg">
    <el-skeleton class="w100h100" :loading="loading" animated>
      <template #template>
        <el-skeleton-item variant="image" class="w100h100" />
      </template>
      <template #default>
        <img :src="img" class="previewImg" />
      </template>
    </el-skeleton>
    <div class="chartPreviewImgDom" ref="chart" v-if="!img"></div>
  </div>
</template>
<script setup lang="ts">
import { init, EChartsOption, EChartsType } from "echarts";
// import html2canvas from "html2canvas"
const chart = ref<null | HTMLElement>(null);
const img = ref("");
const props = withDefaults(
  defineProps<{
    option: EChartsOption | undefined;
  }>(),
  {}
);
let mychart: EChartsType;
const loading = ref(true);

const resize = () => {
  mychart.resize();
};
const createChart = () => {
  if (!props.option) return;

  if (!mychart) {
    mychart = init(chart.value as HTMLElement);
    mychart.setOption(props.option);
    // 等待echarts渲染完生成图片，用于预览
    mychart.on("finished", () => {
      // 值得注意的是，resize、鼠标悬浮等事件都会触发finished事件
      // 所以需要判断，使图片仅生成一次
      if (!img.value) {
        img.value = mychart.getConnectedDataURL({ type: "png" });
        nextTick(() => {
          loading.value = false;
        });
        // echarts有自带的导出base64，暂不使用html2canvas
        // html2canvas(chart.value as HTMLElement).then(function (canvas) {
        //   img.value = canvas.toDataURL()
        // })
      }
    });
  } else {
    window.removeEventListener("resize", resize);
    mychart.clear(); // fix：上一次数据遗留的问题
    mychart.setOption(props.option);
  }
  window.addEventListener("resize", resize);
};
watch(
  () => props.option,
  () => {
    nextTick(() => {
      createChart();
    });
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
.chartPreviewImg {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.chartPreviewImgDom {
  width: 450px;
  height: 450px;
}
.previewImg {
  width: 100%;
  height: 100%;
  object-fit: fill;
  transition: all 0.3s;
}
.previewImg:hover {
  cursor: pointer;
  transform: scale(1.3);
}
.w100h100 {
  width: 100%;
  height: 100%;
}
</style>
