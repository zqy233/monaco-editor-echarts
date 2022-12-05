<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive>
      <component :is="Component" :key="route.fullPath" />
    </keep-alive>
  </router-view>
</template>

<script lang="ts">
// 自定义name的壳的集合
const wrapperMap = new Map()
export default {
  data() {
    return {
      include: [],
    }
  },
  watch: {
    $route: {
      handler(next) {
        // // ??这个按自己业务需要，看是否需要cache页面组件
        // const index = store.list.findIndex(item => item.fullPath === next.fullPath)
        // // 如果没加入这个路由记录，则加入路由历史记录
        // if (index === -1) {
        //   this.include.push(next.fullPath)
        // }
      },
      immediate: true,
    },
  },
  methods: {
    // 为keep-alive里的component接收的组件包上一层自定义name的壳
    wrap(fullPath: string, component: string) {
      let wrapper
      // 重点就是这里，这个组件的名字是完全可控的，
      // 只要自己写好逻辑，每次能找到对应的外壳组件就行，完全可以写成任何自己想要的名字
      // 这就能配合 keep-alive 的 include 属性可控地操作缓存
      if (component) {
        const wrapperName = fullPath
        if (wrapperMap.has(wrapperName)) {
          wrapper = wrapperMap.get(wrapperName)
        } else {
          wrapper = {
            name: wrapperName,
            render() {
              return h("div", { className: "vaf-page-wrapper" }, component)
            },
          }
          wrapperMap.set(wrapperName, wrapper)
        }
        return h(wrapper)
      }
    },
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
  background-color: var(--main-color);
}

/*滚动条整体部分,必须要设置*/
::-webkit-scrollbar {
  width: 10px;
  heigth: 10px;
  background-color: #f2f3f9;
}

/*滚动条的滑块按钮*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #cccccc;
  /* box-shadow: inset 0 0 5px #0099ff; */
}
</style>
