<template>
  <el-main style="background-color: #fff; color: #333;text-align: center;">
    <el-container class="homePageContainer">
      <div class="home">
        <div class="linesimple">
          <draggable :options="{disabled:disabled,animation:150,ghostClass:'blue-background-class'}" class="moveBox">
            <div v-for="(linechartItem,linechartIndex) in getParentInfo" :key="'lineCharts' + linechartIndex" class='chartmain' :class=linechartItem.chartClass>
              <!--标题-->
              <div class="chartTit">
                <p>{{linechartItem.chartTit}}</p>
                <i class="el-icon-delete" :class="[disabled ? 'offDel':'onDel']" ></i>
                <i class="el-icon-edit" :class="[disabled ? 'offDel':'onDel']" @click="editChart(linechartItem,linechartIndex+1)"></i>
              </div>
              <!--时间选择-->
              <div class="chartTimeTit" v-if="linechartItem.chartShowDate !=null && linechartItem.chartShowDate === '1'">
                <el-button type="primary" @click="echartYearClick(linechartItem,linechartIndex)">年</el-button>
                <el-button type="primary" @click="echartMonthClick(linechartItem,linechartIndex)">月</el-button>
                <el-button type="primary" @click="echartDayClick(linechartItem,linechartIndex)">日</el-button>
              </div>
              <div class="chartTimeTit" v-if="(linechartItem.chartShowDate ==null || linechartItem.chartShowDate === '0') && (linechartItem.chartType != 'sheet')">
              </div>
              <!--echart-->
              <div class="charShow">

              </div>
            </div>
          </draggable>
          <!--时间插件弹窗-->
          <TimeTit ref="timeTit" v-if="timeTitDisabled" @selectTime="selectTime"></TimeTit>
        </div>
      </div>
    </el-container>
  </el-main>
</template>
<script>
  import $ from "jquery";
  import draggable from 'vuedraggable'
  import { lineChart,pieChart,barChart,sheetTool, totalRingTool,totalPanelTool} from './utils/chartview.js'
  import TimeTit from './components/TimeTit.vue';

  export default {
    data() {
      return {
        //头部模块位置
        sourceModulePositionId: 0,

        allChartInfo: '',
        lineChart: {}, //echart初始化对象
        getParentInfo: [], //父组件传来的数据
        sortArr: [], //隐性排序移动顺序
        addChartInfo: false, //数据发生改变的flag
        disabled: true, //默认不可移动
        lineChartArr: [], //折线图arr
        pieChartArr: [], //饼图arr
        barChartArr:[],//柱状图arr
        sheetToolArr:[],//表格arr
        totalRingToolArr: [], //总数圆圈arr
        totalPanelToolArr: [], //总数面板arr
        editDialog:false,//编辑弹窗
        disab:true,
        allData: [], // 构造好的数据
        showChartDisabled: true,
        saveEchartItem: [], //存储echart数组，为了排序

        timeTitItemDisabled: false, //时间插件选择
        timeTitDisabled: '' //时间插件弹窗
      }
    },
    props: ['addEcharts'],
    components: {
      draggable,
      TimeTit
    },
    computed: {

    },
    created() {

    },
    mounted() {
      this.getAllChartInfo()
    },

    methods: {
      getAllChartInfo(){
        let that = this

        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/analysis/analysisPage/infoBySourceId`),
            method: 'get',
            params: this.$http.adornParams({
              sourceId: 11 //首页
            })
          }).then(({ data }) => {
            if(data.data != null){
              let htmlJson = data.data.htmlJson;
              let htmlJsonArray = JSON.parse(htmlJson);
              this.saveEchartItem = [];
              this.saveEchartItem = htmlJsonArray;
              console.log("[2]获取anlysisPage",htmlJsonArray)
              let newHtmlJsonArray = []
              //遍历取出echart数组统计
              for(let i = 0; i<htmlJsonArray.length; i++){

                let htmlJsonItem =  htmlJsonArray[i];
                let apiId = htmlJsonItem.apiId;
                //let index = htmlJsonItem.text;

                this.$http({
                  url: this.$http.adornUrl(`/analysis/analysisApi/info`),
                  method: 'get',
                  async : false,
                  params: this.$http.adornParams({
                    id: apiId
                  })
                }).then(({data}) =>{
                  //console.log("[3]获取analysisApi",data)
                  if(data.data != null){
                    var url = data.data.url;
                    var requestWay = data.data.requestWay;
                    var params = data.data.params;
                    var result = eval('(' + params + ')')

                    //请求接口，替换xData，seriesData
                    this.$http({
                      url: this.$http.adornUrl(url),
                      method: 'get',
                      async : false,
                      params: this.$http.adornParams(
                        result
                      )
                    }).then(({data}) => {
                      if (data && data.code === 0) {
                        //console.log("[4]获取analysisApi接口数据",data.data.seriesData)
                        //替换
                        htmlJsonItem.xData = data.data.xData;
                        htmlJsonItem.seriesData = data.data.seriesData;
                        //增加到新的构造
                        newHtmlJsonArray.push(htmlJsonItem);
                        that.allData = newHtmlJsonArray
                      } else {
                        this.$message.error(data.msg)
                      }

                    })
                  }else {
                    this.$message.error(data.msg)
                  }

                })

              }

              //调用
              setTimeout(()=>{
                this.getFirCharInfo()
              },2000)

            }else{
              //数据为空
              that.allData = [];
              //数据为空
              $(".moveBox").html('');
              // this.$message.error(data.msg)
            }
          }).catch(error => {
            // 失败返回
            reject({error})
          })

        }).then(()=>{

        })

      },

      //数据展示let m=0; m<newResultArray.length; m++
      async getFirCharInfo() {
        //这个顺序不对，要比较原数组
        let newResultArray  = this.allData
        let resultArray = [];
        for(let n=0; n<this.saveEchartItem.length; n++){
          for(let m=0; m<newResultArray.length; m++){
            if(this.saveEchartItem[n].text == newResultArray[m].text){
              //保存
              resultArray.push(newResultArray[m]);
            }

          }

        }
        // console.log("[5]数据展示",resultArray)

        if (resultArray != null && resultArray.length >0) {
          resultArray.forEach((item,index)=>{
            if (item.chartType === 'line') {
              this.lineChartArr.push(item)
              this.getParentInfo.push(item)
              this.sortArr.push(item)
            }
            if (item.chartType === 'pie') {
              this.pieChartArr.push(item)
              this.getParentInfo.push(item)
              this.sortArr.push(item)
            }
            if(item.chartType === 'bar'){
              this.barChartArr.push(item)
              this.getParentInfo.push(item)
              this.sortArr.push(item)
            }
            if(item.chartType === 'sheet'){
              this.sheetToolArr.push(item)
              this.getParentInfo.push(item)
              this.sortArr.push(item)
            }
            if(item.chartType === 'totalRing'){
              this.totalRingToolArr.push(item)
              this.getParentInfo.push(item)
              this.sortArr.push(item)
            }
            if(item.chartType === 'totalPanel'){
              this.totalPanelToolArr.push(item)
              this.getParentInfo.push(item)
              this.sortArr.push(item)
            }

          })

          this.$nextTick(() => {
            this.chartView()
          })
        }else{
          //数据为空
          $(".moveBox").html('');
          return;
        }
      },




      chartView() {

        if (this.addChartInfo) {

        } else {
          //初始化数据
          lineChart(this.lineChartArr)
          pieChart(this.pieChartArr)
          barChart(this.barChartArr)
          sheetTool(this.sheetToolArr)
          totalRingTool(this.totalRingToolArr)
          totalPanelTool(this.totalPanelToolArr)

        }
      },

      //时间插件
      echartYearClick(linechartItem,linechartIndex){
        this.timeTitDisabled = true;
        this.$nextTick(() => {
          this.$refs.timeTit.init(linechartItem,linechartIndex,"year")
        });
      },
      echartMonthClick(linechartItem,linechartIndex){
        this.timeTitDisabled = true;
        this.$nextTick(() => {
          this.$refs.timeTit.init(linechartItem,linechartIndex,"month")
        });
      },
      echartDayClick(linechartItem,linechartIndex){
        this.timeTitDisabled = true;
        this.$nextTick(() => {
          this.$refs.timeTit.init(linechartItem,linechartIndex,"day")
        });
      },
      //根据条件查询
      conditionQueryChart(item,index) {

        for (let i = 0; i < this.sortArr.length; i++) {
          if (this.getParentInfo[index].text === this.sortArr[i].text) {
            //替换
            this.sortArr[i].seriesData = item.seriesData;
            this.sortArr[i].xData = item.xData;
          }
        }

        if (item.chartType === 'line') {
          for(let j=0; j<this.lineChartArr.length; j++){
            if(item.text === this.lineChartArr[j].text){
              //把原先的删除
              this.lineChartArr.splice(j, 1)
              //添加修改后的
              this.lineChartArr[j] = item
            }
          }
          lineChart(this.lineChartArr)
        }

        if (item.chartType === 'pie') {
          for(let j=0; j<this.pieChartArr.length; j++){
            if(item.text === this.pieChartArr[j].text){
              //把原先的删除
              this.pieChartArr.splice(j, 1)
              //添加修改后的
              this.pieChartArr[j] = item
            }
          }
          pieChart(this.pieChartArr)
        }

        if(item.chartType === 'bar'){
          for(let j=0; j<this.barChartArr.length; j++){
            if(item.text === this.barChartArr[j].text){
              //把原先的删除
              this.barChartArr.splice(j, 1)
              //添加修改后的
              this.barChartArr[j] = item
            }
          }
          barChart(this.barChartArr)
        }

        if(item.chartType === 'sheet'){
          for(let j=0; j<this.sheetToolArr.length; j++){
            if(item.text === this.sheetToolArr[j].text){
              //把原先的删除
              this.sheetToolArr.splice(j, 1)
              //添加修改后的
              this.sheetToolArr[j] = item
            }
          }
          sheetTool(this.sheetToolArr)
        }

        if(item.chartType === 'totalRing'){
          for(let j=0; j<this.totalRingToolArr.length; j++){
            if(item.text === this.totalRingToolArr[j].text){
              //把原先的删除
              this.totalRingToolArr.splice(j, 1)
              //添加修改后的
              this.totalRingToolArr[j] = item
            }
          }
          totalRingTool(this.totalRingToolArr)
        }

        if(item.chartType === 'totalPanel'){
          for(let j=0; j<this.totalPanelToolArr.length; j++){
            if(item.text === this.totalPanelToolArr[j].text){
              //把原先的删除
              this.totalPanelToolArr.splice(j, 1)
              //添加修改后的
              this.totalPanelToolArr[j] = item
            }
          }
          totalPanelTool(this.totalPanelToolArr)
        }


      },
      //子组件处理好时间返回给父组件
      selectTime(startTime,endTime,item,linechartIndex){
        //1、通过apiId查找接口
        let apiId = item.apiId;
        //拼接参数，通过接口查找数据
        this.$http({
          url: this.$http.adornUrl(`/analysis/analysisApi/info`),
          method: 'get',
          async : false,
          params: this.$http.adornParams({
            id: apiId
          })
        }).then(({data}) =>{
          if(data.data != null) {
            let url = data.data.url;
            let requestWay = data.data.requestWay;
            let params = data.data.params;
            let result = eval('(' + params + ')')
            result.startTime = startTime
            result.endTime = endTime
            //请求接口，替换xData，seriesData
            this.$http({
              url: this.$http.adornUrl(url),
              method: 'get',
              async: false,
              params: this.$http.adornParams(
                result
              )
            }).then(({data}) => {
              // console.log("子组件处理好时间返回给父组件处理结果", data)
              if(data.data != null){
                //数据为空
                item.xData = data.data.xData
                item.seriesData = data.data.seriesData;

              }else{
                item.xData = []
                item.seriesData = [];
                this.$message.error(data.msg)
              }
              //根据条件查询echart
              this.conditionQueryChart(item,linechartIndex);

            })

          } else {
            // this.$message.error(data.msg)
          }

        })


      }

    }
  };
</script>

<style lang="scss">

  .homePageContainer{
    margin: 40px;
  }

  .home{
    height:100%;
    width:100%;
    .funcBtn{
      height:6.5vh;
      padding-top:.5vh;
      width:100%;
      text-align: right;
    }
    .echart1Box,.echart2Box,.echart3Box{
      height:100%;
      background:#f0f;
      .chartmain{
        position:relative;
        display:inline-block;
        margin-bottom:1vh;
        border-radius: 2px 2px 2px 2px;
        box-shadow: 1px 2px 5px #ccc;
        border: 1px solid #ddd;
        //min-height:29vh;
        min-height:29vh;
        width:24vw;
        margin-right:.5vw;
      }
    }
    .echart2Box{
      background:#ff0;
    }
    .echart3Box{
      min-height:38.5vh;
      background:#0ff;
    }
    .h30{
      height:34vh !important;
    }
    .h20{
      height:24vh !important;
    }
    .h15{
      height:19vh !important;
    }
    .h40 {
      height: 45vh !important;
    }

    .w24{
      width:24vw !important;
    }
    .w49{
      width:49vw !important;
    }
    .w32{
      width:32vw !important;
    }
    .itemclass{
      background:red;
    }
  }

  .chartmain {
    position: relative;
    display: inline-block;
    margin-bottom: 1vh;
    border-radius: 2px 2px 2px 2px;
    box-shadow: 1px 2px 5px #ccc;
    border: 1px solid #ddd;
    //min-height: 29vh;
    min-height:29vh;
    width: 24vw;
    margin-right: 0.5vw;
    // padding-top:4vh;
  }
  .h30 {
    height: 34vh !important;
  }
  .h20 {
    height: 24vh !important;
  }
  .h15 {
    height: 19vh !important;
  }
  .h40 {
    height: 45vh !important;
  }

  .w24 {
    width: 24vw !important;
  }
  .w49 {
    width: 49vw !important;
  }
  .w32 {
    width: 32vw !important;
  }
  .charShow {
    //height: calc(100% - 4vh);
    height: calc(100% - 8vh);
    width: 100%;
  }
  .chartTit {
    top: 0;
    width: 100%;
    height: 4vh;
    border-bottom: 1px solid #e7e7e7;
    button{
      display: inline-block;
      height: 0.2vh;
      line-height: 0.2vh;
      background-color: #03a9f4;
    }
    p {
      display: inline-block;
      margin-top: 0.5vh;
      margin-left: 1vw;
      font-size: 2.4vh;
      color: #222222;
      font-family: FZZZHONGJW--GB1-0;
    }
    i {
      float: right;
      margin-right: 1vw;
      margin-top: 1vh;
      cursor: pointer;
    }
  }

  .chartTimeTit {
    //position: relative;
    top: 0;
    width: 100%;
    height: 4vh;
    //border-bottom: 1px solid #e7e7e7;
    button{
      display: inline-block;
      height: 0.2vh;
      line-height: 0.2vh;
      background-color: #03a9f4;
    }
    p {
      display: inline-block;
      margin-top: 0.5vh;
      margin-left: 1vw;
      font-size: 2.4vh;
      color: #222222;
      font-family: FZZZHONGJW--GB1-0;
    }
    i {
      float: right;
      margin-right: 1vw;
      margin-top: 1vh;
      cursor: pointer;
    }
  }


  .offDel {
    display: none!important;
  }

  .showSheet{
    //width: 90%;
    //height: 90%;
    margin: 0 auto;
    //margin-top: 20px;
    position: relative;
    //overflow: hidden;
    width: 100%;
    height: 100%;
    padding: 1vh 2vh 2vh 2vh; //上下，左右
    margin: 0px;
    border-width: 0px;
    cursor: default;
    overflow: auto;
  }

  .showSheet .th{
    background: #F1FADE;
    font-weight: bold;
    border-top: 1px;
    overflow-x: auto;
  }


  .showSheet ul{
    list-style:none;
    padding:0px;
    margin:0px;
    //width:590px;
    height:35px;
    line-height:35px;
    border:1px solid #99CC00;
    border-top:0px;
    font-size:12px;
    overflow-x: auto;

  }
  .showSheetBody{
    //overflow-x: auto;
  }
  .showSheet ul li{
    display:block;
    width: 16%;
    float:left;
    text-indent:2em
  }
  .showSheet .th{
    background:#F1FADE;
    font-weight:bold;
    border-top:1px
  }

  .report2{
    //background: url(../../../../assets/img/report02.png) center no-repeat;
    //text-align: center;
    //padding-top: 24px;
    margin: 0 auto;
    //margin-top: 20px;
    background: url(../../../assets/img/report02.png) center no-repeat;
    background-position: 8.3vw 2vh;
    position: relative;
    //overflow: hidden;
    text-align: center;
    width: 100%;
    height: 100%;
    //padding: 1vh 2vh 2vh 2vh; //上下，左右
    //padding: 0vh 2vh 2vh 2vh; //上下，左右
    margin: 0px;
    border-width: 0px;
    cursor: default;
    overflow: auto;

  }

  /*总数圆圈*/
  .report2 p{
    text-align: center;
    margin-top: 5.5vh;
    font-weight: bold;
    font-size: 18px;
    color: #ff0000;
  }
  .report2 small{
    text-align: center;
    font-size: 24px;
  }

  /*总数面板*/
  .t_mbox{
    margin: 0 auto;
    position: relative;
    text-align: center;
    width: 100%;
    height: 100%;
    border-width: 0px;
    cursor: default;
    overflow: auto;
  }

  .t_rbox{
    background: #D9523F;
    padding-top: 15%;
  }

  .t_mbox span{
    font-size: 22px;
    color: #fff;
  }

  .t_mbox h2{
    font-size: 24px;
    font-weight: bold;
    color: #fff;
  }


</style>
