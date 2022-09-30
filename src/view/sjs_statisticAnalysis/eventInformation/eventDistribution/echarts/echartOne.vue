<!--
 * @Author: your name
 * @Date: 2021-08-18 15:58:10
 * @LastEditTime: 2021-08-18 18:09:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project-nanhai\src\views\modules\riskInvestigation\statisticAnalysis\eventInformation\eventDistribution\echarts\echartOne.vue
-->
<template>
  <div :id="id" style="width: 100%;height:100%">
   </div>
</template>

<script>
import echarts from 'echarts';
export default {
  name: 'EchartOne',
  props: [
    'id',
    'colorList'
  ],
  data() {
    return {
    }
  },
  created() {
  },
  mounted() {
    this.$nextTick( () =>{
      this.drawLine();
    })
  },
  methods: {
    // 随机获取颜色
    // randomColor() {
    //   console.log('数据长度：', this.dataName.length)
    //   var color = ''
    //   for (let i = 0; i < this.dataName.length; i++) {
    //     color = 'rgb('+Math.floor(Math.random()*256)+','+Math.floor(Math.random()*256)+','+Math.floor(Math.random()*256)+')'
    //     this.colorList.push(color)
    //   }
    //   console.log('随机的颜色：', this.colorList)
    // },
    drawLine(dataName, dataList, series) {
      let chartOne = echarts.init(document.getElementById(this.id));
      this.$nextTick(() =>{
        chartOne.resize();
      });
      let option = {
        title: { // 标题组件
            text: '事件类别占比', // 主标题文本
            left: 'left' // 离容器左侧的距离
        },
        tooltip: { // 提示框组件
            trigger: 'item', // 触发类型 item: 数据项图形触发;
            // formatter: '{b} : {c} , {d}%' // 提示框浮层内容格式器
            // bug11140 事件类型中饼图与表格显示百分比不一致 author:husiyue date:2021.3.29
            formatter: function(event) {
              return event.data.name + ' : ' + event.data.value + ' , ' + event.data.ratio
            },
        },
        legend: { // 图例组件
            right: 0, // 图例组件离容器右侧的距离
            itemWidth: 10, // 图例标记的图形宽度
            itemHeight: 10, // 图例标记的图形高度
            data: dataName, // 图例的数据数组
            type: 'scroll', // 图例的类型 'scroll'：可滚动翻页的图例
            width: '380' // 图例组件的宽度
        },
        series: series, // 系列列表
        color: this.colorList // 调色盘颜色列表
      };
      window.addEventListener("resize",function () {
        chartOne.resize();
      })
        chartOne.setOption(option, true);
    }
  }
}
</script>

<style>

</style>