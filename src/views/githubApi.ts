import axios from "axios";
import vm from "vm-browserify";
import qs from "qs";
import { ElNotification } from "element-plus";
const owner = "zqy233";
const repo = "monaco-editor-echarts";
let code = "";
let token = "";
const { client_id } = window;
const { client_secret } = window;
/** 跳转授权页面，授权后跳转OAuth App设置的路径，并且路径上会添加授权code */
export function getCode() {
  window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=public_repo`;
}

/** 设置token */
export function setToken() {
  code = qs.parse(window.location.search)["?code"] as string;
  token = localStorage.getItem("token");
  if (code) {
    if (!token) {
      getToken(code);
    }
  } else {
    getCode();
  }
}

// 可能触发 axios 中 try-catch 的情况：
// 网络请求失败或超时，导致 axios 方法抛出异常
// 无效的 GitHub API 访问令牌，导致 GitHub GraphQL API 返回 401 Unauthorized 状态码，进而抛出异常
// GraphQL 查询语句出错，例如拼写错误或无效的查询参数，导致 GitHub GraphQL API 返回 400 Bad Request 状态码，进而抛出异常
// 其他运行时错误，例如 JSON 解析错误等
// 在这些情况下，try-catch 语句会捕获异常，并执行 catch 块中的代码以进行异常处理

/** 根据路径上的code请求github的token */
export async function getToken(code: string): Promise<void> {
  try {
    const res = await axios.post(
      "https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token",
      {
        client_id,
        client_secret,
        code,
      },
      { headers: { Accept: "application/json" } }
    );
    // token获取成功
    if (res && res.data && res.data.access_token) {
      token = res.data.access_token;
      localStorage.setItem("token", token);
    } else {
      console.log("err: ", res.data);
      if (res.data.error === "bad_verification_code") {
        getCode();
      }
    }
  } catch (err) {
    console.log("err: ", err);
  }
}

/**
 * 获取仓库中 "echarts option" 标签的所有打开状态的 issue 数量
 * @param token GitHub API 访问令牌
 * @returns 返回打开状态的 issue 数量
 */
export async function getFilteredIssuesNum(): Promise<number> {
  const query = `query {
    repository(owner: "${owner}", name: "${repo}") {
      issues(states: [OPEN], labels: ["echarts option"]) {
        totalCount
      }
    }
  }`;
  try {
    const response = await axios.post(
      "https://api.github.com/graphql",
      { query },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data.repository.issues.totalCount;
  } catch (error) {
    console.error(
      `获取仓库中 "echarts option" 标签的所有打开状态的 issue 数量：`,
      error
    );
    return 0;
  }
}

export async function getIssues(label: string) {
  try {
    const res = await axios({
      method: "get",
      url: `https://api.github.com/repos/${owner}/${repo}/issues`,
      headers: { Authorization: "Bearer " + token },
      params: {
        labels: ["echarts option", label].join(","),
      },
    });
    const linkHeader = res.headers?.link;
    // linkHeader是这样的格式：
    // "<https://api.github.com/repositories/513548497/issues?labels=echarts+option&per_page=1&page=2>; rel="next", <https://api.github.com/repositories/513548497/issues?labels=echarts+option&per_page=1&page=3>; rel="last""

    // 这是一个通用的URI链接关系规范，称为Web Linking规范，允许Web文档和API使用标准化的方式声明URI链接之间的关系，以便客户端可以理解和使用这些关系
    // rel="next"是Web Linking规范中定义的一个链接关系类型（link relation type），用于指示链接的目标URI是资源的下一页
    // rel="last"用于指示链接的目标URI是一个资源的最后一页或末尾

    // 在Github API中，当响应结果超过每页的最大数量时，Github API会自动分页并包含一个或多个指向最后一页的链接，其中就包含了rel="last"的链接关系类型。因此，客户端可以使用这个链接来获取所有资源的总数和分页信息
    if (linkHeader) {
      const lastPageUrl = linkHeader
        .split(",")
        .find((link) => link.includes('rel="last"'))
        .match(/<(.+)>/)[1];
      console.log(lastPageUrl);
      const pageNumber = new URL(lastPageUrl).searchParams.get("page");
      console.log(pageNumber);
      // 计算问题总数，公式为：(最后一页的页码 - 1) * 每页的最大数量 + 最后一页的问题数量
      // const totalIssues = (lastPageNumber - 1) * per_page + lastPageNumber;
      // 所以必须再请求一次最后一页的数据，才能得到问题总数，所以暂时不考虑这样写，直接用Github graphql API获取问题总数（getFilteredIssuesNum函数）
    } else {
      console.log(`Link header not found in the response`);
    }
    return res.data;
  } catch (err) {
    console.log("err: ", err);
    return [];
  }
}

export async function createIssues(label, description) {
  const res = await axios({
    method: "post",
    url: `https://api.github.com/repos/${owner}/${repo}/issues`,
    headers: { Authorization: "Bearer " + token },
    data: {
      title: label,
      labels: ["echarts option", label],
      body: description,
    },
  });
  console.log(res);
  if (res.status === 201) {
    ElNotification({
      title: "Success",
      message: "新建问题成功",
      type: "success",
      duration: 3000,
    });
  }
}

interface issueOptionsType {
  title: string;
  optionStr: string;
  option: any;
}
/**
 * 获取所有issue的评论
 * @param issues issue列表
 */
export async function getAllIssuesComments(issues) {
  const issueOptions = ref<issueOptionsType[]>([]);
  issues.forEach(async ({ comments_url }: { comments_url: string }) => {
    const { data: res } = await axios({
      method: "get",
      url: comments_url,
      headers: { Authorization: "Bearer " + token },
    });
    res.forEach((item) => {
      const regex = /^([\s\S]*)\r?\n```js\r?\n([\s\S]*)\r?\n```$/;
      const match = item.body.match(regex);
      const title = match[1].trim();
      const option = match[2].trim();
      issueOptions.value.push({
        title,
        optionStr: option,
        option: runInNewContext(option),
      });
    });
  });
  return issueOptions;
}

/**
 * 创建评论
 * @param token GitHub API 访问令牌
 * @param num issue 编号
 * @returns 返回响应状态
 */
export async function createComments(token: string, num: number) {
  const title = "x轴文本换行";
  const option = `// formatter中处理x轴文本，添加\\n
option = {
  xAxis: {
    type: "category",
    data: ["这是一个很长的文本需要换行", "这是一个很长的文本需要换行", "这是一个很长的文本需要换行", "这是一个很长的文本需要换行", "这是一个很长的文本需要换行", "这是一个很长的文本需要换行", "这是一个很长的文本需要换行"],
    axisLabel: {
      formatter: (value) => {
        let label = "" // x轴显示的字符串
        let rowNum = 3 // 需要换行的行数
        let lineLength = value.length / rowNum // 每行显示文字个数
        for (let i = 0; i < rowNum; i++) {
          let temp = "" // 每次截取的字符串
          let start = i * lineLength // 开始截取的位置
          let end = start + lineLength // 结束截取的位置
          temp = value.substring(start, end) + "\\n"
          label += temp // 最终的字符串
        }
        return label
      }
    }
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: "bar",
    }
  ]
}`;
  const body = `${title}\r\n\`\`\`js\r\n${option}\r\n\`\`\``;
  try {
    const response = await axios({
      method: "post",
      url: `https://api.github.com/repos/zqy233/monaco-editor-echarts/issues/${num}/comments`,
      headers: { Authorization: "Bearer " + token },
      data: {
        body,
      },
    });
    return response;
  } catch (error) {
    console.error("创建评论失败：", error);
  }
}

interface gistArrType {
  title: string;
  option: any;
  id?: string;
}
/**
 * 获取github的gists
 * @param token
 */
export async function getGist(token: string) {
  const { data: gistList } = await axios({
    method: "get",
    url: `https://api.github.com/users/${owner}/gists`,
    headers: { Authorization: "Bearer " + token },
  });
  const gistListIds = gistList.map((item: any) => item.id);
  gistListIds.forEach(async (id: string) => {
    const { data: gist } = await axios({
      method: "get",
      url: `https://api.github.com/gists/${id}`,
      headers: { Authorization: "Bearer " + token },
    });
    // 我设计了一个gist规则，填写description信息时写入文件中文和文件名，用"-"分割
    const gistDescription = gist.description.split("-");
    const gistArr = <gistArrType[]>[];
    gistArr.push({
      title: gistDescription[0],
      option: runInNewContext(gist.files[gistDescription[1]].content),
      id,
    });
    return gistArr;
  });
}

/** 跳转github仓库地址 */
export function openGithub() {
  window.open(`https://github.com/${owner}/${repo}`);
}

/** 沙盒中运行代码，保证安全性 */
export function runInNewContext(sourcecode: string) {
  // vm.runInNewContext可以运行js代码，并返回最后一个变量的值，所以最后一个变量应是option
  return vm.runInNewContext(sourcecode);
}
