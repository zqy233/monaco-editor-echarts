<template>
  <el-button type="primary" @click="run">运行</el-button>
  <div ref="editContainer" class="code-editor"></div>
</template>
<script setup lang="ts">
import consola from "consola"
import { onMounted, ref } from "vue"
import * as monaco from "monaco-editor"
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import TsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"

self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    console.log(11111, label)
    if (["typescript", "javascript"].includes(label)) {
      return new TsWorker()
    }
    return new EditorWorker()
  }
}

const props = defineProps<{
  modelValue: string
}>()
const emits = defineEmits<{
  (e: "update:modelValue", b: string): void
  (e: "run"): void
}>()
const run = () => {
  emits("run")
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
onMounted(() => {
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
    theme: "vs-dark", // 主题，黑暗主题为vs-dark
    selectOnLineNumbers: true, // 选中行数
    automaticLayout: true, // 自动调整布局
    fontSize: 18, //字体大小
    autoIndent: "keep", //自动空行
    folding: true, // 是否启用代码折叠
    scrollBeyondLastLine: false, // 不到最后一行就开始滚动
    wordWrap: "on", // 自动换行
    showUnused: false // 不显示未使用的变量
  })

  // 编辑器内容发生变化时触发
  monacoEditor.onDidChangeModelContent(() => {
    const currenValue = monacoEditor?.getValue() // 获取编辑器内容
    consola.success(currenValue)
    emits("update:modelValue", currenValue) // 传递父组件v-model值
  })
})
</script>
<style>
.code-editor {
  height: 100%;
  /* border: 1px solid skyblue; */
}
</style>
