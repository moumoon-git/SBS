<template>
<div class="navMenu">
  <!--<el-button type="primary" plain >添加</el-button>-->
  <el-dialog title="添加图表"  :visible.sync="dialogTableVisible" width="40%">
    <div class="choseWhichOneChart">
      <span class="describe">选择接口:</span>
      <el-select  style="width: 50%" v-model="choseCWhichOne" placeholder="请选择接口" class="selectInfo" @change='seleChart'>
        <el-option  v-for="Choseitem in apiChoseCharts" :key="Choseitem.id" :label="Choseitem.name" :value="Choseitem.id">
        </el-option>
      </el-select>
     <!-- <span class="notice">(选择的图表仅供参考，不代表真实数据)</span>-->
      <div class="showCharts">
        <img v-for='(whichOneChartsItem,whichOneChartsIndex) in imgArr'
             :key="'imgArr' + whichOneChartsIndex"
             :src=whichOneChartsItem.imgSrc
             :class="{ clickChart:whichOneChartsIndex === clickChart}"
          @click="clickChoseChart(whichOneChartsItem,whichOneChartsIndex)" />
      </div>
    </div>
    <div class="chartTie" style="margin-top: 20px">
      <span class="describe">图表名称:</span>
      <el-input style="width: 50%" v-model="chartTie" placeholder="请输入图表名称" class="selectInfo pintcharname"></el-input>
    </div>
    <!--颜色-->
    <div class="chartcolo" style="margin-top: 20px">
      <selectColor :chartType='chartType' :definiteChartType='selectChartType' :selectedChartColor="chartColorArr"
                   v-on:changeColor='changeColo'></selectColor>
    </div>

    <div class="chartChoseHW" style="margin-top: 20px">
      <span class="describe">图表宽度:</span>
      <el-select v-model="wChoseWhichOne" placeholder="请选择宽度" class="selectInfo">
        <el-option v-for="wItem in chartChoseW" :key="wItem.value" :label="wItem.label" :value="wItem.value">
          <span style="float: left">{{ wItem.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ wItem.value }}</span>
        </el-option>
      </el-select>
    </div>

    <div class="chartChoseHW" style="margin-top: 20px">
      <span class="describe">图表高度:</span>
      <el-select v-model="HChoseWhichOne" placeholder="请选择高度" class="selectInfo">
        <el-option v-for="HItem in chartChoseH" :key="HItem.value" :label="HItem.label" :value="HItem.value">
          <span style="float: left">{{ HItem.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ HItem.value }}</span>
        </el-option>
      </el-select>
    </div>

    <div class="chartChoseHW" style="margin-top: 20px">
      <span class="describe">日期插件:</span>
      <el-radio-group v-model="showDate" style="margin-left: 40px;">
        <el-radio label="1">显示</el-radio>
        <el-radio label="0">不显示</el-radio>
      </el-radio-group>
    </div>

    <!--<el-button type="text">高级选项</el-button>-->
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogTableVisible = false">取消</el-button>
      <el-button @click="getChartInfo" type="primary">确定</el-button>
    </div>

  </el-dialog>
</div>
</template>
<script>

import * as seleData from '../utils/dataInfor.js'
import selectColor from './selectColor'
import {
  mapState
} from 'vuex'
export default {
  data() {
    return {
      isCollapse: true,
      addNum:-1,
      dialogTableVisible: false,
      clickChart: -1,
      choseCharts: seleData.default.choseCharts,
      apiChoseCharts: [],
      apiChoseChartsItem: '',
      choseCWhichOne: '', //选择图表,保存apiId，以后有用
      chartType: '', //图表类型
      selectChartType: '', //详细图表
      chartTie: '', //图表名称
      imgArr: [],
      chartChoseW: seleData.default.chartChoseW,
      wChoseWhichOne: '', //选择的宽度
      chartChoseH: seleData.default.chartChoseH,
      HChoseWhichOne: '', //选择的高度
      seleColor:[],//选择的颜色
      colorArr:[],//颜色重新填充
      showDate: '', //是否显示日期
      chartColorArr:[], //为了兼容而已
    };
  },
  watch: {
    dialogTableVisible(val) {
      if (!val) {
        this.choseCWhichOne = ''
        this.chartType = ''
        this.selectChartType = ''
        this.imgArr = []
        this.wChoseWhichOne = ''
        this.HChoseWhichOne = ''
        this.clickChart = -1
        this.chartTie = ''
      }
    }
  },
  created() {

  },
  computed: {
    ...mapState({
      delText: 'delText'
    })
  },
  methods: {
    init(submenuLeftId,sourceFlag){
      // console.log("最终拿到的值",submenuLeftId,sourceFlag)
      this.dialogTableVisible = true;
      //通过资源模块，与资源指标找到api
      this.getlistBySourceIdAndSourceFlag(submenuLeftId,sourceFlag)

    },

    //通过资源模块，与资源指标找到api
    getlistBySourceIdAndSourceFlag(submenuLeftId,sourceFlag){
      this.$http({
        //url: this.$http.adornUrl("/sys/menu/asideNav"),
        url: this.$http.adornUrl("/analysis/analysisApi/getlistBySourceIdAndSourceFlag"),
        method: "get",
        params: this.$http.adornParams(
          {
            sourceId: submenuLeftId,
            sourceFlag: sourceFlag
          }
        )
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log("通过资源模块与资源指标找到api",data)
          this.apiChoseCharts = data.data;
        } else {
          this.$message.error(data.msg)
        }

      })

    },
    //选择图表
    seleChart(params) {
      // console.log("选择params",params)
      this.imgArr = []
      this.apiChoseChartsItem = ''
      this.apiChoseCharts.forEach((item,index)=>{
        if(item.id === this.choseCWhichOne){
          //赋值
          // console.log("赋值赋值赋值赋值赋值",item)
          this.chartTie = item.name;
          this.apiChoseChartsItem = item;
        }
      })
      for (var i = 0; i < this.choseCharts.length; i++) {
        if (this.choseCharts[i].id == this.apiChoseChartsItem.echartType) {
          this.chartType = this.choseCharts[i].value;
          this.imgArr =  this.choseCharts[i].chartType;
        }
      }
      //console.log("选择到的图片", this.imgArr)
      this.clickChart = -1
      this.selectChartType = ''

    },
    clickChoseChart(params, index) {
      // console.log("点击选择echart",params)
      this.selectChartType = params.type
      this.clickChart = index
    },
    changeColo(data){
      this.seleColor = data
    },

    //获取数据
    getSelectEchart: function () {
      // console.log("获取到数据",this.apiChoseChartsItem)
      if(this.apiChoseChartsItem != null && this.apiChoseChartsItem != ''){
        //请求链接
        var url = this.apiChoseChartsItem.url
        //请求参数
        var params = this.apiChoseChartsItem.params
        //请求方式
        var requestWay = this.apiChoseChartsItem.requestWay
        var result = eval('(' + params + ')')

        //let result = JSON.(params);
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(url),
            method: 'get',
            ansyc: false,
            params: this.$http.adornParams(
              result
            )
          }).then(({data}) => {
            // 成功返回
            resolve({data})

          }).catch(error => {
            // 失败返回
            resolve({error})
          })
        })
      }else{
        this.$message.error('请检查网络是否畅通');
      }

    },

    async getChartInfo() {
      var seriesData = [] ,doubleArr =[]
      if (this.choseCWhichOne === '' || this.selectChartType === '' || this.wChoseWhichOne === '' || this.HChoseWhichOne === '' || this.chartTie === '' || this.seleColor.length === 0) {
        this.$message.error('请检查是否有未选或未填项');
        return
      }
      for(var i=0;i<this.seleColor.length;i++){
        this.colorArr.push(this.seleColor[i].colorItem)
      }

      //获取添加增加的值，并添加
      let resultArray = await this.getSelectEchart();

      // console.log("获取添加增加的值",resultArray)

      if (resultArray != null && resultArray.data.code === 0) {

        //console.log("获取添加增加的值，并添加的索引值",document.querySelector('.moveBox').children.length)
        this.addNum = document.querySelector('.moveBox').children.length + new Date().getTime()

        if(this.selectChartType === 'doubleLine'){
          for(var j=0;j<resultArray.data.data.seriesData.length;j++){
            for(var x=0;x<this.colorArr.length;x++){
              if(j === x){
                doubleArr.push({data:resultArray.data.data.seriesData[j].data,color:this.colorArr[x]})
              }
            }
          }
          seriesData = doubleArr
        }else{
          seriesData = resultArray.data.data.seriesData
        }

        // console.log('获取添加增加的值，并添加x======y', resultArray.data.data.xData,seriesData)

        var inserInfo = {
          apiId: this.choseCWhichOne,
          chartClass: this.HChoseWhichOne + ' ' + this.wChoseWhichOne + ' ' + 'chartMain' + this.addNum,
          //chartClass: this.HChoseWhichOne + ' ' + this.wChoseWhichOne + ' ' + 'chartMain' + 10,
          text: this.addNum,
          //text: 10,
          //chartType: this.choseCWhichOne,
          chartType: this.chartType,
          chartDetailType: this.selectChartType,
          chartTit: this.chartTie,
          chartMainClass: '.chartMain' + this.addNum,
          //chartMainClass: '.chartMain' + 10,
          chartColor: this.colorArr,
          chartShowDate: this.showDate,
          xData: resultArray.data.data.xData,
          seriesData: seriesData
        }
        this.$nextTick(() => {
          // console.log("添加到成功后",inserInfo)
          this.$emit('addEchart', inserInfo)
          this.dialogTableVisible = false
          this.colorArr = []
          this.$message({
            message: '添加成功',
            type: 'success'
          });
          //this.$store.dispatch('PUSH_DEL_WHICH_ONE', -1)
        })
      }
    }
  },
  components: {
      selectColor
    },
};
</script>
<style lang="scss">
.navMenu {
    display: inline-block;
    margin-left: 1vw;
    margin-right: 2vw;
}
.el-dialog__header {
    text-align: left;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 100%;
    min-height: 400px;
}
.chartChoseHW,
.chartTie,
.chartcolo,
.choseWhichOneChart,
.editName {
    text-align: left;
    margin-bottom: 1vh;
    .describe {
        padding-left: 3vw;
    }
    .selectInfo {
        margin-left: 2vw;
    }
    .coloTit{
      margin-right: 2vw;
    }
    .selectcolor{
      display:inline-block;
      margin-right:1vw;
    }
    .notice {
        font-size: 1.8vh;
        color: #aaa;
        padding-left: 1vw;
    }
    .pintcharname{
      width:15vw;
    }
}
.showCharts {
    width: 100%;
    margin-bottom: 3vh;
    margin-top: 3vh;
    margin-left: 10vw;
    img {
        height: 20vh;
        margin-left: 1vw;
        display: inline-block;
        cursor: pointer;
        border: 1px solid #fff;
    }
    .clickChart {
        border: 1px solid #b3d8ff;
    }
}
</style>
