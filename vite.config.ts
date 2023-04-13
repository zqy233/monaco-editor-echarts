import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import {
  createStyleImportPlugin,
  VxeTableResolve,
} from "vite-plugin-style-import";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { resolve } from "path";
import MonacoEditorNlsPlugin, {
  esbuildPluginMonacoEditorNls,
  Languages,
} from "./plugin";
const zh_CN = require("vscode-loc/i18n/vscode-language-pack-zh-hans/translations/main.i18n.json");
import Pages from "vite-plugin-pages";
import AutoImport from "unplugin-auto-import/vite";
import { createHtmlPlugin } from "vite-plugin-html";

export default ({ mode }) => {
  return defineConfig({
    base: "/monaco-editor-echarts/",
    build: {
      outDir: "docs",
    },
    resolve: {
      alias: {
        "@": resolve("./src"),
      },
    },
    optimizeDeps: {
      /** vite 版本需要大于等于2.3.0 */
      esbuildOptions: {
        plugins: [
          esbuildPluginMonacoEditorNls({
            locale: Languages.zh_hans,
            localeData: zh_CN.contents,
          }),
        ],
      },
    },
    plugins: [
      vue(),
      createHtmlPlugin({
        minify: false,
        // 入口，不需要在`index.html`内添加 script 标签，原有标签需要删除
        entry: "src/main.ts",
        // 将 `index.html`存放在指定文件夹
        template: "index.html",
        // 需要注入 index.html ejs 模版的数据
        inject: {
          data: {
            title: "echarts示例",
            injectScript:
              mode === "development"
                ? `<script src="./dev.js"></script>`
                : `<script src="./config.js"></script>`,
          },
        },
      }),
      // 自动导入api
      AutoImport({
        imports: ["vue", "vue-router"],
        dirs: ["src/store"],
        dts: "src/auto-import.d.ts",
      }),
      Pages({
        // 自动读取src/views下的vue文件，生成路由信息，默认路由路径'/‘
        dirs: [{ dir: "src/views", baseRoute: "/" }],
        // 异步方式加载路由组件
        importMode: "async",
        // 遍历路由信息，给默认路由加一个redirect
        // extendRoute(route) {
        //   if (route.path === "/") return { ...route, redirect: "login" }
        // }
      }),
      // 汉化
      MonacoEditorNlsPlugin({
        locale: Languages.zh_hans,
        localeData: zh_CN.contents,
      }),
      Components({
        dirs: ["src/components"], // 要导入组件的目录路径
        deep: true, // 搜索子目录
        dts: "src/components/components.d.ts", // 生成 `components.d.ts` 全局声明
        // 配置vxe-table的自动注册组件
        resolvers: [
          ElementPlusResolver(),
          (componentName) => {
            if (componentName.startsWith("Vxe"))
              return { name: componentName.slice(3), from: "vxe-table" };
          },
        ],
      }),
      // 配置vxe-table的自动导入组件样式
      createStyleImportPlugin({
        resolves: [VxeTableResolve()],
      }),
    ],
    server: {
      // 设置代理
      proxy: {
        "/login": "https://github.com",
      },
      port: 9005, // 端口号
      open: true, // 是否自动打开浏览器
    },
  });
};
