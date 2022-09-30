<!--
 * @Author: your name
 * @Date: 2021-08-18 15:58:21
 * @LastEditTime: 2021-08-18 18:10:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project-nanhai\src\views\modules\riskInvestigation\statisticAnalysis\eventInformation\eventDistribution\echarts\echartThree.vue
-->
<template>
  <div :id="id" style="width: 100%;height:100%">
  </div>
</template>

<script>
import echarts from 'echarts';
export default {
  name: 'EchartThree',
  props: [
    'colorList',
    'dataList',
    'id'
  ],
  data() {
    return {}
  },
  mounted() {
    this.$nextTick( () =>{
      this.drawLine();
    })
  },
  methods: {
    drawLine(dataName,dataValue,series) {
      let chartThree = echarts.init(document.getElementById('chartThree'));
      this.$nextTick(() =>{
        chartThree.resize();
      });
      let option = {
          title: {
              text: '受伤人数分布'
          },
          tooltip: {
              trigger: 'axis',
              tooltip: {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                  type : 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
                  shadowStyle: { // axisPointer.type 为 'shadow' 时有效。
                    color: 'rgba(54, 121, 225, 0.09)', // 填充的颜色。
                  }
                },
                backgroundColor: '#ffffff',
                textStyle: { // 提示框浮层的文本样式。
                  color: '#6B6B6B' // 文字的颜色
                }
              }
          },
          legend: {
              right: 0, // 图例组件离容器右侧的距离
              itemWidth: 10, // 图例标记的图形宽度
              itemHeight: 10, // 图例标记的图形高度
              data: dataValue, // 图例的数据数组
              type: 'scroll', // 图例的类型 'scroll'：可滚动翻页的图例
              width: '380' // 图例组件的宽度
          },
          grid: { // 直角坐标系内绘图网
              left: '3%', // grid 组件离容器左侧的距离
              right: '4%', // grid 组件离容器右侧的距离
              bottom: '3%', // grid 组件离容器下侧的距离
              containLabel: true // grid 区域是否包含坐标轴的刻度标签
          },
          xAxis: [ // 直角坐标系 grid 中的 x 轴
              {
                  // name: '(区)',
                  type: 'category', //  坐标轴类型'category' 类目轴
                  data: dataName, // x 轴数据内容数组
                  axisLabel: { // 坐标轴刻度标签的相关设置
                    textStyle: { // 标签样式
                        // color: 'rgba(0,0,0,0.3)'
                      color: '#555555'
                    },
                    rotate: 35, // 刻度标签旋转的角度，在类目轴的类目标签显示不下的时候可以通过旋转防止标签之间重叠。
                    interval: 0 // 坐标轴刻度的显示间隔，在类目轴中有效。设置成 0 强制显示所有标签
                  },
                  axisLine: { // 坐标轴轴线相关设置
                    lineStyle: {
                      type: 'dashed', // 坐标轴线线的类型。
                      color: '#d9d9d9' // 坐标轴线线的颜色。
                    }
                  },
                  axisTick: {
                    lineStyle: {
                      type: 'dashed', // 坐标轴线线的类型。
                      color: '#d9d9d9' // 坐标轴线线的颜色。
                    }
                  }
                  
              },
          ],
          yAxis: [ // 直角坐标系 grid 中的 y 轴
              {
                  // name: '(人)',
                  type: 'value', // 坐标轴类型 'value' 数值轴
                  splitLine: { // 分隔线相关设置。
                    lineStyle: { // 分隔线线设置
                      type: 'dashed', // 分隔线线的类型
                      color: '#d9d9d9' // 分隔线线的颜色。
                    }
                  },
                  axisTick: { // 坐标轴刻度相关设置
                    show: false, // 是否显示坐标轴刻度
                    lineStyle: {
                      type: 'dashed', // 坐标轴线线的类型。
                      color: '#d9d9d9' // 坐标轴刻度线的颜色。
                    }
                  },
                  axisLine: { // 坐标轴轴线相关设置
                    show: false, // 是否显示坐标轴轴线
                    lineStyle: {
                      type: 'dashed', // 坐标轴线线的类型。
                      color: '#d9d9d9' // 坐标轴线线的颜色。
                    }
                  }
                }
          ],
          series: series,  // 系列列表
          color: this.colorList // 调色盘颜色列表
      };
      window.addEventListener("resize",function () {
        chartThree.resize();
      })
      chartThree.setOption(option, true);
    }
  }
}
</script>

<style>

</style>