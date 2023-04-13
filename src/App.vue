<template>
  <router-view v-slot="{ Component, route }">
    <!-- <transition name="fade"> -->
    <keep-alive :include="['index']">
      <component :is="Component" :key="route.fullPath" />
    </keep-alive>
    <!-- </transition> -->
  </router-view>
</template>

<script lang="ts" setup>
const route = useRoute();
console.log(route);
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
  height: 10px;
  background-color: #f2f3f9;
}

/*滚动条的滑块按钮*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #cccccc;
}
.fade-leave-to {
  display: none;
}
</style>
