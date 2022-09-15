option = {
  tooltip: {
    show: true
  },
  series: [
    {
      type: "pie",
      radius: ["40%", "55%"],
      center: ["50%", "50%"],
      labelLine: {
        show: false,
        length: 0,
        length2: 5
      },
      tooltip: {
        trigger: "item",
        // 有name的才显示悬浮文本
        formatter: params => {
          if (params.name) return params.name + "   " + params.percent + "%"
        }
      },
      label: {
        color: "#444444",
        fontSize: 12,
        lineHeight: 30,
        formatter: params => {
          if (params.name) return params.name + "   " + params.percent + "%"
        }
      },
      data: [
        {
          value: 10,
          name: "学生"
        },
        {
          value: 20,
          name: "家长"
        },
        {
          value: 70,
          // name为空用于设置不显示悬浮文本
          name: "",
          // 灰色背景
          itemStyle: {
            color: "#EEEEEE"
          },
          // 不高亮
          emphasis: {
            disabled: true
          },
          // 不显示数值文本
          label: {
            show: false
          }
        }
      ]
    }
  ]
}
