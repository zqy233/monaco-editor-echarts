<template>
  <div class="editor">
    <div class="left">
      <leftEditor :modelValue="store.option" @run="run"></leftEditor>
    </div>
    <div class="right">
      <rightChart :option="options"></rightChart>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { EChartsOption } from "echarts";
import vm from "vm-browserify";
const store = useOptionStore();
const options = ref<EChartsOption>();
const run = () => {
  options.value = vm.runInNewContext(store.option);
};
onMounted(() => {
  run();
});
onActivated(() => {
  run();
});
</script>
<style lang="scss" scoped>
.editor {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  overflow: hidden;
  background-color: #fff;
}
.left {
  width: 50%;
  height: 100vh;
}

.right {
  width: 50%;
  height: 100vh;
}
@media (max-width: 992px) {
  .echarts-demo {
    width: calc(33vw - 20px);
    height: calc(33vw - 20px);
    margin-bottom: 30px;
  }
}
@media (max-width: 760px) {
  .left {
    width: calc(90vw - 20px);
    height: calc(50vh);
  }
  .right {
    margin-top: 30px;
    width: calc(100vw);
    height: calc(50vh);
  }
}
</style>
