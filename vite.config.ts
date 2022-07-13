import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import Components from "unplugin-vue-components/vite"
import { createStyleImportPlugin, VxeTableResolve } from "vite-plugin-style-import"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import monacoEditorNlsPlugin, { Languages, esbuildPluginMonacoEditorNls } from "rollup-plugin-monaco-editor-nls"

const is_dev = process.env.NODE_ENV === "development"
export default defineConfig({
  base: "./",
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildPluginMonacoEditorNls({ locale: Languages.zh_hans })]
    }
  },
  plugins: [
    vue(),
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
    }),
    monacoEditorNlsPlugin({ locale: Languages.zh_hans })
  ]
})
