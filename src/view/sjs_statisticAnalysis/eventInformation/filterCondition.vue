<!--
 * @Author: your name
 * @Date: 2021-08-18 15:54:14
 * @LastEditTime: 2021-08-19 09:34:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project-nanhai\src\views\modules\riskInvestigation\statisticAnalysis\eventInformation\filterCondition.vue
-->
<template>
  <div class="condition-wrapper">
    <div class="filter-condition">
    <!-- <el-row :gutter="gutter" style="display: flex;align-items: center;height: 80px"> -->
        <!-- <el-col :span="7" style="text-align: left"> -->
          <label class="export">分组方式:</label>
          <el-select v-model="exportLog" placeholder="请选择"  @change="exportLogData" style="margin-left: 10px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item">
            </el-option>
          </el-select>
        <!-- </el-col> -->
        <!-- <el-col :span="17" style="text-align: left;display: flex"> -->
          <!-- 按选择分组方式显示日期选择组件-->
          <!-- 日-->
          <div style="position: relative;margin-left:10px;">
            <el-date-picker
              :picker-options="pickerOptions"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-if="showValue"
              v-model="day"
              :clearable="false"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <!-- 周-->
          <div style="position: relative">
            <el-date-picker
              :picker-options="pickerOptions"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-if="showWekk"
              :clearable="false"
              v-model="wekkValue"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <!--月-->
          <div style="position: relative;">
            <el-date-picker
              format="yyyy-MM"
              value-format="yyyy-MM"
              type="monthrange"
              :clearable="false"
              v-if="showMothdata"
              v-model="monthData"
              range-separator="至"
              start-placeholder="开始月份"
              end-placeholder="结束月份">
            </el-date-picker>
          </div>
          <!--年-->
          <div style="position: relative">
            <el-date-picker
              v-if="showYearstart"
              v-model="yearStart"
              type="year"
              :clearable="false"
              format="yyyy"
              value-format="yyyy"
              placeholder="开始年"
            >
            </el-date-picker>
            <span  v-if="showYearstart">&nbsp;至&nbsp;</span>
            <el-date-picker
              v-if="showYearstart"
              v-model="yearEnd"
              type="year"
              :clearable="false"
              format="yyyy"
              value-format="yyyy"
              placeholder="结束年"
            >
            </el-date-picker>
          </div>
          <div style="margin-left: 10px">
            <el-button type="primary" size="medium" @click="inquire()">统计</el-button>
          </div>

        <!-- </el-col> -->
      <!-- </el-row> -->

    </div>
    <div v-if="showButton" class="button-group">
      <!-- <el-button type="primary" size="mini" @click="exportPdf">导出分析报告.pdf</el-button> -->
      <el-button type="primary" size="small" @click="exportDoc">{{ exportButtonTxt }}</el-button>
    </div>
  </div>
</template>

<script>
import { daysInMonth } from '@/assets/js/common.js'
export default {
  name: 'FilterCondition',
  props: {
    showButton: {
      default: false,
      type: Boolean
    },
    exportButtonTxt: {
      default: '导出分析报告.xlsx',
      type: String
    }
  },
  data() {
    return {
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.pickerMinDate = minDate.getTime();
          if (maxDate) {
            this.pickerMinDate = '';
          }
        },
        disabledDate:(time)=> {
          if (this.pickerMinDate !== '') {
            let one = 30 * 24 * 3600 * 1000;
            let minTime = this.pickerMinDate - one;
            let maxTime = this.pickerMinDate + one;
            if(maxTime > new Date()){
              maxTime = new Date();
            }
            return time.getTime() < minTime || time.getTime() > maxTime;
          }
          return time.getTime() > Date.now();
        },
      },
      gutter:24,
      width:'100%',
      height:'300px',
      idOne:'idOne',
      idTwo:'idTwo',
      maxDate:10,//Y轴最大值
      lineXdata:[],//折线X轴数据
      lineSeries: [], //折线echarts数据
      legendData:[],
      barXdata:[],//柱形X轴数据
      barSeries:[],//柱形echarts数据
      options: [
        {
          value: '0',
          label: '按日'
        },
        {
          value: '1',
          label: '按周'
        },
        {
          value: '2',
          label: '按月'
        },
        {
          value: '3',
          label: '按年'
        }
      ], //分组数据
      exportLog:{  //选中分组
        value: '2',
        label: '按月'
      },//
      showValue:false,//日日期是否显示
      showWekk:false, //周日期是否显示
      showMothdata:false, //月日期是否显示
      showYearstart:false,//年日期是否显示
      day:[],//日日期
      wekkValue:[],//周日期
      monthData:[],//月日期查询
      yearStart:[],//开始年
      yearEnd:'',//结束年

      areaSubdata:'',//区域下拉树组件数据
      eventypedata:[],//事件类型子组件数据

      buttonHide:false
    }
  },
  mounted(){
    this.$nextTick(() =>{
      this.exportLogData();
    })
  },
  created(){
    this.getTime();
    this.sendInquire();
  },
  methods: {
    /**
     * @lastEditor hexinting
     * @lastDate 2021-01-13
     * @description 获取当前月和上个月日期
     */
    getTime() {
      let date = new Date();
      let lastYear,
        lastMonth,
        startDate,
        endDate,
        year,
        month,
        startDay,
        endDay;
      year = date.getFullYear(); // 完整年
      lastYear = date.getFullYear() - 1; // 去年
      month = date.getMonth() + 1; // 当月
      // 判断当前是否为1月，为1月时，上个月为12月
      if (date.getMonth() == 0) {
        lastMonth = "12"; // 上一月
        startDate = lastYear + "-" + lastMonth; // 上个月
        startDay = startDate + "-" + "01";
      } else {
        lastMonth = date.getMonth(); // 上一月
        startDate = year + "-" + lastMonth; // 上个月
        startDay = startDate + "-" + "01";
      }
      endDate = year + '-' + month; // 当月
      endDay = endDate + '-' + daysInMonth(year, month); // 当天 daysInMonth()获取当月天数
      let monthData = [];
      monthData.push(startDate);
      monthData.push(endDate);
      this.monthData = monthData;
    },
    inquire (){ //提交查询
      // console.log(this.monthData);
      this.buttonHide=true;
      setTimeout(() => {
        this.buttonHide=false;
      },3000);
      this.sendInquire();
    },
    isLeap(year){
      return (year % 100 == 0) ? ((year % 400 == 0) ? 1 : 0) : ((year % 4 == 0) ? 1 : 0);
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-01-13
     * @description 根据日、周、月、年类型返回时间进行查询数据
     */
    sendInquire(){
      this.lineXdata=[];//清空echarts数据
      this.lineSeries=[];
      this.barXdata=[];//清空echarts数据
      this.barSeries=[];
      if(this.eventypedata==''){
        this.eventypedata=null
      }
      if(this.areaSubdata==''){
        this.areaSubdata=null
      }
      let types=this.exportLog.value;
      console.log(types)
      let star,end,data;
      switch (types) {
        case "0":
          if(this.day==''||this.day==null){
            this.$message({
              message: '请先选择时间再统计',
              type: 'warning'
            });
            return;
          }
          star = this.day[0];
          end= this.day[1];
          break;
        case "1":
          if(this.wekkValue==''||this.wekkValue==null){
            this.$message({
              message: '请先选择时间再统计',
              type: 'warning'
            });
            return;
          }
          star = this.wekkValue[0];
          end= this.wekkValue[1];
          break;
        case "2":
          if(this.monthData==''||this.monthData==null){
            this.$message({
              message: '请先选择时间再统计',
              type: 'warning'
            });
            return;
          }
          // console.log(daysInMonth(this.monthData[0].substring(0,4), this.monthData[0].substring(5)), daysInMonth(this.monthData[1].substring(0,4),this.monthData[1].substring(5)))
          
          // 禅道7431 author：hexinting date:2020-10-14
          // star = this.monthData[0] + '-' + daysInMonth(this.monthData[0].substring(0,4), this.monthData[0].substring(5));
          star = this.monthData[0] + '-' + "01";
          end = this.monthData[1] + '-' + daysInMonth(this.monthData[1].substring(0,4), this.monthData[1].substring(5));
          break;
        case "3":
          if(this.yearStart==''||this.yearStart==null || this.yearEnd==''||this.yearEnd==null){
            this.$message({
              message: '请先选择时间再统计',
              type: 'warning'
            });
            return;
          }
          star = this.yearStart + '-01-01';
          end= this.yearEnd  + '-12-31';
          if(star>end){
            this.$message({
              message: '结束年必须比开始年小',
              type: 'warning'
            });
            return;
          }
          break;
        default:
          break;
      }
      data={
        startTime:star,
        endTime:end
      };
      // 请求接口获取数据
      this.$emit('getData', data);
    },
    exportLogData() { //监听分组方式日期选择
      let type=this.exportLog.value;
      if (type=='0'){
        this.showValue = true;
        this.showWekk = false;
        this.showMothdata = false;
        this.showYearstart = false;
        return;
      }
      else if(type=='1'){
        this.showValue=false;
        this.showWekk=true;
        this.showMothdata=false;
        this.showYearstart=false;
        return;
      }
      else if(type=='2'){
        this.showValue=false;
        this.showWekk=false;
        this.showMothdata=true;
        this.showYearstart=false;
        return;
      }
      else if(type=='3'){
        this.showValue=false;
        this.showWekk=false;
        this.showMothdata=false;
        this.showYearstart=true;
        return;
      }
    },
    exportPdf() {
      this.$message({
        type:'info',
        message: '功能正在开发中'
      })
    },
    /**
     * @lastEditor hexinting
     * @date 2020-12-18
     * @description 导出文件
     */
    exportDoc() {
      let startTime = ""
      let endTime = ""
      if (this.exportLog.label == "按日" && this.day.length>0) {
        startTime = this.day[0]
        endTime = this.day[1]
      }else if (this.exportLog.label == "按周" && this.wekkValue.length>0) {
        startTime = this.wekkValue[0]
        endTime = this.wekkValue[1]
      }else if (this.exportLog.label == "按月" && this.monthData.length>0) {
        startTime = this.monthData[0] + '-' + "01";
        endTime = this.monthData[1] + '-' + daysInMonth(this.monthData[1].substring(0,4), this.monthData[1].substring(5));
      }else if (this.exportLog.label == "按年") {
        startTime = this.yearStart + '-01-01';
        endTime= this.yearEnd  + '-12-31';
      }
      this.$emit("exportToExcel",{startTime, endTime})
    }
  }
}
</script>

<style scope>
.condition-wrapper {
    margin:0 20px;
    display: flex;
    justify-content: space-between;
    height: 80px;
    align-items: center;
  }
  .filter-condition {
    display: flex;
    align-items: center;
  }
  .export{
    /* background-color: #F5F7FA; */
    color: #333333;
    vertical-align: middle;
    height: 40px;
    line-height: 40px;
    display: inline-block;
    box-sizing: border-box;
    /* border: 1px solid #DCDFE6; */
    /* border-radius: 4px; */
    /* padding: 0 10px; */
    white-space: nowrap;
    font-size: 17px;
    /* margin-right:15px; */
    font-weight: 400;
  }
  
  .button-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .button-group > button {
    margin: 5px 5px !important;
  }
</style>