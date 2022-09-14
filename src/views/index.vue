<template>
  <section class="echarts-demo-list">
    <div class="echarts-demo" v-for="(item, index) in 5" :key="index">
      <chartPreviewImg :option="options" @click="routerPush"></chartPreviewImg>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { EChartsOption } from "echarts"
import axios from "axios"
const router = useRouter()
const options = ref<EChartsOption>()

const reqOptionsFile = async () => {
  let option = {}
  console.log(window.BASE_URL + "echartsOptions/bar1.js")

  eval((await axios.get(window.BASE_URL + "echartsOptions/bar1.js")).data)
  options.value = option
}
onMounted(() => {
  reqOptionsFile()
})
const routerPush = () => {
  router.push("/echarts-code")
}
</script>
<style>
.echarts-demo-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.echarts-demo {
  padding: 10px;
  background-color: #fff;
  margin: 10px;
  width: calc(25vw - 20px);
  height: 15vw;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
}
@media (max-width: 992px) {
  .echarts-demo {
    width: calc(33vw - 20px);
    height: 23vw;
  }
}
@media (max-width: 760px) {
  .echarts-demo {
    width: calc(100vw - 20px);
    height: 70vw;
  }
}
</style>
