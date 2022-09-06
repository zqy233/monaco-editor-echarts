<template>
  <div class="editor">
    <div class="left">
      <leftEditor v-model="str" @run="run"></leftEditor>
    </div>
    <div class="right">
      <rightCharts :option="options"></rightCharts>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onBeforeMount } from "vue"
const str = ref(`option = {
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: "bar",
      showBackground: true,
      backgroundStyle: {
        color: "rgba(180, 180, 180, 0.2)"
      }
    }
  ]
}`)
const options = ref()
const run = () => {
  let option = ""
  eval(str.value)
  options.value = option
}
onBeforeMount(() => {
  run()
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
}

.left {
  width: 50%;
  height: 100vh;
}

.right {
  width: 50%;
}
</style>
