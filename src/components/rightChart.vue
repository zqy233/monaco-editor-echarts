<template>
  <article class="rightChart">
    <v-chart class="rightChartDom" :option="option" ref="vchart" />
  </article>
</template>
<script setup lang="ts">
import vm from "vm-browserify";
const store = useOptionStore();
const option = ref({});
const vchart = ref();
watch(
  () => store.option,
  () => {
    nextTick(() => {
      console.log(vchart.value);
      // vchart.value.clear();
      option.value = vm.runInNewContext(store.option);
    });
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>
<style lang="scss" scoped>
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
