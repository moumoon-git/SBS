<!--
  @author：yf 
  @lastEditor: hexinting
  @lastEditTime: 2020-9-21 
  @description: 统计分析-值班统计分析-话务统计-折线图（优化版）
-->
<template>
  <div class="echarts_container">
    <div class="separatrix"></div>
    <div :id="id" :style="{width: width, height: height}"  ></div>
  </div>
</template>

<script>
    import echarts from 'echarts'
    export default {
      props: ['id','width','height','colorList'],
      name: "echartsTraffic",
      mounted() {
        this.$nextTick( () =>{
          this.drawLine();
        })
      },
      methods: {
        /**
         * @param {obj} lineXdata 类目数据
         * @param {obj} lineSeries 系列列表。
         * @param {obj} titleHint 坐标轴名称
         * @param {obj} lineTitle 系列名称，用于tooltip的显示
         * @param {number/string/Function} countMax  y轴坐标轴刻度最大值。
         * @lastAuthor hexinting
         * @lastDate 2020-9-21
         * @decription 绘制echarts图标
         */
        drawLine(lineXdata,lineSeries,titleHint,countMax,lineTitle) {
          let myChart = echarts.init(document.getElementById(this.id));
          this.$nextTick(() =>{
            myChart.resize();
          });
          let option = {
            tooltip: { // 提示框组件。
              trigger: 'axis', // 触发类型。'axis':坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
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
              left: '3%', // grid 组件离容器左侧的距离。
              right: '4%', // grid 组件离容器右侧的距离。
              bottom: '3%', // grid 组件离容器下侧的距离。
              containLabel: true // grid 区域是否包含坐标轴的刻度标签。
            },
            legend: {
              right: 70, // 图例组件离容器右侧的距离
              top: 10, // 图例组件离容器上侧的距离
              itemWidth: 10, // 图例标记的图形宽度
              itemHeight: 10, // 图例标记的图形高度
              type: 'scroll', // 图例的类型 'scroll'：可滚动翻页的图例
            },
            title:{
              text: '话务折线图', // 标题组件，包含主标题和副标题。
              x: 'left'
            },
            xAxis: {
              type: 'category', // 坐标轴类型。'category' 类目轴，适用于离散的类目数据。
              // name: titleHint, // 坐标轴名称
              nameLocation:'start', // 坐标轴名称显示位置。
              boundaryGap: false, // 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。类目轴中 boundaryGap 可以配置为 true 和 false。默认为 true，这时候刻度只是作为分隔线，标签和数据点都会在两个刻度之间的带(band)中间。
              data: lineXdata, // 类目数据，在类目轴（type: 'category'）中有效。
              nameTextStyle:{ // 坐标轴名称的文字样式。
                color : "#19a1f7",
                fontSize : 18,
                fontFamily : "微软雅黑"
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
            yAxis: {
              type: 'value', // 'value' 数值轴，适用于连续数据。
              minInterval: 1, // 自动计算的坐标轴最小间隔大小。设置成1保证坐标轴分割刻度显示成整数。
              min:0, // 坐标轴刻度最小值。
              max:countMax, // 坐标轴刻度最大值。
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
            series:[{ // 系列列表
              name:lineTitle, // 系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
              data:lineSeries, // 系列中的数据内容数组。
              type:'line', // 折线/面积图
            }],
            color: this.colorList // 调色盘颜色列表
          };
          window.addEventListener("resize",function () {
            myChart.resize();
          })
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
    top: 25px;
    left: 18px;
  }
</style>
