<template>
  <!-- <el-button @click="showDrawer">页面设置</el-button> -->
  <section class="echarts-demo-list">
    <div v-for="(item, index) in reqDataArr" :key="index" class="echarts-demo">
      <el-tooltip class="box-item" effect="dark" :content="item.name">
        <p class="echarts-demo-title">{{ item.name }}</p>
      </el-tooltip>
      <div class="echarts-demo-item">
        <chartPreviewImg :option="item.option" @click="routerPush(item.id)"></chartPreviewImg>
      </div>
    </div>
    <!-- <el-drawer v-model="drawer" title="页面设置" direction="rtl">
      <div class="themes-container">
        <h3 @click="setEchartsTheme()">切换echarts主题</h3>
        <div
          class="theme-toggler"
          :class="{ active: echartsTheme === 'dark' }"
          @click="setEchartsTheme()"
        >
          <span @click.stop="setEchartsTheme('light')">light</span>
          <span class="toggler"></span>
          <span @click.stop="setEchartsTheme('dark')">dark</span>
        </div>
        <h3>切换页面主题</h3>
        <div class="theme-colors">
          <div class="color" style="background: #2980b9"></div>
          <div class="color" style="background: #27ae60"></div>
          <div class="color" style="background: #ffa502"></div>
          <div class="color" style="background: #8e44ad"></div>
          <div class="color" style="background: #0fb9b1"></div>
          <div class="color" style="background: #ffd32a"></div>
          <div class="color" style="background: #ff0033"></div>
          <div class="color" style="background: #e84393"></div>
        </div>
      </div>
    </el-drawer> -->
  </section>
</template>
<script lang="ts" setup>
import axios from 'axios'
import vm from 'vm-browserify'
import qs from 'qs'

const router = useRouter()
const routerPush = (id: string) => {
  router.push({ path: '/echarts-code', query: { id } })
}

// 设置主题
// const drawer = ref(false)
// const showDrawer = () => {
//   drawer.value = true
// }
// const echartsTheme = ref('light')
// type echartThemeEnum = 'light' | 'dark'
// const setEchartsTheme = (theme?: echartThemeEnum) => {
//   ;(document.querySelector(':root') as HTMLElement).style.setProperty(
//     '--main-color',
//     echartsTheme.value === 'dark' ? '#f2f3f9' : '#262626'
//   )
//   if (theme) {
//     echartsTheme.value = theme
//   } else {
//     echartsTheme.value = echartsTheme.value === 'light' ? 'dark' : 'light'
//   }
// }

let token = ''
let code = ''
onMounted(() => {
  code = qs.parse(window.location.search)['?code'] as string
  if (code) {
    getToken()
  } else {
    githubLogin()
  }
})
/** 登录github，github会在路径上加上一个code */
const githubLogin = () => {
  location.href = 'https://github.com/login/oauth/authorize?client_id=07b3c567d304a6aa1b92'
}
/** 根据路径上的code请求github的token */
const getToken = async () => {
  try {
    const res = await axios.post(
      'https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token',
      {
        client_id: '07b3c567d304a6aa1b92',
        client_secret: 'edad2b4773120369d20226976f0dcc20f3587328',
        code,
      },
      { headers: { Accept: 'application/json' } }
    )
    // token获取成功
    if (res && res.data && res.data.access_token) {
      token = res.data.access_token
      localStorage.setItem('token', token)
      reqOptionsFile()
    } else {
      // token获取失败
      console.log('err: ', res.data)
      if (res.data.error === 'bad_verification_code') {
        githubLogin()
      }
    }
  } catch (err) {
    console.log('err: ', err)
  }
}
/** 获取github的gists */
interface reqDataArrType {
  name: string
  option: any
  id: string
}
const reqDataArr = ref<reqDataArrType[]>([])
const reqOptionsFile = async () => {
  const { data: gisList } = await axios({
    method: 'get',
    url: 'https://api.github.com/users/zqy233/gists',
    headers: { Authorization: 'Bearer ' + token },
  })
  const gisListIds = gisList.map((item: any) => item.id)
  gisListIds.forEach(async (id: string) => {
    const { data: gist } = await axios({
      method: 'get',
      url: `https://api.github.com/gists/${id}`,
      headers: { Authorization: 'Bearer ' + token },
    })
    // 我设计了一个获取gist内容的规则，description信息包含文件中文和文件名，用"-"分割
    const gistDescription = gist.description.split('-')
    reqDataArr.value.push({
      name: gistDescription[0],
      option: vm.runInNewContext(gist.files[gistDescription[1]].content),
      id,
    })
  })
}
</script>
<style lang="scss">
.echarts-demo-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding-bottom: 20px;
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

.themes-container {
  background: var(--bg);
  height: 50vh;
  text-align: right;
  padding: 0px 20px 20px 20px;

  #theme-close {
    font-size: 40px;
    color: var(--black);
    cursor: pointer;
  }

  h3 {
    text-align: center;
    color: var(--black);
    border-top: var(--border);
    border-bottom: var(--border);
    padding: 15px 0;
    margin: 20px 0;
  }

  .theme-toggler {
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      color: var(--light-color);
    }

    .toggler {
      height: 40px;
      width: 100px;
      border-radius: 50px;
      background: var(--light-bg);
      position: relative;
      cursor: pointer;
      border: var(--border);
      margin: 0 10px;

      &::before {
        content: '';
        position: absolute;
        top: 5px;
        left: 5px;
        height: 28px;
        width: 28px;
        border-radius: 50%;
        background: #fff;
        transition: 0.2s linear;
      }
    }

    &.active {
      .toggler {
        &::before {
          left: 65px;
        }
      }
    }
  }

  .theme-colors {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;

    .color {
      border-radius: 5px;
      height: 50px;
      width: 50px;
      cursor: pointer;

      &:hover {
        opacity: 0.5;
      }
    }
  }
}
</style>
