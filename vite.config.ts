import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import Components from "unplugin-vue-components/vite"
import { createStyleImportPlugin, VxeTableResolve } from "vite-plugin-style-import"

export default defineConfig({
  plugins: [
    vue(),
    Components({
      // 配置vxe-table的自动注册组件
      resolvers: [
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
