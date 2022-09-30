<template>
  <div class="householdWaste">
    <h3>生活垃圾清运转运</h3>
    <Tabs @handleTabsClick="houseTabsClick"></Tabs>
    <template v-for="item in wasteList">
      <div class="details_box" :key="item.id">
        <div style="color: #0091FF;font-size:17px;line-height: 60px">{{item.date}}</div>
        <div style="display: flex; align-items: center">
          <span class="msg">实际用量:</span>
          <el-input
            style="flex: 6;"
            @keyup.native="item.actualNum = handleNum(item.actualNum)"
            v-model="item.actualNum"><template slot="append">GJ</template>
          </el-input>
        </div>
      </div>
    </template>
    <div class="details_box" style="display:flex; align-items: center;margin-top: 60px">
      <span class="msg">运行状态:</span>
      <el-select v-model="wasteState" style="flex: 6">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="btn_box">
      <Btn @save="save"></Btn>
    </div>
  </div>
</template>

<script>
  import mixin from '../mixins/mixins.js'
  import Tabs from '../components/Tabs'
  import Btn from '../components/Btn'
  export default {
    name: "householdWaste",
    mixins: [mixin],
    components: {
      Tabs,
      Btn
    },
    data(){
      return{
        wasteList: [],
        options: [{value: 0,label: '平稳'}, {value: 1,label: '异常'}],
        wasteState: 0
      }
    },
    created(){
      this.getWasteList({day:0})
    },
    methods: {
      // tabs切换
      houseTabsClick(val){
        this.getWasteList({day:val})
      },
      // 获取生活用水
      getWasteList(parmas){
        this.$api.listGarbate(parmas).then(res =>{
          if (res.errorcode !== 0){
            this.wasteList = []
            this.wasteState = ''
            return
          }
          this.date = res.data[0].date
          this.wasteList = res.data
          this.wasteState = res.data[0].runningStatus
        })
      },
      // 保存生活用水
      save(){
        let num = []
        this.wasteList.forEach(e =>{
          num.push(e.actualNum)
        })
        let parmas ={
          date: this.date,
          num,
          status: this.wasteState
        }
        this.$api.saveGarbage(parmas).then(res =>{
          if (res.errorcode !== 0){
            this.$message({
              type:'error',
              message: res.msg
            })
          }else {
            this.$message({
              type:'success',
              message: '保存成功'
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .householdWaste{
    position: relative;
    text-align: left;
    padding: 25px 0 28px 22px;
    box-sizing: border-box;
    height: 600px;;
    background: #fff;
    border-radius:4px;
    margin: 0 10px
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
    width: 35%;
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
