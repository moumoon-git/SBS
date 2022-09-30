<!--
 * @Author: your name
 * @Date: 2021-08-18 15:57:53
 * @LastEditTime: 2021-08-19 17:36:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project-nanhai\src\views\modules\riskInvestigation\statisticAnalysis\eventInformation\eventDistribution\echarts\echartFour.vue
-->
<template>
  <div :id="id" style="width: 100%;height:100%">
  </div>
</template>

<script>
import echarts from 'echarts';
export default {
  name: 'EchartFour',
  props: [
    'colorList',
    'dataList',
    'id'
  ],
  data() {
    return {}
  },
  mounted() {
    this.$nextTick(() =>{
      this.drawLine();
    })
  },
  methods: {
    drawLine(dataName,dataValue,series) {
      let chartFour = echarts.init(document.getElementById(this.id));
      this.$nextTick(() =>{
        chartFour.resize();
      });
      let option = {
          title: {
              text: '死亡人数分布'
          },
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
          },
          legend: {
              right: 0,
              itemWidth: 10,
              itemHeight: 10,
              data: dataValue,
              type: 'scroll',
              width: '380'
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis: [
              {
                  type: 'category',
                  data: dataName,
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
              }
          ],
          yAxis: [
              {
                  type: 'value',
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
          series: series,
          color: this.colorList
      };
      window.addEventListener("resize",function () {
        chartFour.resize();
      })
      chartFour.setOption(option, true);
    }
  }
}
</script>

<style>

</style>