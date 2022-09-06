<template>
  <el-button type="primary" @click="run">运行</el-button>
  <el-button type="success" @click="copy">复制代码</el-button>
  <div ref="editContainer" class="code-editor"></div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue"
import * as monaco from "monaco-editor"
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import TsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
import axios from "axios"

const props = defineProps<{
  modelValue: string
}>()
const emits = defineEmits<{
  (e: "update:modelValue", b: string): void
  (e: "run"): void
}>()

/**
 * 编辑器当前代码内容
 */
const currenValue = ref("")

// 初始化编辑器环境
self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (["typescript", "javascript"].includes(label)) {
      return new TsWorker()
    }
    return new EditorWorker()
  }
}

/**
 * 提供echarts的类型提示
 *
 */
const createModel = async () => {
  const fact = (await axios.get("index.d.ts")).data
  monaco.languages.typescript.typescriptDefaults.addExtraLib(fact, "")
}

/**
 * 运行代码
 */
const run = () => {
  emits("run")
}

/**
 * 复制代码
 */
const copy = () => {
  const input = document.createElement("textarea") // 创建input节点用于调用copy功能,只支持textarea和input标签
  document.body.appendChild(input) // 将节点添加到body
  input.setAttribute("id", "saveStr") // 为input节点添加id,用来查到此节点
  ;(document.getElementById("saveStr") as HTMLInputElement).value = currenValue.value // 将需要复制的字符串赋值到input的value中
  input.select() // 选中文本(关键一步)
  document.execCommand("Copy") // 执行浏览器复制功能(关键一步)
  document.body.removeChild(input) // 完成复制后删除节点
}
// watch(
//   () => props.value,
//   value => {
//     // 防止改变编辑器内容时光标重定向
//     if (value !== monacoEditor?.getValue()) {
//       monacoEditor.setValue(value)
//     }
//   }
// )

const editContainer = ref<null | HTMLElement>(null)
onMounted(async () => {
  createModel()
  // 自定义代码补全
  const keywords = ["options"]
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false
  })
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2016,
    allowNonTsExtensions: true
  })
  monaco.languages.registerCompletionItemProvider("typescript", {
    provideCompletionItems: () => {
      let suggestions: any[] = []
      keywords.forEach(item => {
        suggestions.push({
          detail: "任何文字提示", // 代码补全右侧文本提示
          label: item, // 代码补全左侧文本
          insertText: item, // 插入编辑器中的补全代码
          kind: monaco.languages.CompletionItemKind.Function // 代码补全最左侧显示的图标
        })
      })
      return {
        suggestions: suggestions
      }
    }
  })
  const monacoEditor = monaco.editor.create(editContainer.value as HTMLElement, {
    value: props.modelValue,
    readOnly: false, // 只读
    language: "typescript", // 语言
    theme: "", // 主题，黑暗主题为vs-dark
    selectOnLineNumbers: true, // 选中行数
    automaticLayout: true, // 自动调整布局
    fontSize: 12, //字体大小
    autoIndent: "keep", //自动空行
    folding: true, // 是否启用代码折叠
    scrollBeyondLastLine: false, // 不到最后一行就开始滚动
    wordWrap: "on", // 自动换行
    showUnused: false // 不显示未使用的变量
  })
  currenValue.value = monacoEditor.getValue() // 存储编辑器内容给变量，以供复制
  // 编辑器内容发生变化时触发
  monacoEditor.onDidChangeModelContent(() => {
    currenValue.value = monacoEditor?.getValue() // 存储编辑器内容给变量，以供复制
    emits("update:modelValue", currenValue.value) // 传递父组件v-model值
  })
})
</script>
<style>
.code-editor {
  height: 100%;
  /* border: 1px solid skyblue; */
}
</style>
