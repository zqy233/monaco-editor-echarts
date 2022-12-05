<template>
  <el-upload class="upload-demo" drag action="http://localhost:3000/upload" multiple>
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text"><em>拖拽文件到此处</em> 或者 <em>点击上传</em></div>
    <template #tip>
      <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
    </template>
  </el-upload>
</template>

<script setup>
import { UploadFilled } from "@element-plus/icons-vue"
</script>
