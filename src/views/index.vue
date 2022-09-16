<template>
  <section class="echarts-demo-list">
    <div v-for="(item, index) in reqDataArr" :key="index" class="echarts-demo">
      <el-tooltip class="box-item" effect="dark" :content="item.name">
        <p class="echarts-demo-title">{{ item.name }}</p>
      </el-tooltip>
      <div class="echarts-demo-item">
        <chartPreviewImg :option="item.option" @click="routerPush(item.id)"></chartPreviewImg>
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { EChartsOption } from "echarts"
import axios from "axios"
import vm from "vm-browserify"
const router = useRouter()
interface reqDataArrType {
  name: string
  option: any
  id: string
}
const reqDataArr = ref<reqDataArrType[]>([])

const reqOptionsFile = async () => {
  const { data: gisList } = await axios.get("https://api.github.com/users/zqy233/gists")
  console.log(gisList)
  const gisListIds = gisList.map((item: any) => item.id)
  gisListIds.forEach(async (id: string) => {
    const { data: gist } = await axios.get(`https://api.github.com/gists/${id}`)
    // 我设计了一个获取gist内容的规则，description信息包含文件中文和文件名，用"-"分割
    const gistDescription = gist.description.split("-")
    // let option: EChartsOption = {}
    // eval(gist.files[gistDescription[1]].content)
    reqDataArr.value.push({
      name: gistDescription[0],
      option: vm.runInNewContext(gist.files[gistDescription[1]].content),
      id
    })
  })
}
onMounted(() => {
  reqOptionsFile()
})
const req = (id: string) => {
  return axios.get(" https://api.github.com/gists/" + id)
}
const routerPush = (id: string) => {
  router.push({ path: "/echarts-code", query: { id } })
}
</script>
<style>
.echarts-demo-list {
  display: flex;
  flex-wrap: wrap;
}
.echarts-demo-title {
  font-size: 14px;
  height: 40px;
  width: 80%;
  margin: 0 auto;
  text-align: center;
  line-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.echarts-demo {
  width: calc(20vw - 20px);
  height: calc(20vw - 20px);
}

.echarts-demo-item {
  padding: 10px;
  background-color: #fff;
  margin: 0 auto;
  width: calc(100% - 20px);
  height: calc(100% - 40px);
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
