<!--
 * @Author: your name
 * @Date: 2021-08-18 15:44:54
 * @LastEditTime: 2021-08-18 18:11:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project-nanhai\src\views\modules\riskInvestigation\statisticAnalysis\eventInformation\echartsColumnar.vue
-->
<template>
  <div class="echarts_container">
    <div class="separatrix"></div>
    <div :id="id" :style="{width: width, height: height}"></div>
  </div>
</template>

<script>
    import echarts from 'echarts';
    export default {
        props: ['id','width','height','colorList'],
        name: "echartsColumnar",
        mounted() {
          this.$nextTick( () =>{
            this.drawLine();
          })
        },
        methods: {
          /**
           * @param {obj} barXdata 类目数据
           * @param {obj} barSeries 系列列表。
           * @param {obj} legendData 系列列表。
           * @param {number/string/Function} maxDate  y轴坐标轴刻度最大值。
           * @lastAuthor hexinting
           * @lastDate 2020-9-21
           * @decription 绘制echarts图标
           */
          drawLine(barXdata,barSeries,legendData,maxDate) {
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById(this.id))
            // 绘制图表
            this.$nextTick(() =>{
              myChart.resize();
            });
            let option={
                title:{
                  text: '柱状图统计' // 标题组件，包含主标题和副标题。
                },
                tooltip : {
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
                grid: { // 直角坐标系内绘图网格
                  left: '3%', // grid 组件离容器左侧的距离
                  right: '4%', // grid 组件离容器右侧的距离。
                  bottom: '3%', // grid 组件离容器下侧的距离。
                  containLabel: true // grid 区域是否包含坐标轴的刻度标签。
                },
                legend: { // 图例的类型
                  right: 70, // 图例组件离容器右侧的距离
                  itemWidth: 10, // 图例标记的图形宽度
                  itemHeight: 10, // 图例标记的图形高度
                  data: legendData, // 图例的数据数组。
                  type: 'scroll', // 图例的类型 'scroll'：可滚动翻页的图例
                },
                xAxis : [
                  {
                    type : 'category', // 坐标轴类型。'category' 类目轴，适用于离散的类目数据。
                    data : barXdata, // 图例的数据数组
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
                yAxis : [
                  {
                    type : 'value', // 'value' 数值轴，适用于连续数据。
                    minInterval: 1, // 自动计算的坐标轴最小间隔大小。
                    min:0, // 坐标轴刻度最小值。
                    max:maxDate, // 坐标轴刻度最大值。
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
                series :barSeries,
                color: this.colorList // 调色盘颜色列表
            };
            window.addEventListener("resize",function () {
              myChart.resize();
            });
            myChart.setOption(option, true);
          }
        }
    }
</script>

<style scoped>
  .magine{
    margin: 0 auto;
  }
  .echarts_container {
    position: relative;
  }
  .separatrix {
    width: 3px;
    height: 19px;
    background: #0091FF;
    position: absolute;
    top: 4px;
    left: -8px
  }
</style>
