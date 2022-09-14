<template>
  <!-- 指定home组件和about组件被缓存 -->
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
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
  background-color: #f2f3f9;
}
</style>
