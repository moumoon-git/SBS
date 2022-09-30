<template>
    <el-dialog class="scheduleStatisticsDialog"
        title="值班数据统计" style=""
        :visible.sync="dialogVisible"
        width="45%"
        :before-close="handleClose" @close="dialogVisible=false;$parent.scheduleStatisticsDialogVisible=false;">
        
        <div style="width:100%;position:relative;overflow:auto;height:700px;">
            <!-- <div ref="Community" class="chart" :style="{height:statisticsTable.y.length*80+'px',width:'100%',overflow: 'auto'}"></div> -->
            <div ref="Community" class="chart" style="width:100%;height:100%;"></div>
        </div>
        
        
    </el-dialog>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons");
import Cookies from 'js-cookie'

export default {
  data () {
    return {
        dialogVisible:false,
        statisticsTable:{x:[],y:[]},
        chart:{},
        dataForm:{
            id:"",
            name:'',
            isHoliday:0,
            timeRange:[new Date(), new Date()],
            icon:''
        }
    }
  },
  components: {

  },
  created(){
  },
  mounted(){
    this.initChart()
    
  },
  watch:{

  },
  methods: {
    initChart(){
      var temporaryDayArray=[]
      this.$http({
        url: this.$http.adornUrl(`/duty/shift/statistics`),
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: this.$http.adornData({
          date:this.$parent.temporaryDate.substr(0,8)+'01'
        },false,'application/x-www-form-urlencoded')
      }).then(({ data }) => {
        console.log('/duty/shift/statistics',data)
        if (data && data.code === 0) {
          this.statisticsTable={y:[],x:[]}
          data.data.forEach(item=>{
            this.statisticsTable.y.push(item.name)
           
            this.statisticsTable.x.push( Number(item.hours).toFixed(2) )
            temporaryDayArray.push(Number(item.days).toFixed(2))
          })
          
          

        }else{
          this.$message({
            message: `${data.msg}`,
            type: 'error'
          })
        }
        
      })

      // console.log("this.statisticsTable",this.statisticsTable)
      setTimeout(()=>{
          if(!this.$refs.Community){
            return;
          }
          
          this.chart = echarts.init(this.$refs.Community, "macarons");
          this.chart.setOption({
          
            // title: {
            //     text: '小区维度隐患统计',
            //     left: 'center',
            //     top: 10,
            //     bottom:10,
            //     textStyle: {
            //         color: 'black'
            //     }
            // },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            // legend: {
            //     data: ['2011年', '2012年']
            // },
            grid: {
                left: '1%',
                right: '40%',
                top:'12%',

                containLabel: true
            },
            xAxis: {
                type: 'value',
                name:'值\n班\n统\n计',
                nameGap:1,
                show:false,
                max:Math.max.apply(null,this.statisticsTable.x)+10
            },
            yAxis: {
                type: 'category',
                data:  this.statisticsTable.y,
                name:'',
                nameGap:5,
                axisTick:{ //y轴刻度线
                  show:false
                },
                axisLine:{ //y轴
                  show:false
                },
                splitLine:{show: false},
                axisLabel : {
                    textStyle: {
                        fontSize:17,
                        fontfamily:'PingFangSC-Regular,PingFang SC',
                        fontWeight:400,
                        color:'rgba(153,153,153,1)'  
                    }
                }
            },
            series: [
                {
                    name: '值班时间统计',
                    type: 'bar',
                    barWidth : 20,
                    // barGap:'50%',
                    // barCateGoryGap:'50%',
                    itemStyle: {
                        normal: {
                            barBorderRadius:50,
                            color: "#5CF8FF"
                        }
                    },
                    label:{
                      normal: { 
                            show: true,
                            position: 'right',
                            fontSize:'17',
                            fontFamily:'PingFangSC-Regular,PingFang SC',
                            fontWeight:'400',
                            color:'rgba(102,102,102,1)',
                            // formatter:`{c}`
                            formatter:function(params){ 
                              console.log("motherfuck",params)
                              return params.data+'小时'+' '+`(已排班天数${temporaryDayArray[params.dataIndex]}天)`
                              
                            }
                            // textBorderColor: '#333',
                            // textBorderWidth: 2
                      }
                    },
                    
                    data: this.statisticsTable.x
                }
            ]
        })
      },500)
    },
    dateFormatter(str){//默认返回yyyy-MM-dd HH-mm-ss
        var hasTime = arguments[1] != false ? true : false;//可传第二个参数false，返回yyyy-MM-dd
        var d = new Date(str);
        var year = d.getFullYear();
        var month = (d.getMonth()+1)<10 ? '0'+(d.getMonth()+1) : (d.getMonth()+1);
        var day = d.getDate()<10 ? '0'+d.getDate() : d.getDate();
        var hour = d.getHours()<10 ? '0'+d.getHours() : d.getHours();
        var minute = d.getMinutes()<10 ? '0'+d.getMinutes() : d.getMinutes();
        var second = d.getSeconds()<10 ? '0'+d.getSeconds() : d.getSeconds();
        if(hasTime){
        return [year, month, day].join('-') + " " + [hour, minute, second].join(':');
        }else{
        return [year, month, day].join('-');
        }
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
        .then(_ => {
            // console.log("this.$parent",this.$parent)
            this.dialogVisible=false
            this.$parent.scheduleDialogAddOrUpdateVisible=false
            done();
            
        })
        .catch(_ => {});
    }
    
  }
}
</script>
<style lang="less" >

    .scheduleStatisticsDialog{
        .el-dialog{
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          margin-top:initial!important;
          min-width: 659px;
          border-radius: 10px;
          // overflow: hidden;
        }
        .el-range-separator{
            width: auto!important;
        }
        
        .el-dialog__header{
            // box-sizing: border-box!important;
            background:#409EFF!important;padding:10px!important;
            // padding-bottom: 5px!important;
            border-radius: 10px 10px 0px 0px!important;
        }

        .el-dialog__title{
            margin-left: 10px;
            color: white!important;
        }
        .el-dialog__headerbtn{
            top: initial!important;
        }
        .el-dialog__close{
            color: white!important;
           
            
        }
        .el-dialog__footer{
            border-top: 1px solid rgba(233,236,241,1);
            padding: 2vh 0px;
            text-align: initial;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
        }
        .el-form-item__content{
            margin-left: initial!important;
            display: inline-block!important;
        }
        .icon .el-form-item__content{
            display: flex!important;
        }
    }
    
</style>
