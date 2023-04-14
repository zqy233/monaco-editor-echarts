import "echarts";
import "echarts-liquidfill";
import Echarts from "vue-echarts";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { createRouter, createWebHashHistory } from "vue-router";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
// 这里就是vite-plugin-pages生成的路由信息，正常使用即可
import routes from "virtual:generated-pages";
const app = createApp(App);
app.component("VChart", Echarts);
console.log("路由信息：", routes);
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
app.use(ElementPlus).use(createPinia()).use(router).mount("#app");
