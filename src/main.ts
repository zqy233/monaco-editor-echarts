import { createApp } from "vue"
import App from "./App.vue"
import "xe-utils"

import {
  // 全局对象
  Edit,
  // 表格功能
  Validator,
  Table
} from "vxe-table"
const app = createApp(App)
function useTable() {
  // 表格功能
  app.use(Edit)
  app.use(Validator)
  // .use(Icon)
  // .use(Filter)
  // .use(Edit)
  // .use(Menu)
  // .use(Export)
  // .use(Keyboard)
  // .use(Validator)
  // 可选组件
  //  .use(Column)
  // .use(Colgroup)
  // .use(Grid)
  // .use(Tooltip)
  // .use(Toolbar)
  // .use(Pager)
  // .use(Form)
  // .use(FormItem)
  // .use(FormGather)
  // .use(Checkbox)
  // .use(CheckboxGroup)
  // .use(Radio)
  // .use(RadioGroup)
  // .use(RadioButton)
  // .use(Switch)
  // .use(Input)
  // .use(Select)
  // .use(Optgroup)
  // .use(Option)
  // .use(Textarea)
  // .use(Button)
  // .use(Modal)
  // .use(List)
  // .use(Pulldown)
  // 安装表格
  // .use(Table)
  // 给 vue 实例挂载内部对象，例如：
  // app.config.globalProperties.$XModal = VXETable.modal
  // app.config.globalProperties.$XPrint = VXETable.print
  // app.config.globalProperties.$XSaveFile = VXETable.saveFile
  // app.config.globalProperties.$XReadFile = VXETable.readFile
}

app.use(useTable).mount("#app")
