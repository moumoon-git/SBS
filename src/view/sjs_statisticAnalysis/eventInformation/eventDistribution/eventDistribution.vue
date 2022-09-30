<!--
 * @Author: your name
 * @Date: 2021-08-18 15:56:30
 * @LastEditTime: 2021-08-20 10:52:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project-nanhai\src\views\modules\riskInvestigation\statisticAnalysis\eventInformation\eventDistribution\eventDistribution.vue
-->
<template>
  <div class="container">
    <filter-condition :show-button="isShowButton" :export-button-txt="exportButtonTxt" @getData="getData" @exportToExcel="exportToExcel" ref="filterCondition"></filter-condition>
    <div class="echarts-container">
      <el-row class="echarts-row">
        <!-- 图形一 -->
        <el-col :span="12" class="echarts-col echart-col-border-right echart-col-border-bottom">
          <echart-one ref="chartOne" :id="chartOne" :color-list="colorList"></echart-one>
          <div class="echarts-value">
            <el-table
              :data="caseClassStatResult"
              :header-cell-style="{background:'rgba(249,252,255,1)',color:'#black'}"
              style="width: 100%">
              <el-table-column
                show-overflow-tooltip
                prop="caseClassName"
                label="类型"
                :width="monthOrYear?80:145">
              </el-table-column>
              <el-table-column
                prop="eventCount"
                label="数量"
                :width="monthOrYear?50:85">
              </el-table-column>
              <el-table-column
                prop="eventRatio"
                label="占比"
                :width="monthOrYear?70:120">
              </el-table-column>
              <!-- 同比和环比在月、年时才显示 -->
              <el-table-column
                v-if="monthOrYear"
                prop="yearOnYear"
                label="同比"
                width="75">
              </el-table-column>
              <el-table-column
                v-if="monthOrYear"
                prop="chainComparison"
                label="环比"
                width="75">
              </el-table-column>
            </el-table>
          </div>
        </el-col>

        <!-- 图形二 -->
        <el-col :span="12" class="echarts-col echart-col-border-bottom">
          <echart-two ref="chartTwo" :id="chartTwo" :color-list="colorList"/>
          <event-tab
           :button-list="buttonList"
           @buttonClick="handleButtonTab"
          />
        </el-col>
      </el-row>

      <el-row class="echarts-row">
        <!-- 图形三 -->
        <el-col :span="12" class="echarts-col echart-col-border-right">
          <echart-three :id='chartThree' :data-list="echartThreeDataList" :color-list="colorList" ref="chartThree"></echart-three>
        </el-col>
        <el-col :span="12" class="echarts-col">
          <echart-four :id='chartFour' :data-list="echartFourDataList" :color-list="colorList" ref="chartFour"></echart-four>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import echartOne from './echarts/echartOne'
import echartTwo from './echarts/echartTwo'
import echartThree from './echarts/echartThree'
import echartFour from './echarts/echartFour'
import filterCondition from '../filterCondition'
import eventTab from './eventTab'
import {debounce} from '@/utils/common.js'
import axios from 'axios'
import echarts from 'echarts'
import Cookies from "js-cookie";
export default {
  name: 'eventDistribution',
  components: {
    echartOne,
    echartTwo,
    echartThree,
    echartFour,
    filterCondition,
    eventTab
  },
  data() {
    return {
      // echarts
      caseClassStatResult: [], // 各事件类型的统计结果
      caseClassList: [], // 事件类型列表
      areaList: [], // 区域列表
      
      echartOneDataList: [], // 饼图数据（事件类别占比）
      echartTwoDataList: [], //  柱状图数据（事件街道分布）
      echartThreeDataList: [], //  柱状图数据（受伤人数分布）
      echartFourDataList: [], //  柱状图数据（死亡人数分布）

      echartOneDataName: [], // 饼图数据（事件类别占比）
      echartTwoDataName: [], //  柱状图数据（事件街道分布）
      echartThreeDataName: [], //  柱状图数据（受伤人数分布）
      echartFourDataName: [], //  柱状图数据（死亡人数分布）
 
      chartOne: 'chartOne',  // 图形一 -> 饼图
      chartTwo: 'chartTwo',  // 图形二 -> 柱状图
      chartThree: 'chartThree',  // 图形三 -> 柱状图
      chartFour: 'chartFour',  // 图形四 -> 柱状图

      colorList: [
      '#8196FF',
      '#FF6E88', 
      '#FEBB59', 
      '#FFE658', 
      '#c23531',
      '#2f4554', 
      '#61a0a8',
      '#FFD7DB',
      '#d48265',
      '#91c7ae',
      '#749f83',  
      '#ca8622', 
      '#bda29a',
      '#6e7074', 
      '#546570', 
      '#c4ccd3'
      ], // 图形遍历的颜色
      
      // event-tab
      buttonList: [], // 事件街道分布的按钮切换
      activeButtonIndex: 0,  // 默认选中第一个事件按钮
      isShowButton: true,
      exportButtonTxt: '导出报告', // 按钮文本
      monthOrYear: false, // 当前分组方式
    }
  },
  methods: {
    /**
     * @author hexinting
     * @date 2020-12-18
     * @description 事件分布分析word报告
     */
    exportToExcel(data) {
      axios({
        method: "get",
        url: window.g.ApiUrl + '/eos/statistics/eventStatController/exportWordFromEventAnalysis',
        responseType: 'arraybuffer',
        params: data,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          token: Cookies.get('token'),
        },
      })
      .then(res => {
        var elink = document.createElement('a');
        elink.download = "事件分布分析报告.doc";
        elink.style.display = 'none';
        var blob = new Blob([res.data], {type: 'application/msword'});
        
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      }).catch(() => {})
    },
    // echartOne需要用到的数据 （事件类别占比）
    getEchartOneSeries() {
      let seriesOne = [
        {
          type: 'pie', // 饼图
          radius: '70%', // 饼图的半径
          center: ['25%', '60%'], // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标
          selectedMode: 'single', // 选中模式，表示是否支持多个选中 'single'，'multiple'，分别表示单选还是多选。
          data: this.echartOneDataList, // 系列中的数据内容数组
          emphasis: { // 高亮的扇区和标签样式
            itemStyle: { // 所有属性
              shadowBlur: 10, // 图形阴影的模糊大小
              shadowOffsetX: 0, // 阴影水平方向上的偏移距离
              shadowColor: 'rgba(0, 0, 0, 0.5)' // 阴影颜色
            }
          }
        }
      ]
      return seriesOne;
    },
    // echartTwo需要用到的数据 （事件街道分布）
    getEchartTwoSeries() {
      let seriesTwo = [
        { // For shadow
          type: 'bar', // 柱状图
          itemStyle: { // 图形样式
              color: 'rgba(0,0,0,0.01)' // 柱条的颜色
          },
          barGap: '-100%', // 不同系列的柱间距离
          barCategoryGap: '60%', // 同一系列的柱间距离
          animation: true // 是否开启动画
        },
        {
          type: 'bar', // 柱状图
          itemStyle: { // 图形样式
              color:new echarts.graphic.LinearGradient(  // 柱条的颜色 渐变色
                  0, 0, 0, 1,
                  [
                      {offset: 0, color: '#8D8FFF'},
                      {offset: 0.5, color: '#6EA0FF'},
                      {offset: 1, color: '#46B6FF'}
                  ]
              ),
              showBackground: false, // 是否显示柱条的背景色
          },
          
          backgroundStyle: { // 每一个柱条的背景样式
              borderType: 'solid' // 柱条的描边类型
          },
          label: { // 图形上的文本标签
              show: true, // 是否显示标签
              position: 'top', // 标签的位置
              color: '#0DB5FB' // 文字的颜色
          },
          emphasis: { // 高亮的图形样式和标签样式
              itemStyle: { // 所有属性
                  color: new echarts.graphic.LinearGradient( // 柱条的颜色
                      0, 0, 0, 1,
                      [
                          {offset: 0, color: '#46B6FF'},
                          {offset: 0.7, color: '#2378f7'},
                          {offset: 1, color: '#8D8FFF'}
                      ]
                  )
              }
          },
          data: this.echartTwoDataList // 系列中的数据内容数组
        }
      ]
      return seriesTwo;
    },
    // echartThree需要用到的数据 （受伤人数占比）
    getEchartThreeSeries(seriesThree) {
      return seriesThree;
    },
    // echartFour需要用到的数据 （死亡人数占比）
    getEchartFourSeries(seriesFour) {
      return seriesFour;
    },
    
    // 事件街道分布 -> 事件切换
    handleButtonTab(index) {
      this.echartTwoDataList = [];
      this.activeButtonIndex = index;
      this.echartTwoDataList = this.caseClassStatResult[index].areaStatResultTotal;
      setTimeout(() => {
        let seriesTwo = this.getEchartTwoSeries();
        this.$refs.chartTwo.drawLine(this.echartTwoDataName, this.echartTwoDataList, seriesTwo);
        console.log('图二数据：', this.echartTwoDataList);
      })
    },

    /**
     * @author hexinting
     * @date 2020-12-1
     * @description 初始化数据
     */
    initData() {
      this.echartOneDataName = []; // 饼图数据（事件类别占比）
      this.echartOneDataList = []; // 饼图数据（事件类别占比）
      this.echartTwoDataName = []; //  柱状图数据（事件街道分布）
      this.echartTwoDataList = []; //  柱状图数据（事件街道分布）
      this.echartThreeDataName = []; //  柱状图数据（受伤人数分布）
      this.echartThreeDataList = []; //  柱状图数据（受伤人数分布）
      this.echartFourDataName = []; //  柱状图数据（死亡人数分布）
      this.echartFourDataList = []; //  柱状图数据（死亡人数分布）
      this.caseClassStatResult = []; // 各事件类型的统计结果
      this.caseClassList = []; // 事件类型列表
      this.areaList = [];  // 区域列表
      this.buttonList = []; // 事件街道分布的按钮切换
    },
    // areaStatResultTotal 按顺序排列的各区域事件总数 [0,2,3,...]
    // areaStatResultDeath  按顺序排列的各区域事件死亡人数总数 [0,2,3,...]
    // areaStatResultInjured  按顺序排列的各区域事件受伤人数总数 [0,2,3,...]
    /**
     * @author hexinting
     * @lastDate 2020-12-18
     * @description 获取事件分布分析数据
     */
    getData: debounce(function(data) {
      console.log('获取到的数据：', data);
      this.initData(); // 四个图表数据初始化
      let echartOneDataName = [];  // 饼图数据（事件类别占比）
      let echartOneDataList = [];  // 饼图数据（事件类别占比）
      let echartTwoDataName = [];  //  柱状图数据（事件街道分布）
      let echartTwoDataList = [];  //  柱状图数据（事件街道分布）
      let echartThreeDataName = [];  //  柱状图数据（受伤人数分布）
      let echartThreeDataList = [];  //  柱状图数据（受伤人数分布）
      let echartFourDataName = []; //  柱状图数据（死亡人数分布）
      let echartFourDataList = []; //  柱状图数据（死亡人数分布）
      let caseClassStatResult = []; // 各事件类型的统计结果
      let caseClassList = []; // 事件类型列表
      let areaList = []; // 区域列表
      let sjsEventApi = '/eos/statistics/eventStatController/sjsEventStat';
      this.isShowButton = true;
      // 当是电视上屏时，调用另一个接口
      if (this.$route.path === '/showTV') {
        this.isShowButton = false;
        sjsEventApi = '/tv/sjs/sjsEventStat';
      }
      console.log(this.$route.path, sjsEventApi)
      axios({
        method: "post",
        url: window.g.ApiUrl + sjsEventApi,
        dataType: "json",
        data: data,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          token: Cookies.get('token'),
        },
      }).then((res) => {
        console.log(res.data);
      // this.$api.sjsEventStat(data).then((res) => {
        if (res.data.errorcode === 0) {
          console.log(res.data);
          caseClassStatResult = res.data.data.caseClassStatResult; // 事件类型总结果
          caseClassList = res.data.data.topCaseClassList; // 事件列表
          areaList = res.data.data.topAreaList; // 地区列表
          console.log( areaList," areaList")
          areaList.forEach(item => {
            // 地区名称列表 ['宝安区',’静安区‘,...]
            echartTwoDataName.push(item.name);
            echartThreeDataName.push(item.name);
            echartFourDataName.push(item.name);
          })
          this.caseClassStatResult = caseClassStatResult; // 事件类型总结果
          this.caseClassList = caseClassList; // 事件列表
          this.areaList = areaList; // 地区列表
          this.buttonList = caseClassList;
          // console.log('事件类型总结果：', this.caseClassStatResult);
          // console.log('事件列表：', this.caseClassList);
          // console.log('地区列表：', this.areaList);
          this.caseClassStatResult.forEach(item => {
            // 事件名称列表 ['自然灾害类','事故灾难类',...]
            echartOneDataName.push(item.caseClassName);
            echartOneDataList.push({
              value: item.eventCount,
              name: item.caseClassName,
              ratio: item.eventRatio
            })
            echartThreeDataList.push({
                name: item.caseClassName,
                type: 'bar',
                label: { // 图形上的文本标签
                  show: true, // 是否显示标签
                  position: 'top', // 标签的位置
                  color: this.colorList, // 文字的颜色
                  formatter: function (params) { // 当为0时不显示
                    if (params.value > 0) {
                      return params.value
                    } else {
                      return ''
                    }
                  }
                },
                barWidth: 5,
                data: item.areaStatResultInjured
            })
            echartFourDataList.push({
                name: item.caseClassName,
                type: 'bar',
                label: { // 图形上的文本标签
                  show: true, // 是否显示标签
                  position: 'top', // 标签的位置
                  color: this.colorList, // 文字的颜色
                  formatter: function (params) { // 当为0时不显示
                    if (params.value > 0) {
                      return params.value
                    } else {
                      return ''
                    }
                  }
                },
                barWidth: 5,
                data: item.areaStatResultDeath
            })
            
            echartTwoDataList = this.caseClassStatResult[this.activeButtonIndex].areaStatResultTotal;

            this.echartOneDataName = echartOneDataName;
            this.echartOneDataList = echartOneDataList;
            this.echartThreeDataList = echartThreeDataList;
            this.echartFourDataList = echartFourDataList;
            this.echartTwoDataName = echartTwoDataName;
            this.echartThreeDataName = echartThreeDataName;
            this.echartFourDataName = echartFourDataName;
            this.echartTwoDataList = echartTwoDataList;

            let seriesOne = this.getEchartOneSeries();
            let seriesTwo = this.getEchartTwoSeries();
            let seriesThree = this.echartThreeDataList;
            let seriesFour = this.echartFourDataList;
            // 饼图
            this.$refs.chartOne.drawLine(this.echartOneDataName, this.echartOneDataList, seriesOne);
            this.$refs.chartTwo.drawLine(this.echartTwoDataName, this.echartTwoDataList, seriesTwo);
            this.$refs.chartThree.drawLine(this.echartThreeDataName, this.echartThreeDataList, seriesThree);
            this.$refs.chartFour.drawLine(this.echartFourDataName, this.echartFourDataList, seriesFour);

          })
        }
      })
      // 获取分组方式 0-按日 1-按周 2-按月 3-按年
      console.log(this.$refs.filterCondition.exportLog.value)
      let currentRange = ''
      currentRange = this.$refs.filterCondition.exportLog.value
      if(currentRange == 2 || currentRange == 3) {
        this.monthOrYear = true
      } else {
        this.monthOrYear = false
      }
    },1000),
  }
}
</script>

<style scope>
.container {
    margin: 20px 0px;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    background: white;
    -webkit-box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
    box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
    border-radius: 3px;
    height: calc(100vh - 190px);
  }
  
  .echarts-container {
    background:rgba(255,255,255,1);
    flex: 1;
    height: calc(100% - 80px);
  }
  .echarts-row {
    height: 50%;
  }
  .echarts-col {
    border-width: 90%;
    height: 100%;
    padding: 10px;
    position: relative;
  }
  .echart-col-border-right {
    border-right: 1px solid #F2F2F2;
  }
  .echart-col-border-left {
    border-left: 1px solid #F2F2F2;
  }
  .echart-col-border-top {
    border-top: 1px solid #F2F2F2;
  }
  .echart-col-border-bottom {
    border-bottom: 1px solid #F2F2F2;
  }
  .echarts-value {
    /* width: 170px; */
    height: calc(100% - 100px);
    box-shadow: 0 0 1px 10px rgba(249,251,255,1);
    border-radius:6px;
    position: absolute;
    right: 10px;
    top: 60px;
    overflow: scroll;
  }
</style>