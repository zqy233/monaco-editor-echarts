import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import Components from "unplugin-vue-components/vite"
import { createStyleImportPlugin, VxeTableResolve } from "vite-plugin-style-import"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
const prefix = `monaco-editor/esm/vs`
import { resolve } from "path"
import MonacoEditorNlsPlugin, { esbuildPluginMonacoEditorNls, Languages } from "./plugin"
const zh_CN = require("vscode-loc/i18n/vscode-language-pack-zh-hans/translations/main.i18n.json")
console.log(zh_CN)

const is_dev = process.env.NODE_ENV === "development"
// /monaco-editor-echarts/
export default defineConfig({
  base: is_dev ? "./" : "./",
  resolve: {
    alias: {
      "@": resolve("./src")
    }
  },
  // build: {
  //   sourcemap: true
  // },
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks: {
  //         tsWorker: [`${prefix}/language/typescript/ts.worker`]
  //       }
  //     }
  //   }
  // },
  optimizeDeps: {
    /** vite 版本需要大于等于2.3.0 */
    esbuildOptions: {
      plugins: [
        esbuildPluginMonacoEditorNls({
          locale: Languages.zh_hans,
          localeData: zh_CN.contents
        })
      ]
    }
  },
  plugins: [
    vue(),
    MonacoEditorNlsPlugin({
      locale: Languages.zh_hans,
      localeData: zh_CN.contents
    }),
    Components({
      // 配置vxe-table的自动注册组件
      resolvers: [
        ElementPlusResolver(),
        componentName => {
          if (componentName.startsWith("Vxe")) return { name: componentName.slice(3), from: "vxe-table" }
        }
      ]
    }),
    // 配置vxe-table的自动导入组件样式
    createStyleImportPlugin({
      resolves: [VxeTableResolve()]
    })
  ]
})
