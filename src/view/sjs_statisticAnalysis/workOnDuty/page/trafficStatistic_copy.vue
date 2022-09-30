<!--@author：yf-->
<template>
    <div>
      <div class="navsBar" style="height: 80px;padding: 0 20px">
        <el-row :gutter="gutter" style="display: flex;align-items: center;height: 80px">
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
            <div style="position: relative">
              <el-date-picker
                :picker-options="pickerOptions"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                v-if="showValue"
                v-model="value"
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
            <div style="position: relative;margin-left: 10px;">
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
        </el-row>

      </div>
      <div style="padding: 12px 20px">
        <div class="contentStyle" >
          <div style="width: 100%;padding: 20px 0;text-align: left">
            <div style="width: 180px">
              <el-switch
                :width="50"
                @change="watchData"
                style="display: block"
                v-model="answer"
                active-color="#13ce66"
                inactive-color="#409EFF"
                inactive-text="接听率"
                active-text="响应速度"
              >
              </el-switch>
            </div>

          </div>

          <div class="layout">
            <div class="selectPlace">
              <label class="export">值班员:</label>
              <el-select v-model="watch" placeholder="请选择" clearable>
                <el-option
                  v-for="item in watchOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="buttonPlace">
              <el-button type="primary" size="small" @click="generateStatistics">生成话务统计报表</el-button>
            </div>
          </div>
          <div style="width: 100%">
            <echarts-traffic ref="echartsTraffic" :id="idTwo" :width="width" :height="height"></echarts-traffic>
            <echarts-roll ref="echartsRoll" :id="idOne" :width="width" :height="height"></echarts-roll>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import {Url, daysInMonth} from '@/assets/js/common'
    import echartsTraffic from "./echartsPages/echartsTraffic"  //线形图
    import echartsRoll from "./echartsPages/echartsRoll"  //柱状图
    const downLoadFile = require('@/utils/downloadFile.js').default;
    import Cookies from "js-cookie";
    export default {
        name: "trafficStatistic",
        components:{
          echartsTraffic,
          echartsRoll
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
            height:'300px',
            idOne:'idOne',
            idTwo:'idTwo',

            exportLog:{  //选中分组
              value: '2',
              label: '按月'
            },//

            answer:false,//接听率响应速度切换

            maxDate:10,//Y轴最大值
            lineXdata:[],//折线X轴数据
            lineSeries: [], //折线echarts数据
            countMax:100,//最大数

            titleHint:'（%）',//
            legendData:['接听电话数','呼入电话数'],//title
            barXdata:[],//柱状图X轴数据
            barSeries:[],//柱状图数据

            lineTitle:'',//折线标题

            switch:0,//swift选择结果存值，0为接听率，1为接听速度

            showValue:false,//日日期是否显示
            showWekk:false, //周日期是否显示
            showMothdata:false, //月日期是否显示
            showYearstart:false,//年日期是否显示
            value:'',//日日期
            wekkValue:'',//周日期
            monthData:'',//月日期查询
            yearStart:'',//开始年
            yearEnd:'',//结束年
          }
        },
        mounted(){
          this.$nextTick(()=>{
            this.getWatcher();
            this.exportLogData();
          })
        },
        created(){
          this.getTime();
          this.inquire()
        },
        methods:{
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
            monthData.push(startDay);
            monthData.push(endDay);
            this.monthData = monthData;
          },
          generateStatistics(){//生成话务统计
            let type=this.exportLog.value
            console.log(type);
            let star,end;
            let downloadUrl,downloadWekkUrl,downloadMonthUrl,downloadYearUrl
            switch (type) {
              case "0":
                console.log('00000000000');
                if(this.value==''||this.value==null){
                  this.$message({
                    message: '请选择时间再导出',
                    type: 'warning'
                  });
                  return
                }
                star = this.value[0];
                end= this.value[1];
                const downloadUrl = {
                  method: 'get',
                  url: `/eos/statistics/eventStatController/phoneExcel?startTime=${star}&&timeEnd=${end}&&operatorId=${this.watch}&&groupType=${this.exportLog.value}`,
                  baseURL: window.g.ApiUrl,
                  headers: {
                    token: Cookies.get('token'),
                  },
                  responseType: 'arraybuffer',
                };
                downLoadFile(downloadUrl);
                break;
              case "1":
                console.log('11111111')
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
                  url: `/eos/statistics/eventStatController/phoneExcel?startTime=${star}&&timeEnd=${end}&&operatorId=${this.watch}&&groupType=${this.exportLog.value}`,
                  baseURL: window.g.ApiUrl,
                  headers: {
                    token: Cookies.get('token'),
                  },
                  responseType: 'arraybuffer',
                };
                downLoadFile(downloadWekkUrl);
                break;
              case "2":
                console.log('222222222')
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
                  url: `/eos/statistics/eventStatController/phoneExcel?startTime=${star}&&timeEnd=${end}&&operatorId=${this.watch}&&groupType=${this.exportLog.value}`,
                  baseURL: window.g.ApiUrl,
                  headers: {
                    token: Cookies.get('token'),
                  },
                  responseType: 'arraybuffer',
                };
                downLoadFile(downloadMonthUrl);
                break;
              case "3":
                console.log('3333333333')
                if(this.yearStart==''||this.yearStart==null||this.yearEnd==''||this.yearEnd==null){
                  this.$message({
                    message: '请选择时间再导出',
                    type: 'warning'
                  });
                  return
                }
                star = this.yearStart;
                end= this.yearEnd;
                const  downloadYearUrl = {
                  method: 'get',
                  url: `/eos/statistics/eventStatController/phoneExcel?startTime=${star}&&timeEnd=${end}&&operatorId=${this.watch}&&groupType=${this.exportLog.value}`,
                  baseURL: window.g.ApiUrl,
                  headers: {
                    token: Cookies.get('token'),
                  },
                  responseType: 'arraybuffer',
                };
                downLoadFile( downloadYearUrl);
                break;
              default:
                break;
            }

          },
          watchData(data){//监听switch的值
            console.log(data);
            if(data){
              this.switch=1;
              this.titleHint='（秒）';
              this.inquire();
            }else {
              this.switch=0;
              this.titleHint='（%）';
              this.inquire();
            }
          },
          getWatcher(){//获取值班人员数据
            this.watchOptions='';
            let data={};
            this.$api.operatorList(data).then((res) => {
              console.log(res.data);
              let arr=[];
              for(let i=0;i<res.data.data.length;i++){
                arr.push({
                  id:res.data.data[i].id,
                  name:res.data.data[i].displayname
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
            let types=this.exportLog.value;
            let star,end,linData,barData;
            switch (types) {
              case "0":
                if(this.value==''||this.value==null){
                  this.$message({
                    message: '请选择时间再统计',
                    type: 'warning'
                  });
                  return
                }
                star = this.value[0];
                end= this.value[1];
                linData={
                  data:{
                    startTime:star,
                    timeEnd:end,
                    operatorId:this.watch,//值班员
                    type:this.switch,//接听率
                    groupType:this.exportLog.value//分组类型
                  }
                };
                this.$api.telephoneStat(linData).then((res) => {
                  if(res.errorcode == 0){
                    // this.lineXdata=res.data.time.reverse();
                    //改为正序
                    this.lineXdata=res.data.time;
                    // this.lineSeries = res.data.count.reverse();
                    this.lineSeries = res.data.count;
                    this.countMax=parseInt((res.data.countMax)+20);
                    this.lineTitle=res.data.type
                    this.$refs.echartsTraffic.drawLine(this.lineXdata, this.lineSeries, this.titleHint,this.countMax,this.lineTitle);

                    barData={
                      startTime:star,
                      timeEnd:end,
                      operatorId:this.watch,//值班员
                      groupType:this.exportLog.value//分组类型
                    };
                    this.$api.telephoneStatCall(barData).then((res) => {
                      if(res.errorcode == 0){
                        this.barSeries=[];//清空数组
                        // this.barXdata=res.data.timeArray;
                        this.barXdata=res.data.timeArray.reverse();
                        let seriesStr,seriesEnd;
                        // seriesStr=res.data.incoming.reverse();
                        // seriesEnd=res.data.answer.reverse();
                        seriesStr=res.data.incoming;
                        seriesEnd=res.data.answer;
                        this.barSeries.push({
                          data:seriesStr,
                          type:'bar',
                          barMaxWidth:30,
                          name:'接听电话数'
                        });
                        this.barSeries.push({
                          data:seriesEnd,
                          type:'bar',
                          barMaxWidth:30,
                          name:'呼入电话数'
                        });
                        let maxNum= parseInt(res.data.countMax)
                        // let maxStr = Math.max.apply(null, seriesStr);
                        // let maxEnd = Math.max.apply(null, seriesEnd);
                        // let maxNum=100;
                        if(maxNum==0||maxNum==0){
                          maxNum+=9;
                          maxNum+=9;
                        }else {
                           maxNum+=20
                        }
                        console.log(maxNum,'柱形')
                        this.$refs.echartsRoll.drawLine(this.barXdata,this.barSeries,this.legendData,maxNum);
                      }else {
                        this.$message.error(res.msg)
                      }

                    });
                  }else {
                    this.$message.error(res.msg)
                  }
                });


                break;
              case "1":
                if(this.wekkValue==''||this.wekkValue==null){
                  this.$message({
                    message: '请选择时间再统计',
                    type: 'warning'
                  });
                  return
                }
                star = this.wekkValue[0];
                end= this.wekkValue[1];
                linData={
                  data:{
                    startTime:star,
                    timeEnd:end,
                    operatorId:this.watch,//值班员
                    type:this.switch,//接听率
                    groupType:this.exportLog.value//分组类型
                  }
                };
                this.$api.telephoneStat(linData).then((res) => {
                  if(res.errorcode == 0){
                    this.lineXdata=res.data.time;
                    // this.lineSeries = res.data.count.reverse();
                    this.lineSeries = res.data.count;
                    this.countMax=parseInt((res.data.countMax)+20);
                    this.lineTitle=res.data.type
                    this.$refs.echartsTraffic.drawLine(this.lineXdata, this.lineSeries, this.titleHint,this.countMax,this.lineTitle);

                    barData={
                      startTime:star,
                      timeEnd:end,
                      operatorId:this.watch,//值班员
                      groupType:this.exportLog.value//分组类型
                    };
                    this.$api.telephoneStatCall(barData).then((res) => {
                      if(res.errorcode == 0){
                        this.barSeries=[];//清空数组
                        this.barXdata=res.data.timeArray.reverse();
                        let seriesStr,seriesEnd;
                        seriesStr=res.data.incoming;
                        seriesEnd=res.data.answer;
                        this.barSeries.push({
                          data:seriesStr,
                          type:'bar',
                          barMaxWidth:30,
                          name:'接听电话数'
                        });
                        this.barSeries.push({
                          data:seriesEnd,
                          type:'bar',
                          barMaxWidth:30,
                          name:'呼入电话数'
                        });
                        let maxNum= parseInt(res.data.countMax)
                        // let maxStr = Math.max.apply(null, seriesStr);
                        // let maxEnd = Math.max.apply(null, seriesEnd);
                        // let maxNum=100;
                        if(maxNum==0||maxNum==0){
                          maxNum+=9;
                          maxNum+=9;
                        }else {
                          maxNum+=20
                        }
                        console.log(maxNum,'柱形')

                        this.$refs.echartsRoll.drawLine(this.barXdata,this.barSeries,this.legendData,maxNum);
                      }else {
                        this.$message.error(res.msg)
                      }

                    });
                  }else {
                    this.$message.error(res.msg)
                  }

                });

                break;
              case "2":
                if(this.monthData==''||this.monthData==null){
                  this.$message({
                    message: '请选择时间再统计',
                    type: 'warning'
                  });
                  return
                }
                star = this.monthData[0];
                end = this.monthData[1];
                linData={
                  data:{
                    startTime:star,
                    timeEnd:end,
                    operatorId:this.watch,//值班员
                    type:this.switch,//接听率
                    groupType:this.exportLog.value//分组类型
                  }
                };
                this.$api.telephoneStat(linData).then((res) => {
                  if(res.errorcode == 0){
                    this.lineXdata=res.data.time;
                    this.lineSeries = res.data.count;
                    this.countMax=parseInt((res.data.countMax)+20);
                    this.lineTitle=res.data.type
                    this.$refs.echartsTraffic.drawLine(this.lineXdata, this.lineSeries, this.titleHint,this.countMax,this.lineTitle);

                    barData={
                      startTime:star,
                      timeEnd:end,
                      operatorId:this.watch,//值班员
                      groupType:this.exportLog.value//分组类型
                    };
                    this.$api.telephoneStatCall(barData).then((res) => {
                      if(res.errorcode == 0){
                        this.barSeries=[];//清空数组
                        this.barXdata=res.data.timeArray;
                        let seriesStr,seriesEnd;
                        seriesStr=res.data.incoming;
                        seriesEnd=res.data.answer;
                        this.barSeries.push({
                          data:seriesStr,
                          type:'bar',
                          barMaxWidth:30,
                          name:'接听电话数'
                        });
                        this.barSeries.push({
                          data:seriesEnd,
                          type:'bar',
                          barMaxWidth:30,
                          name:'呼入电话数'
                        });
                        let maxNum= parseInt(res.data.countMax)
                        // let maxStr = Math.max.apply(null, seriesStr);
                        // let maxEnd = Math.max.apply(null, seriesEnd);
                        // let maxNum=100;
                        if(maxNum==0||maxNum==0){
                          maxNum+=9;
                          maxNum+=9;
                        }else {
                          maxNum+=20
                        }
                        console.log(maxNum,'柱形')
                        this.$refs.echartsRoll.drawLine(this.barXdata,this.barSeries,this.legendData,maxNum);
                      }else {
                        this.$message.error(res.msg)
                      }

                    });
                  }else {
                    this.$message.error(res.msg)
                  }

                });

                break;
              case "3":
                if(this.yearStart==''||this.yearStart==null||this.yearEnd==''||this.yearEnd==null){
                  this.$message({
                    message: '请选择时间再统计',
                    type: 'warning'
                  });
                  return
                }
                star = this.yearStart;
                end= this.yearEnd;
                if(star>end){
                  this.$message({
                    message: '结束年必须比开始年小',
                    type: 'warning'
                  });
                  return
                }
                linData={
                  data:{
                    startTime:star,
                    timeEnd:end,
                    operatorId:this.watch,//值班员
                    type:this.switch,//接听率
                    groupType:this.exportLog.value//分组类型
                  }
                };
                this.$api.telephoneStat(linData).then((res) => {
                  if(res.errorcode == 0){
                    this.lineXdata=res.data.time;
                    this.lineSeries = res.data.count;
                    // this.lineXdata=res.data.time.reverse();
                    // this.lineSeries = res.data.count.reverse();
                    this.countMax=parseInt((res.data.countMax)+20);
                    this.lineTitle=res.data.type
                    this.$refs.echartsTraffic.drawLine(this.lineXdata, this.lineSeries, this.titleHint,this.countMax, this.lineTitle);
                    barData={
                      startTime:star,
                      timeEnd:end,
                      operatorId:this.watch,//值班员
                      groupType:this.exportLog.value//分组类型
                    };
                    this.$api.telephoneStatCall(barData).then((res) => {
                      if(res.errorcode == 0){
                        this.barSeries=[];//清空数组
                        // this.barXdata=res.data.timeArray.reverse();
                        this.barXdata=res.data.timeArray;
                        let seriesStr,seriesEnd;
                        // seriesStr=res.data.incoming.reverse();
                        // seriesEnd=res.data.answer.reverse();
                        seriesStr=res.data.incoming;
                        seriesEnd=res.data.answer;
                        this.barSeries.push({
                          data:seriesStr,
                          type:'bar',
                          barMaxWidth:30,
                          name:'接听电话数'
                        });
                        this.barSeries.push({
                          data:seriesEnd,
                          type:'bar',
                          barMaxWidth:30,
                          name:'呼入电话数'
                        });
                        console.log(seriesStr, seriesEnd);
                        let maxNum= parseInt(res.data.countMax)
                        // let maxStr = Math.max.apply(null, seriesStr);
                        // let maxEnd = Math.max.apply(null, seriesEnd);
                        // let maxNum=100;
                        if(maxNum==0||maxNum==0){
                          maxNum+=9;
                          maxNum+=9;
                        }else {
                          maxNum+=20
                        }
                        this.$refs.echartsRoll.drawLine(this.barXdata,this.barSeries,this.legendData,maxNum);
                      }else {
                        this.$message.error(res.msg)
                      }

                    });
                  }else {
                    this.$message.error(res.msg)
                  }

                });

                break;
              default:
                break;
            }
          },

        }
    }
</script>

<style scoped>
  .navsBar {
    margin: 0 30px;
    background-color: white;
    box-sizing: border-box;
    border:1px solid rgba(219, 219, 219, 1);
    border-radius:3px;
  }
  .export{
    background-color: #F5F7FA;
    color: #909399;
    vertical-align: middle;
    height: 40px;
    line-height: 40px;
    display: inline-block;
    box-sizing: border-box;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    padding: 0 10px;
    white-space: nowrap;
    font-size: 14px;
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
    margin: 0 10px 0 10px;
    padding: 0 20px;
    background-color: white;
    box-sizing: border-box;
    border:1px solid rgba(219, 219, 219, 1);
    border-radius:3px;

  }
  .layout{
    display: flex;
    height: 50px;
    line-height: 50px;
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
  }
</style>
