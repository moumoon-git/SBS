<!--
  @author：yf
  @lastEditor: hexinting 
  @lastEditTime: 2020-9-20 
  @description: 统计分析-值班统计分析-传真统计（优化版）。
-->
<template>
  <div>
     <div class="operation_bar">
      <div class="operation_bar_left_item">
        <!-- 值班员 -->
        <div class="selectPlace">
          <label class="export">值班员</label>
          <el-select v-model="watch" placeholder="请选择" clearable>
            <el-option
              v-for="item in watchOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="operation_bar_right_item">
        <!-- 分组方式 -->
        <template>
          <label class="export">分组方式</label>
          <el-select v-model="exportLog" placeholder="请选择"  @change="exportLogData" class="common_style" style="width:114px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item">
            </el-option>
          </el-select>
        </template>

        <!-- 分组方式：月，年，周 -->
        <!-- 按选择分组方式显示日期选择组件-->
        <div class="date_select">
          <!-- 日-->
          <el-date-picker
            :picker-options="pickerOptions"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-show="showValue"
            v-model="value"
            :clearable="false"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <!-- 周-->
           <el-date-picker
            :picker-options="pickerOptions"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-show="showWekk"
            :clearable="false"
            v-model="wekkValue"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <!--月-->
          <el-date-picker
            format="yyyy-MM"
            value-format="yyyy-MM"
            type="monthrange"
            v-show="showMothdata"
            :clearable="false"
            v-model="monthData"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份">
          </el-date-picker>
          <!--年-->
          <template>
            <el-date-picker
              v-show="showYearstart"
              v-model="yearStart"
              :clearable="false"
              type="year"
              format="yyyy"
              value-format="yyyy"
              placeholder="开始年"
            >
            </el-date-picker>
            <span  v-show="showYearstart">&nbsp;至&nbsp;</span>
            <el-date-picker
              v-show="showYearstart"
              v-model="yearEnd"
              type="year"
              :clearable="false"
              format="yyyy"
              value-format="yyyy"
              placeholder="结束年"
            >
            </el-date-picker>
          </template>
        </div>
        <!-- 统计 -->
        <el-button type="primary" @click="inquire()">统计</el-button>
        <!-- 生成话务统计报表 -->
        <el-button type="primary" @click="faxExels">生成传真统计报表</el-button>
      </div>
    </div>
    <div class="contentStyle" >
      <fax-line
        ref="faxLine"
        :id="idTwo"
        :width="width"
        :height="height"
        :color-list="colorList"
        class="faxLine">
      </fax-line>
      <fax-bar
        ref="faxBar"
        :id="idOne"
        :width="width"
        :height="height"
        :color-list="colorList"
        class="faxBar">
      </fax-bar>
    </div>
  </div>
</template>

<script>
    import faxLine from "./echartsPages/faxLine"
    import faxBar from "./echartsPages/faxBar"
    import {Url, ColorList, daysInMonth} from '@/assets/js/common'
    const downLoadFile = require('@/utils/downloadFile.js').default;
    import Cookies from "js-cookie";
    export default {
        name: "faxStatistics",
        components:{
          faxLine,
          faxBar
        },
        data(){
          return{
            HWICP_Version: window.g.HWICP_Version,//优士康暂无值班人员选择
            pickerOptions: {
              onPick: ({ maxDate, minDate }) => {
                this.pickerMinDate = minDate.getTime();
                if (maxDate) {
                  this.pickerMinDate = '';
                }
              },
              disabledDate:(time)=> {
                if (this.pickerMinDate !== '') {
                  let one = 30 * 24 * 3600 * 1000
                  let minTime = this.pickerMinDate - one
                  let maxTime = this.pickerMinDate + one
                  if(maxTime > new Date()){
                    maxTime = new Date();
                  }
                  return time.getTime() < minTime || time.getTime() > maxTime
                }
                return time.getTime() > Date.now();
              },
            },
            gutter:20,
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
            ],//分组方式数据
            watch:'',//值班员
            watchOptions: '',//值班员数据
            width:'100%',
            height:'330px',
            idOne:'idOne',
            idTwo:'idTwo',

            exportLog:{  //选中分组
              value: '2',
              label: '按月'
            },//

            answer:true,//接听率响应速度切换

            maxDate:10,//Y轴最大值
            lineXdata:[],//折线X轴数据
            lineSeries: [], //折线echarts数据
            countMax:100,//最大数

            barXdata:[],//柱状图X轴数据
            barSeries:[],//柱状图数据
            legendData:'',//title数据

            showValue:false,//日日期是否显示
            showWekk:false, //周日期是否显示
            showMothdata:false, //月日期是否显示
            showYearstart:false,//年日期是否显示
            value:'',//日日期
            wekkValue:'',//周日期
            monthData:'',//月日期查询
            yearStart:'',//开始年
            yearEnd:'',//结束年
            colorList: ColorList // 图形遍历的颜色
          }
        },
        mounted(){
          this.$nextTick(()=>{
            this.getWatcher();
            this.exportLogData();
            this.inquire();
          })
        },
        created(){
          this.getTime();
        },
        methods:{
          faxExels(){//导出统计表格
            let type=this.exportLog.value
            console.log(type);
            let star,end;
            // let downloadUrl,downloadWekkUrl,downloadMonthUrl,downloadYearUrl
            switch (type) {
              case "0":
                if(this.value==''||this.value==null){
                  this.$message({
                    message: '请选择时间再导出',
                    type: 'warning'
                  });
                  return
                }
                star = this.value[0];
                end= this.value[1];
                const request = {
                  method: 'get',
                  url: `/eos/statistics/eventStatController/faxExcel?startTime=${star}&&timeEnd=${end}&&operatorId=${this.watch}&&groupType=${this.exportLog.value}`,
                  baseURL: window.g.ApiUrl,
                  headers: {
                    token: Cookies.get('token'),
                  },
                  responseType: 'arraybuffer',
                };
                downLoadFile(request);
                break;
              case "1":
                if(this.wekkValue==''||this.wekkValue==null){
                  this.$message({
                    message: '请选择时间再导出',
                    type: 'warning'
                  });
                  return
                }
                star = this.wekkValue[0];
                end= this.wekkValue[1];

                const downloadWekkUrl = {
                  method: 'get',
                  url: `/eos/statistics/eventStatController/faxExcel?startTime=${star}&&timeEnd=${end}&&operatorId=${this.watch}&&groupType=${this.exportLog.value}`,
                  baseURL: window.g.ApiUrl,
                  headers: {
                    token: Cookies.get('token'),
                  },
                  responseType: 'arraybuffer',
                };
                downLoadFile(downloadWekkUrl);

                break;
              case "2":
                if(this.monthData==''||this.monthData==null){
                  this.$message({
                    message: '请选择时间再导出',
                    type: 'warning'
                  });
                  return
                }
                star = this.monthData[0];
                end = this.monthData[1];
                const downloadMonthUrl = {
                  method: 'get',
                  url: `/eos/statistics/eventStatController/faxExcel?startTime=${star}&&timeEnd=${end}&&operatorId=${this.watch}&&groupType=${this.exportLog.value}`,
                  baseURL: window.g.ApiUrl,
                  headers: {
                    token: Cookies.get('token'),
                  },
                  responseType: 'arraybuffer',
                };
                downLoadFile(downloadMonthUrl);

                break;
              case "3":
                if(this.yearStart==''||this.yearStart==null||this.yearEnd==''||this.yearEnd==null){
                  this.$message({
                    message: '请选择时间再导出',
                    type: 'warning'
                  });
                  return
                }
                star = this.yearStart;
                end= this.yearEnd;
                const downloadYearUrl = {
                  method: 'get',
                  url: `/eos/statistics/eventStatController/faxExcel?startTime=${star}&&timeEnd=${end}&&operatorId=${this.watch}&&groupType=${this.exportLog.value}`,
                  baseURL: window.g.ApiUrl,
                  headers: {
                    token: Cookies.get('token'),
                  },
                  responseType: 'arraybuffer',
                };
                downLoadFile(downloadYearUrl);
                break;
              default:
                break;
            }
          },
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
          getWatcher(){//获取值班人员数据
            this.watchOptions='';
            let data={};
            this.$api.operatorList(data).then((res) => {
              let arr=[];
              for(let i=0;i<res.data.data.length;i++){
                arr.push({
                  id:res.data.data[i].userId,
                  name:res.data.data[i].name
                })
              }
              this.watchOptions=arr;
            });
          },
          exportLogData() { //监听分组方式日期选择
            let type=this.exportLog.value
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
          inquire(){ //提交查询
            this.lineXdata=[];//清空echarts数据
            this.lineSeries=[];
            this.barXdata=[];
            this.barSeries=[];
            let types=this.exportLog.value;
            let star,end,linData;
            switch (types) {
              case "0":
                star = this.value[0];
                end= this.value[1];
                break;
              case "1":
                star = this.wekkValue[0];
                end= this.wekkValue[1];
                break;
              case "2":
                star = this.monthData[0];
                end = this.monthData[1];
                break;
              case "3":
                star = this.yearStart;
                end= this.yearEnd;
                if(star>end){
                  this.$message({
                    message: '结束年必须比开始年小',
                    type: 'warning'
                  });
                  return
                }
                break;
              default:
                break;
            }
            linData={
              data:{
                startTime:star,
                timeEnd:end,
                operatorId:this.watch,//值班员
                groupType:this.exportLog.value//分组类型
              }
            };

            this.$api.faxStat(linData).then((res) => {
              if(res.errorcode==0){
                this.lineXdata=res.data.time;//折线
                this.lineSeries=res.data.countMax;//折线
                let maxNum = Math.max.apply(null,this.lineSeries);
                maxNum = (maxNum*2);
                // this.legendData=res.data.name[0];
                this.legendData=res.data.name;
                console.log(this.legendData);

                this.barXdata=res.data.time;
                this.barSeries.push({
                  name:'接收',
                  data:res.data.count.reception,
                  type:'bar',
                });
                this.barSeries.push({
                  name:'发送',
                  data:res.data.count.send,
                  type:'bar',
                });

                let barNum=(res.data.max)*2;
                console.log(res.data.max);
                this.$refs.faxLine.drawLine( this.lineXdata,this.lineSeries,maxNum);
                this.$refs.faxBar.drawLine(this.barXdata,this.barSeries, this.legendData,barNum);
              }
            });


          },
        }
    }
</script>

<style scoped>
  .operation_bar {
    min-width: 1420px;
    /* padding: 0 15px; */
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .operation_bar_left_item {
    width:482px;
    display:flex;
  }
  .operation_bar_right_item {
    display:flex;
    justify-content: flex-end;
  }
  .navsBar {
    margin: 0 30px;
    background-color: white;
    box-sizing: border-box;
    border:1px solid rgba(219, 219, 219, 1);
    border-radius:3px;
  }
  .export{
    color: #333333;
    vertical-align: middle;
    height: 40px;
    line-height: 40px;
    display: inline-block;
    box-sizing: border-box;
    white-space: nowrap;
    font-size: 17px;
    /* margin-right:15px; */
  }
  .area{
    text-align: left;
  }
  .type{
    text-align: right;
  }
  .areaName{
    font-size:14px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(162,162,162,1);
  }
  .contentStyle {
    /* padding: 15px; */
    padding: 15px 0px;
  }
  .layout{
    display: flex;
  }
  .selectPlace{
    flex: 1;
    width: 100%;
    text-align: left;
  }
  .buttonPlace{
    flex: 1;
    width: 100%;
    text-align: right;
    height: 80px;
    line-height: 80px;
  }
  .faxLine {
    margin-bottom: 14px;
  }
  .faxLine,
  .faxBar{
    background: #ffffff;
    border-radius: 4px;
    padding: 20px 20px 0 30px;
  }
  .date_select {
    margin: 0 10px;
  }
  .common_style {
    margin-left: 10px;
  }
</style>
