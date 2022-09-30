<!--
 * @Author: your name
 * @Date: 2021-08-18 15:58:32
 * @LastEditTime: 2021-08-18 18:10:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project-nanhai\src\views\modules\riskInvestigation\statisticAnalysis\eventInformation\eventDistribution\echarts\echartTwo.vue
-->
<template>
  <div :id="id"
   style="width: 100%;height:100%">
   </div>
</template>

<script>
import echarts from 'echarts';
export default {
  name: 'EchartTwo',
  props: [
    'colorList',
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
      let chartTwo =echarts.init(document.getElementById(this.id));
      this.$nextTick(() =>{
        chartTwo.resize();
      });
      var dataAxis = dataName;
      var dataList = dataValue;

      let option = {
          title: {
              text: '事件区域分布'
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
          grid: {
            tooltip: {
              show: true
            }
          },
          xAxis: { // 直角坐标系 grid 中的 x 轴
              data: dataAxis, // x 轴数据内容数组
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
              },
              z: 10
          },
          yAxis: { // 直角坐标系 grid 中的 y 轴
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
          },
          dataZoom: [ //  用于区域缩放
              {
                  type: 'inside' // 内置在坐标系中
              }
          ],
          series: series,  // 系列列表
          color: this.colorList // 调色盘颜色列表
      };
      window.addEventListener("resize",function () {
        chartTwo.resize();
      })
        chartTwo.setOption(option, true);
    }
  }
}
</script>

<style>

</style>