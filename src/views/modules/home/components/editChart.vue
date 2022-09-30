<template>
  <div class="editChart">
    <el-dialog title="编辑" :visible.sync="editchartDialog" width="40%" v-dialogDrag>
        <div class="chartTie" style="margin-top: 20px">
          <span class="describe">图表名称:</span>
          <el-input v-model="chartTit" placeholder="请输入图表名称" class="selectInfo pintcharname"></el-input>
        </div>
        <!--颜色-->
        <div class="chartcolo" style="margin-top: 20px">
          <selectColor  :chartType='chartType' :definiteChartType='echartText ' :selectedChartColor="chartColorArr"
                       v-on:changeColor='changeColo'>

          </selectColor>
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

        <div slot="footer" class="dialog-footer">
          <el-button @click="editchartDialog = false">取消</el-button>
          <el-button @click="affirmEdit" type="primary">确定</el-button>
        </div>

    </el-dialog>
  </div>
</template>

<script>

import $ from "jquery";
import * as seleData from '../utils/dataInfor.js'
import selectColor from './selectColor'

export default {
  data() {
      return {
        editchartDialog:false,

        chartTit: '',
        chartType: '',
        echartText: '',
        chartColorArr: [],
        wChoseWhichOne: '',
        HChoseWhichOne: '',
        showDate: '',

        chartChoseW: seleData.default.chartChoseW,
        chartChoseH: seleData.default.chartChoseH,
        seleColor:[],//选择的颜色

        chartIndex: '', //echart索引

      };
    },
    components: {
      selectColor
    },
    watch: {
      editchartDialog(val) {
        if (!val) {
          this.chartTit = ''
          this.chartType = ''
          this.echartText = ''
          this.chartColorArr = []
          this.wChoseWhichOne = ''
          this.HChoseWhichOne = ''

          this.seleColor = []
        }
      }
    },

    created() {

    },
    mounted () {

    },
    methods: {
      editdialog(item,index,data){
        // console.log("编辑弹窗，子组件接收值",item,index,data)
        //弹窗
        this.$nextTick(() => {
          this.echartText = item.text
          this.chartTit = item.chartTit
          this.chartType = item.chartType
          this.chartColorArr = item.chartColor
          this.showDate = item.chartShowDate
          this.HChoseWhichOne = item.chartClass.split(" ")[0]
          this.wChoseWhichOne = item.chartClass.split(" ")[1]

          //索引
          this.chartIndex = index;
          this.editchartDialog = data
        })

      },
      changeColo(data){
        // console.log("编辑改变后的颜色",data)
        this.seleColor = data
      },
      affirmEdit(){
        this.editchartDialog = false
        //console.log("编辑确认的颜色",this.seleColor)
        this.chartColorArr = [];
        for(let i=0; i<this.seleColor.length; i++){
          this.chartColorArr.push(this.seleColor[i].colorItem)
        }
        let obj = {
          chartTit: this.chartTit,
          chartType: this.chartType,
          echartText: this.echartText,
          chartColorArr: this.chartColorArr,
          wChoseWhichOne: this.wChoseWhichOne,
          HChoseWhichOne: this.HChoseWhichOne,
          showDate: this.showDate,
        }
        //触发传递给父组件
        this.$nextTick(() => {
          this.$emit("affirmEdit",obj,this.chartIndex);
        });

      }
    }
};
</script>
<style lang="scss">
.editChart{
    display: inline-block;
    float: right;
    margin-right: 1vw;
    margin-top: 0.6vh;
    cursor: pointer;
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
</style>
