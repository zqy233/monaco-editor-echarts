<template>
  <section class="echarts-demo-list">
    <div class="echarts-demo" v-for="(item, index) in reqDataArr" :key="index">
      <chartPreviewImg :option="item.option" @click="routerPush(item.file)"></chartPreviewImg>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { EChartsOption } from "echarts"
import axios from "axios"
const router = useRouter()
interface reqDataArrType {
  option: EChartsOption
  file: string
}
const reqDataArr = ref<reqDataArrType[]>()
const reqOptionsFile = async () => {
  let reqPromiseAllArr = await Promise.all([req("bar1.js"), req("pie1.js"), req("pie2.js")].map(p => p.catch(e => e)))
  reqDataArr.value = reqPromiseAllArr.map(item => {
    let option: EChartsOption = {}
    console.log()
    eval(item.data)
    return {
      option,
      file: item.request.responseURL.split("/")[item.request.responseURL.split("/").length - 1]
    }
  })
}
onMounted(() => {
  reqOptionsFile()
})
const req = (js: string) => {
  return axios.get(window.BASE_URL + "echartsOptions/" + js)
}
const routerPush = (file: string) => {
  router.push({ path: "/echarts-code", query: { file } })
}
</script>
<style>
.echarts-demo-list {
  display: flex;
  /* justify-content: space-between; */
  flex-wrap: wrap;
}
.echarts-demo {
  padding: 10px;
  background-color: #fff;
  margin: 10px;
  width: calc(20vw - 20px);
  height: calc(20vw - 20px);
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
}
@media (max-width: 1200px) {
  .echarts-demo {
    width: calc(25vw - 20px);
    height: calc(25vw - 20px);
  }
}
@media (max-width: 992px) {
  .echarts-demo {
    width: calc(33vw - 20px);
    height: calc(33vw - 20px);
  }
}
@media (max-width: 760px) {
  .echarts-demo-list {
    justify-content: center;
  }
  .echarts-demo {
    width: calc(90vw - 20px);
    height: calc(90vw - 20px);
  }
}
</style>
