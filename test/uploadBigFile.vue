<template>
  <div class="file-upload-fragment">
    <div class="file-upload-fragment-container">
      <el-upload class="fufc-upload" action="" :on-change="handleFileChange" :auto-upload="false" :show-file-list="false">
        <template #trigger>
          <el-button class="fufc-upload-file" size="small" type="primary"> 选择文件 </el-button>
        </template>
        <el-button class="fufc-upload-server" size="small" type="success" @click="handleUploadFile"> 上传到服务器 </el-button>
        <el-button class="fufc-upload-stop" size="small" type="primary" @click="stopUpload"> 暂停上传 </el-button>
        <el-button class="fufc-upload-continue" size="small" type="success" @click="continueUpload">继续上传</el-button>
      </el-upload>
      <el-progress :percentage="percentage" color="#409eff" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
// import { postUploadFile, mergeUploadFile, verifyUpload } from "@/api"
import { ElMessage } from "element-plus"
import axios from "axios"
import SparkMD5 from "spark-md5"
const cancelToken = axios.CancelToken
const chunkSize = 5 * 1024 * 1024
/**
 * @description: 生成文件hash
 * @param {*}
 * @return {*}
 */
const createMD5 = fileChunkList => {
  return new Promise((resolve, reject) => {
    const slice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
    const chunks = fileChunkList.length
    let currentChunk = 0
    let spark = new SparkMD5.ArrayBuffer()
    let fileReader = new FileReader()
    fileReader.onload = function (e) {
      spark.append(e.target.result)
      currentChunk++
      if (currentChunk < chunks) {
        loadChunk()
      } else {
        resolve(spark.end())
      }
    }

    fileReader.onerror = function (e) {
      reject(e)
    }

    function loadChunk() {
      fileReader.readAsArrayBuffer(fileChunkList[currentChunk])
    }

    loadChunk()
  })
}

let currentFile = ref(null)
let chunkFormData = ref([])
let fileHash = ref(null)
let percentage = computed(() => {
  if (!chunkFormData.value.length) return 0
  let uploaded = chunkFormData.value.filter(item => item.percentage).length
  return Number(((uploaded / chunkFormData.value.length) * 100).toFixed(2))
})
/**
 * @description: 创建文件分片
 * @param {*}
 * @return {*}
 */
const createChunkList = (file, chunkSize) => {
  const fileChunkList = []
  let cur = 0
  while (cur < file.size) {
    fileChunkList.push(file.slice(cur, cur + chunkSize))
    cur += chunkSize
  }
  return fileChunkList
}

/**
 * @description: 上传文件
 * @param {*}
 * @return {*}
 */
const handleFileChange = async file => {
  console.log(file, !file)
  if (!file) return
  currentFile.value = file
}

/**
 * @description: 分片上传回调
 * @param {*}
 * @return {*}
 */
const uploadProgress = item => {
  return e => {
    item.percentage = parseInt(String((e.loaded / e.total) * 100))
  }
}
/**
 * @description: 暂停上传
 * @param {*}
 * @return {*}
 */
const stopUpload = () => {
  chunkFormData.value.forEach(data => {
    data.cancelToken.cancel("取消上传")
    data.cancelToken = cancelToken.source()
  })
}
/**
 * @description: 断点续传
 * @param {*}
 * @return {*}
 */
const continueUpload = () => {
  let notUploaded = chunkFormData.value.filter(item => !item.percentage)
  Promise.all(
    notUploaded.map(data => {
      return new Promise((resolve, reject) => {
        axios({
          url: window.BASE_URL + "/uploadFile",
          method: "post",
          headers: {
            "Content-Type": "multipart/form-data"
          },
          data: data.formData
        }).then(res => {
          console.log(res)
        })
        // postUploadFile(data.formData, uploadProgress(data), data.cancelToken.token)
        //   .then(data => {
        //     resolve(data)
        //   })
        //   .catch(err => {
        //     reject(err)
        //   })
      })
    })
  ).then(data => {
    if (!data.includes(undefined)) {
      // mergeUploadFile({
      //   fileName: currentFile.value.name,
      //   fileHash: fileHash.value,
      //   chunkSize: chunkSize
      // })
    }
  })
}
/**
 * @description: 文件上传
 * @param {*}
 * @return {*}
 */
const handleUploadFile = async () => {
  if (!currentFile.value) {
    ElMessage.warning("请选择文件")
    return
  }
  // 文件分片
  let fileChunkList = createChunkList(currentFile.value.raw, chunkSize)
  console.log(fileChunkList)
  // 文件hash
  // let fileHash = await MultiThreadCreateMD5(currentFile.value.raw, chunkSize)
  fileHash.value = await createMD5(fileChunkList, chunkSize)
  // 判断文件是否存在
  // let { isUploaded } = await verifyUpload({
  //   fileHash: fileHash.value,
  //   fileName: currentFile.value.name
  // })

  // if (isUploaded) {
  //   ElMessage.warning("文件已存在")
  //   return
  // }

  let chunkList = fileChunkList.map((file, index) => {
    return {
      file: file,
      chunkHash: fileHash.value + "-" + index,
      fileHash: fileHash.value
    }
  })
  chunkFormData.value = chunkList.map(chunk => {
    let formData = new FormData()
    formData.append("chunk", chunk.file)
    formData.append("chunkHash", chunk.chunkHash)
    formData.append("fileHash", chunk.fileHash)
    return {
      formData: formData,
      percentage: 0,
      cancelToken: cancelToken.source()
    }
  })

  continueUpload()
}
</script>

<style scoped lang="scss">
.file-upload-fragment {
  width: 100%;
  height: 100%;
  padding: 10px;
  &-container {
    position: relative;
    margin: 0 auto;
    width: 600px;
    height: 300px;
    top: calc(50% - 150px);
    min-width: 400px;
    .fufc-upload {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .el-progress {
      margin-top: 10px;
      ::v-deep(.el-progress__text) {
        min-width: 0px;
      }
    }
  }
}
</style>
