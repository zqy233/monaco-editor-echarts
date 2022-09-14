<template>
  <div class="editor">
    <div class="left">
      <leftEditor v-model="str" @run="run"></leftEditor>
    </div>
    <div class="right">
      <rightChart :option="options"></rightChart>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { EChartsOption } from "echarts"
import axios from "axios"
const str = ref("")
const reqOptionsFile = async () => {
  console.log()

  str.value = (await axios.get(window.BASE_URL + "echartsOptions/bar1.js")).data
  run()
}
const options = ref<EChartsOption>()
const run = () => {
  let option = {}
  eval(str.value)
  options.value = option
}
onMounted(() => {
  reqOptionsFile()
})
</script>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.editor {
  display: flex;
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
</style>
