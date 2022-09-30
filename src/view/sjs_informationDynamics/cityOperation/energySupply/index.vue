<template>
  <div class="energySupply">
    <el-row style="margin: 0 10px">
      <el-col class="content_box" :span="15" style="border-right: 14px #ebeef5 solid">
        <div style="border-bottom: 14px #ebeef5 solid;padding: 20px 0 60px 22px;position: relative">
          <div style="float: right">
            <el-button type="primary" style="margin-right: 28px" @click="addAccident">新增事故</el-button>
          </div>
          <h3>燃气运营</h3>
          <Tabs @handleTabsClick="fuelTabsClick"></Tabs>
          <div style="padding: 24px 0 14px">
            <span class="msg">运行状态:</span>
            <el-select v-model="gasState" style="flex: 3">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div style="height:188px">
            <el-scrollbar style="height: 100%">
              <template v-for="(item,index) in gasList">
                <div class="details_box" style="background: #F9FBFF;padding: 7px 14px 0" :key="index">
                  <div style="color: #0091FF;font-size:17px">燃气事故{{index + 1}}</div>
                  <div class="details_hover_box" style="display: flex; align-items: center; padding: 0 46px 14px 0; position: relative">
                    <i :class="{'el-icon-error':true,'el-icon-error-active':item.id === 0}" @click="delectAccident(index)" />
                    <span class="msg">所属街道:</span>
                    <el-input
                      style="flex: 2"
                      readonly
                      v-model="item.street">
                      <template slot="append">
                        <el-button style="padding: 12px" @click="eventScene(index)">区域</el-button>
                      </template>
                    </el-input>
                    <span class="msg mgl14">事故描述:</span><el-input class="aleft" style="flex: 6;" v-model="item.description"></el-input>
                  </div>
                </div>
              </template>
            </el-scrollbar>
          </div>
          <div class="btn_box">
            <Btn :type="0" :disabled="gasList.length > 0 ? false : true" @save="saveEnergy"></Btn>
          </div>
        </div>
        <div style="padding: 25px 0 0 22px">
          <div style="float: right; margin-right: 28px">
            <span class="msg">运行状态:</span>
            <el-select v-model="electState" style="width: 140px">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <h3>电力情况</h3>
          <Tabs @handleTabsClick="electTabsClick"></Tabs>
          <div style="display: flex; flex-wrap: wrap">
            <template v-for="(item,index) in electList">
              <div class="details_box_w" :key="index">
                <div style="color: #0091FF;font-size:17px;line-height: 40px">{{item.date}}</div>
                <div style="display: flex; align-items: center">
                  <span class="msg">实际用量:</span>
                  <el-input
                    style="flex: 4;margin-right: 30px"
                    @keyup.native="item.actualNum = handleNum(item.actualNum)"
                    v-model="item.actualNum"><template slot="append">MW</template>
                  </el-input>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="btn_box">
          <Btn :type="1" @save="saveEnergy"></Btn>
        </div>
      </el-col>
      <el-col class="content_box" style="padding: 25px 0 28px 22px" :span="9">
        <h3>供暖情况</h3>
        <Tabs @handleTabsClick="heatTabsClick"></Tabs>
        <template v-for="(item,index) in heatList">
          <div class="details_box" :key="index">
            <div style="color: #0091FF;font-size:17px;line-height: 60px">{{item.date}}</div>
            <div style="display: flex; align-items: center">
              <span class="msg">实际用量:</span>
              <el-input
                style="flex: 6;margin-right: 30px"
                @keyup.native="item.actualNum = handleNum(item.actualNum)"
                v-model="item.actualNum"><template slot="append">GJ</template>
              </el-input>
            </div>
          </div>
        </template>
        <div style="display:flex; align-items: center;margin-top: 60px">
          <span class="msg">运行状态:</span>
          <el-select v-model="heatState" style="flex: 6;margin-right: 30px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="btn_box">
          <Btn :type="2" @save="saveEnergy"></Btn>
        </div>
      </el-col>
    </el-row>

    <!--选择区域弹窗-->
    <addDialog
      @closeDialog="closeDialog"
      @confirm="confirm"
      @close="closeDialog"
      ref="eventDialog"
      :title="title"
      :addEventDialog="addEventDialog"
      @handleNodeClick="handleNodeClick"
    ></addDialog>
  </div>
</template>

<script>
  import mixin from '../mixins/mixins.js'
  import Tabs from '../components/Tabs'
  import Btn from '../components/Btn'
  import addDialog from "@/view/eventManagement/eventReports/dialog/eventDialog";
  export default {
    name: "energySupply",
    components: {
      Tabs,
      Btn,
      addDialog
    },
    mixins: [mixin],
    data(){
      return{
        title: '',
        options: [{value: 0,label: '平稳'}, {value: 1,label: '异常'}],

        // 事故
        gasList:[
          // {id: '', street: '', description: ''}
        ],
        heatList: [],
        electList: [],

        gasState: 0,
        electState: 0,
        heatState: 0,
        // 弹窗
        addEventDialog: false,
        idx: 0,
        eventTree: null,
        areaTree: null,
      }
    },
    created(){
      this.getListEnergy({day:0,type:0})    //当天燃气
      this.getListEnergy({day:0,type:1})    //当天电力
      this.getListEnergy({day:0,type:2})    //当天供暖
    },
    methods: {
      // 新增事故
      addAccident(){
        this.gasList.push({id: 0, street: '', description: ''})
      },
      // 删除事故
      delectAccident(i){
        this.gasList.splice(i,1)
      },
      // 燃气运营tabs切换
      fuelTabsClick(val){
        this.getListEnergy({day:val,type:0})    //当天燃气
      },
      // 电力情况tabs切换
      electTabsClick(val){
        this.getListEnergy({day:val,type:1})    //当天电力
      },
      // 供暖情况tabs切换
      heatTabsClick(val){
        this.getListEnergy({day:val,type:2})    //当天供暖
      },
      // 获取能源
      getListEnergy(parmas){
        this.$api.listEnergy(parmas).then(res =>{
          if (res.errorcode !== 0){
            if (parmas.type === 0){   //燃气运营
              this.gasList = []
              this.gasState = ''
            }
            if (parmas.type === 1){   //电力情况
              this.electList = []
              this.electState = ''
            }
            if (parmas.type === 2){   //供暖情况
              this.heatList = []
              this.heatState = ''
            }
            return
          }
          if (parmas.type === 0){   //燃气运营
            this.gasList = res.data
            this.gasState = res.data.length > 0 ? res.data[0].runningStatus : 0
          }
          if (parmas.type === 1){   //电力情况
            this.electList = res.data
            this.electState = res.data[0].runningStatus
          }
          if (parmas.type === 2){   //供暖情况
            this.date = res.data[0].date
            this.heatList = res.data
            this.heatState = res.data[0].runningStatus
          }
        })
      },
      // 保存能源
      saveEnergy(type){
        if (type === 0) {   //燃气
          let index = ''
          let bool = this.gasList.some((e,i) => {
            index = i
            return e.street.trim() === '' || e.description.trim() === ''
          })
          //燃气运营事故输入内容不能为空
          if (type === 0 && bool){
            this.$message({
              type: 'warning',
              message: `燃气事故${index + 1}内容不能为空,请填写完整信息!`
            })
            return
          }else {
            let gasDatas = []
            this.gasList.forEach(e => {
              gasDatas.push({
                id: e.id,
                street: e.street,
                description: e.description,
              })
            })
            let parmas = {
              data: gasDatas,
              status: this.gasState,
              date: this.date
            }
            this.$api.saveGas(parmas).then(res => {
              if (res.errorcode !== 0) {
                this.$message({
                  type: 'error',
                  message: res.msg
                })
              }else {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
              }
            })
          }

        }else {
          let actualArr = []
          if (type === 1){          //电力
            this.electList.forEach(e =>{
              actualArr.push(e.actualNum)
            })
          } else if (type === 2) {        //供暖
            this.heatList.forEach(e =>{
              actualArr.push(e.actualNum)
            })
          }
          let parmas = {
            date: this.date,
            status: type === 0 ? this.gasState : type === 1 ? this.electState : this.heatState,
            type,
            actual: actualArr,
          }
          this.$api.saveEnergy(parmas).then(res => {
            if (res.errorcode !== 0) {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }else {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            }
          })
        }
      },
      // 弹窗树 s
      handleNodeClick(data){
        this.eventTree = null
        this.eventTree = { name: data.name, id: data.id }
      },
      eventScene(index){
        this.idx = index
        //区域选择
        this.title = "选择区域"
        if (this.areaTree){
          this.$refs.eventDialog.lol(this.areaTree)
          this.addEventDialog = true
        } else {
          this.$api.topTree({}).then(res => {
            if (res.errorcode == "0") {
              this.areaTree = res.data
              this.$refs.eventDialog.lol(this.areaTree)
              this.addEventDialog = true
            }
          });
        }
      },
      closeDialog(){
        //colse关闭窗口
        this.eventTree = null
        this.addEventDialog = false
        this.$refs.eventDialog.filterText = ''
      },
      confirm(){
        if (this.eventTree){
          this.gasList[this.idx].street = this.eventTree.name
          this.addEventDialog = false
        } else {
          this.$message({
            type:'info',
            message: '请选择区域!'
          })
        }
      },
      //弹窗树end
    }
  }
</script>

<style scoped>
  .mgl14{
    margin-left: 18px;
  }
  .energySupply .content_box{
    position: relative;
    text-align: left;
    height: 782px;;
    background: #fff;
    border-radius:4px;
  }
  h3{
    width: 50%;
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
  .details_box_w{
    width: 50%;
  }
  .details_box >>> .el-icon-error{
    font-size: 24px;
    position: absolute;
    top: 8px;
    right: 12px;
    color: #0091FF;
    display: none;
    cursor: pointer;
  }
  .details_hover_box:hover >>> .el-icon-error-active{
    display: block;
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
  .aleft >>> .el-input__inner{
    text-align: left;
  }
  .btn_box{
    position: absolute;
    bottom: 16px;
    right: 28px;
  }
</style>
