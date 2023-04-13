<template>
  <el-button @click="openGithub">github仓库地址</el-button>
  <el-button
    @click="
      createIssues('折线图', '折线图', '这个问题用于存储所有折线图option')
    "
    >创建问题</el-button
  >
  <el-button @click="a">创建评论</el-button>
  <el-button @click="test">测试vm</el-button>
  <el-button @click="getFilteredIssuesNum">getFilteredIssuesNum</el-button>
  {{ editableTabsValue }}
  <el-tabs
    v-model="editableTabsValue"
    type="card"
    editable
    class="demo-tabs"
    @edit="handleTabsEdit"
    @tab-click="handleTabClick"
  >
    <el-tab-pane
      v-for="item in editableTabs"
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
const routerPush = (optionStr: string) => {
  store.setOption(optionStr);
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

onMounted(async () => {
  await setToken();
  issues.value = await getIssues("");
  editableTabs.value = issues.value.map((item) => {
    return {
      title: `${item.title}（${item.comments}）`,
      name: item.title,
    };
  });
  editableTabs.value.unshift({ title: "全部", name: "" });
  const comments = await getAllIssuesComments(issues.value);
  issueOptions.value = comments.value;
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

const test = () => {
  console.log(runInNewContext(`const b = 10; i =b+ 1`));
};
let tabIndex = 2;
const editableTabsValue = ref("");
const editableTabs = ref([
  {
    title: "",
    name: "",
  },
]);

const handleTabsEdit = (
  targetName: TabPaneName | undefined,
  action: "remove" | "add"
) => {
  if (action === "add") {
    const newTabName = `${++tabIndex}`;
    editableTabs.value.push({
      title: "New Tab",
      name: "1",
    });
    editableTabsValue.value = newTabName;
  }
  if (action === "remove") {
    // const tabs = editableTabs.value;
    // let activeName = editableTabsValue.value;
    // if (activeName === targetName) {
    //   tabs.forEach((tab, index) => {
    //     if (tab.name === targetName) {
    //       const nextTab = tabs[index + 1] || tabs[index - 1];
    //       if (nextTab) {
    //         activeName = nextTab.name;
    //       }
    //     }
    //   });
    // }
    // editableTabsValue.value = activeName;
    // editableTabs.value = tabs.filter((tab) => tab.name !== targetName);
  }
};
const handleTabClick = async (pane) => {
  issues.value = await getIssues(pane.props.name);
  const comments = await getAllIssuesComments(issues.value);
  issueOptions.value = comments.value;
};
</script>
<style lang="scss">
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
