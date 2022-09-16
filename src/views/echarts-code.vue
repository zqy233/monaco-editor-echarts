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
import vm from "vm-browserify"
const route = useRoute()
const str = ref("")
const reqOptionsFile = async () => {
  const { data: gist } = await axios.get(`https://api.github.com/gists/${route.query.id}`)
  // 我设计了一个获取gist内容的规则，description信息包含文件中文和文件名，用"-"分割
  const gistDescription = gist.description.split("-")
  str.value = gist.files[gistDescription[1]].content
  run()
}
const options = ref<EChartsOption>()
const run = () => {
  options.value = vm.runInNewContext(str.value)
}
onMounted(() => {
  reqOptionsFile()
})

onActivated(() => {
  reqOptionsFile()
})
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

@media (max-width: 1200px) {
  .left {
    /* height: auto; */
  }
}
@media (max-width: 992px) {
  .echarts-demo {
    width: calc(33vw - 20px);
    height: calc(33vw - 20px);
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
