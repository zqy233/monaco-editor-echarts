<template>
  <el-dialog v-model="dialogFormVisible" title="新建标签卡（新建echarts类别）">
    <el-form :model="form" :rules="rules" status-icon>
      <el-form-item label="名称" :label-width="80" prop="label">
        <el-input v-model="form.label" autocomplete="off" />
      </el-form-item>
      <el-form-item label="描述" :label-width="80">
        <el-input v-model="form.description" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm" :loading="loading">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-button-group class="btns">
    <el-button @click="openGithub">github仓库地址</el-button>
    <el-button @click="routerPush(demoStr)">新建echarts option</el-button>
  </el-button-group>
  <el-tabs
    v-model="editableTabsValue"
    type="card"
    editable
    tab-position="bottom"
    @edit="handleTabsEdit"
    @tab-click="handleTabClick"
  >
    <el-tab-pane
      v-for="(item, index) in editableTabs"
      :key="item.title"
      :label="item.title"
      :name="item.name"
    >
    </el-tab-pane>
  </el-tabs>
  <!-- <el-button @click="showDrawer">页面设置</el-button> -->
  <section class="echarts-demo-list">
    <div
      v-for="(item, index) in issueOptions"
      :key="index"
      class="echarts-demo"
    >
      <el-tooltip class="box-item" effect="dark" :content="item.title">
        <p class="echarts-demo-title">{{ item.title }}</p>
      </el-tooltip>
      <div class="echarts-demo-item">
        <chartPreviewImg
          :option="item.option"
          @click="routerPush(item.optionStr)"
        ></chartPreviewImg>
      </div>
    </div>
    <!-- <el-drawer v-model="drawer" title="页面设置" direction="rtl">
      <div class="themes-container">
        <h3 @click="setEchartsTheme()">切换echarts主题</h3>
        <div
          class="theme-toggler"
          :class="{ active: echartsTheme === 'dark' }"
          @click="setEchartsTheme()"
        >
          <span @click.stop="setEchartsTheme('light')">light</span>
          <span class="toggler"></span>
          <span @click.stop="setEchartsTheme('dark')">dark</span>
        </div>
        <h3>切换页面主题</h3>
        <div class="theme-colors">
          <div class="color" style="background: #2980b9"></div>
          <div class="color" style="background: #27ae60"></div>
          <div class="color" style="background: #ffa502"></div>
          <div class="color" style="background: #8e44ad"></div>
          <div class="color" style="background: #0fb9b1"></div>
          <div class="color" style="background: #ffd32a"></div>
          <div class="color" style="background: #ff0033"></div>
          <div class="color" style="background: #e84393"></div>
        </div>
      </div>
    </el-drawer> -->
  </section>
</template>
<script lang="ts" setup>
import type { TabPaneName } from "element-plus";
import { EChartsOption } from "echarts";
import {
  setToken,
  getFilteredIssuesNum,
  getAllIssuesComments,
  openGithub,
  getIssues,
  createIssues,
  runInNewContext,
} from "./githubApi";

const store = useOptionStore();
const router = useRouter();
let scrollTop = 0;

const routerPush = (optionStr: string) => {
  store.setOption(optionStr);
  scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  router.push({ path: "/echarts-code" });
};

// const reqDataArr = ref([]);
// 设置主题
// const drawer = ref(false)
// const showDrawer = () => {
//   drawer.value = true
// }
// const echartsTheme = ref('light')
// type echartThemeEnum = 'light' | 'dark'
// const setEchartsTheme = (theme?: echartThemeEnum) => {
//   ;(document.querySelector(':root') as HTMLElement).style.setProperty(
//     '--main-color',
//     echartsTheme.value === 'dark' ? '#f2f3f9' : '#262626'
//   )
//   if (theme) {
//     echartsTheme.value = theme
//   } else {
//     echartsTheme.value = echartsTheme.value === 'light' ? 'dark' : 'light'
//   }
// }
interface issueOptionsType {
  title: string;
  optionStr: string;
  option: any;
}
const issues = ref([]);
const issueOptions = ref<issueOptionsType[]>([]);

/**
 * 根据标签查询问题中options列表（实际上就是评论列表）
 * @param label 标签
 */
const setIssueOptions = async (label) => {
  issues.value = await getIssues(label);
  if (!label) {
    editableTabs.value = issues.value.map((item) => {
      return {
        title: `${item.title}（${item.comments}）`,
        name: item.title,
      };
    });
    editableTabs.value.unshift({ title: "全部", name: "" });
  } else {
    // 更新数量
    editableTabs.value.find(
      (item) => item.name === label
    ).title = `${label}（${issues.value[0].comments}）`;
  }
  const comments = await getAllIssuesComments(issues.value);
  issueOptions.value = comments.value;
};
onMounted(async () => {
  await setToken();
  if (!issueOptions.value.length) {
    setIssueOptions("");
  }
});
// const a = () => {
//   createComments(token, 8);
// };

// const getUser = async () => {
//   const { data: res } = await axios({
//     method: "get",
//     url: `https://api.github.com/user`,
//     headers: { Authorization: "Bearer " + token },
//   });
// };

const editableTabsValue = ref("");
const editableTabs = ref([]);

const handleTabsEdit = (
  targetName: TabPaneName | undefined,
  action: "remove" | "add"
) => {
  if (action === "add") {
    dialogFormVisible.value = true;
  }
  if (action === "remove") {
  }
};
const handleTabClick = async (pane) => {
  setIssueOptions(pane.props.name);
};

const dialogFormVisible = ref(false);
const form = ref({
  label: "柱图",
  description: "这个问题用于存储所有柱图option",
});

const rules = reactive({
  label: [{ required: true, message: "名称不能为空", trigger: "blur" }],
});

const loading = ref(false);
const confirm = async () => {
  loading.value = true;
  await createIssues(form.value.label, form.value.description);
  dialogFormVisible.value = false;
  loading.value = false;
};

const demoStr = `option = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }
  ]
};`;

onActivated(() => {
  nextTick(() => {
    document.body.scrollTop = scrollTop;
    document.documentElement.scrollTop = scrollTop;
  });
});
</script>
<style lang="scss">
.btns {
  margin-bottom: 10px;
}
.el-tabs--card > .el-tabs__header .el-tabs__item.is-active.is-closable {
  background-color: #fff;
}
.echarts-demo-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding-bottom: 20px;
}

.echarts-demo-title {
  font-size: 14px;
  height: 40px;
  width: 80%;
  margin: 0 auto;
  text-align: center;
  line-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.echarts-demo {
  width: calc(20vw - 20px);
  height: calc(20vw - 20px);
  margin-bottom: 30px;
}

.echarts-demo-item {
  padding: 10px;
  background-color: #fff;
  margin: 0 auto;
  width: calc(100% - 20px);
  height: calc(100% - 40px);
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
}

@media (max-width: 1200px) {
  .echarts-demo {
    width: calc(25vw - 20px);
    height: calc(25vw - 20px);
  }
}

@media (max-width: 992px) {
  .echarts-demo {
    width: calc(33vw - 20px);
    height: calc(33vw - 20px);
  }
}

@media (max-width: 760px) {
  .echarts-demo-list {
    justify-content: center;
  }

  .echarts-demo {
    width: calc(90vw - 20px);
    height: calc(90vw - 20px);
  }
}

.themes-container {
  background: var(--bg);
  height: 50vh;
  text-align: right;
  padding: 0px 20px 20px 20px;

  #theme-close {
    font-size: 40px;
    color: var(--black);
    cursor: pointer;
  }

  h3 {
    text-align: center;
    color: var(--black);
    border-top: var(--border);
    border-bottom: var(--border);
    padding: 15px 0;
    margin: 20px 0;
  }

  .theme-toggler {
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      color: var(--light-color);
    }

    .toggler {
      height: 40px;
      width: 100px;
      border-radius: 50px;
      background: var(--light-bg);
      position: relative;
      cursor: pointer;
      border: var(--border);
      margin: 0 10px;

      &::before {
        content: "";
        position: absolute;
        top: 5px;
        left: 5px;
        height: 28px;
        width: 28px;
        border-radius: 50%;
        background: #fff;
        transition: 0.2s linear;
      }
    }

    &.active {
      .toggler {
        &::before {
          left: 65px;
        }
      }
    }
  }

  .theme-colors {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;

    .color {
      border-radius: 5px;
      height: 50px;
      width: 50px;
      cursor: pointer;

      &:hover {
        opacity: 0.5;
      }
    }
  }
}
</style>
