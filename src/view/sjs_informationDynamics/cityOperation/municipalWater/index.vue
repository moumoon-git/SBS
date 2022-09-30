<template>
  <div class="municipalWater">
    <el-row style="margin: 0 10px">
      <el-col :span="12" class="content_box" style="border-right: 7px #ebeef5 solid">
        <h3>供水情况</h3>
        <Tabs @handleTabsClick="supplyTabsClick"></Tabs>
        <template v-if="supplyList.length > 0">
          <div class="details_box" v-for="(item,index) in supplyList" :key="index">
            <div style="color: #0091FF;font-size:17px;line-height: 60px">{{item.date}}</div>
            <div style="display: flex; align-items: center">
              <span class="msg">计划用量:</span>
              <el-input
                style="flex: 3;margin-right: 30px"
                @keyup.native="item.plannedNum = handleNum(item.plannedNum)"
                v-model="item.plannedNum"><template slot="append">万m³</template>
              </el-input>
              <span class="msg">实际用量:</span>
              <el-input
                style="flex: 3"
                @keyup.native="item.actualNum = handleNum(item.actualNum)"
                v-model="item.actualNum"><template slot="append">万m³</template>
              </el-input>
            </div>
          </div>
        </template>
        <div class="details_box" style="margin-top: 50px">
          <div style="display: flex; align-items: center">
            <span class="msg">能力评估:</span><el-input style="flex: 3;margin-right: 30px" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model.number="supplyAssess"></el-input>
            <span class="msg">运行状态:</span>
            <el-select v-model="supplyState" style="flex: 3">
              <el-option
                v-for="item in optionsList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="btn_box">
          <Btn :type="0" @save="conditionSave"></Btn>
        </div>
      </el-col>
      <el-col :span="12" class="content_box" style="border-left: 7px #ebeef5 solid">
        <h3>排水情况</h3>
        <Tabs @handleTabsClick="outTabsClick"></Tabs>
        <template v-for="(item,index) in outList">
          <div class="details_box" :key="index">
            <div style="color: #0091FF;font-size:17px;line-height: 60px">{{item.date}}</div>
            <div style="display: flex; align-items: center">
              <span class="msg">计划用量:</span>
              <el-input
                style="flex: 3;margin-right: 30px"
                @keyup.native="item.plannedNum = handleNum(item.plannedNum)"
                v-model="item.plannedNum"><template slot="append">万m³</template>
              </el-input>
              <span class="msg">实际用量:</span>
              <el-input
                style="flex: 3"
                @keyup.native="item.actualNum = handleNum(item.actualNum)"
                v-model="item.actualNum"><template slot="append">万m³</template>
              </el-input>
            </div>
          </div>
        </template>
        <div class="details_box" style="margin-top: 50px">
          <div style="display: flex; align-items: center">
            <span class="msg">能力评估:</span><el-input style="flex: 3;margin-right: 30px" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model.number="outAssess"></el-input>
            <span class="msg">运行状态:</span>
            <el-select v-model="outState" style="flex: 3">
              <el-option
                v-for="item in optionsList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="btn_box">
          <Btn :type="1" @save="conditionSave"></Btn>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import mixin from '../mixins/mixins.js'
  import Tabs from '../components/Tabs'
  import Btn from '../components/Btn'
  export default {
    name: "municipalWater",
    components:{
      Tabs,
      Btn
    },
    mixins: [mixin],
    data(){
      return{
        supplyList: [],
        outList: [],
        supplyAssess: '',
        outAssess: '',
        optionsList: [{value: 0,label: '平稳'}, {value: 1,label: '异常'}],
        supplyState: 0,
        outState: 0
      }
    },
    created(){
      this.getCondition({type:0, day:0})  //获取当天供水
      this.getCondition({type:1, day:0})  //获取当天排水
    },
    methods: {
      // 供水tabs切换
      supplyTabsClick(val){
        this.getCondition({type: 0, day: val})
      },
      // 排水tabs切换
      outTabsClick(val){
        this.getCondition({type: 1, day: val})
      },
      // 获取供水排水数据
      getCondition(parmas){
        this.$api.listWater(parmas).then(res =>{
          if (res.errorcode !== 0){
            this.supplyList = []
            this.supplyAssess = ''
            this.supplyState = ''
            this.outList = []
            this.outAssess = ''
            this.outState = ''
            return
          }
          if (parmas.type === 0){   //供水
            this.supplyList = res.data
            this.supplyAssess = res.data[0].level
            this.supplyState = res.data[0].runningStatus
            this.date = res.data[0].date
          }
          if (parmas.type === 1){   //排水
            this.outList = res.data
            this.outAssess = res.data[0].level
            this.outState = res.data[0].runningStatus
          }
        })
      },
      // 供水排水保存
      conditionSave(val){
        //val 0是供水 1是排水
        let plannedArr = []
        let actualArr = []
        if (val === 0){
          this.supplyList.forEach(e => {
            plannedArr.push(e.plannedNum)
            actualArr.push(e.actualNum)
          })
        } else {
          this.outList.forEach(e => {
            plannedArr.push(e.plannedNum)
            actualArr.push(e.actualNum)
          })
        }
        let parmas = {
          date: this.date,
          type: val,
          planned: plannedArr,
          actual: actualArr,
          level: val === 0 ? this.supplyAssess : this.outAssess,
          status: val === 0 ? this.supplyState : this.outState,
        }
        this.$api.saveWater(parmas).then(res =>{
          if (res.errorcode !== 0){
            this.$message({
              type: 'error',
              message: res.msg
            })
            return
          }
          this.$message({
            type: 'success',
            message: '保存成功'
          })
        }).catch(err => this.$message({type: 'error',message: res.msg}))
      }
    }
  }
</script>

<style scoped>
.municipalWater .content_box{
  position: relative;
  text-align: left;
  height: 782px;;
  padding: 25px 0 28px 22px !important;
  background: #fff;
  border-radius:4px;
}
h3{
  padding: 0 0 0 38px;
  text-align: left;
  font-size:20px;
  font-weight:500;
  color:#333333;
  margin: 0 0 22px 0;
  position: relative;
}
h3:after{
  content: '';
  width: 28px;
  height: 22px;
  background: url("../../../../assets/icpImg/titleIcon.png");
  background-size: cover;
  position: absolute;
  top: 3px;
  left: 0;
}
.details_box{
  padding-right: 20px;
}
.msg{
  flex: 1;
  font-size:17px;
  font-weight:400;
  color:#555555;
}
 >>> .el-input__inner {
    text-align: center;
  }
.btn_box{
  position: absolute;
  bottom: 28px;
  right: 28px;
}
</style>
