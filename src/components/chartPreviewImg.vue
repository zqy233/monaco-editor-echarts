<template>
  <div class="chartPreviewImg">
    <el-skeleton class="w100h100" :loading="loading" animated>
      <template #template>
        <el-skeleton-item variant="image" class="w100h100" />
      </template>
      <template #default>
        <img :src="img" class="previewImg" v-if="img" />
      </template>
    </el-skeleton>
    <v-chart
      class="chartPreviewImgDom"
      :option="option"
      ref="vchart"
      @finished="finished"
      v-if="!img"
    />
  </div>
</template>
<script setup lang="ts">
import type { EChartsOption, EChartsType } from "echarts";
const vchart = ref<null | EChartsType>(null);
const img = ref("");
const props = withDefaults(
  defineProps<{
    option: EChartsOption | undefined;
  }>(),
  {}
);

const loading = ref(true);

// 动画结束才会会触发finished事件
const finished = () => {
  // resize、鼠标悬浮等事件都会触发finished事件
  // 所以需要判断，使图片仅生成一次
  if (!img.value) {
    img.value = vchart.value.getConnectedDataURL({ type: "png" });
    nextTick(() => {
      loading.value = false;
    });
  }
};

watch(
  () => props.option,
  () => {
    if (props.option?.series)
      if (Array.isArray(props.option?.series)) {
        props.option?.series.forEach((item: any) => {
          // fix: 修复动画不结束导致finished事件不出发的问题
          if (item.type === "liquidFill") {
            item.waveAnimation = false;
          }
        });
      }
  },
  {
    immediate: true,
    deep: true,
  }
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
