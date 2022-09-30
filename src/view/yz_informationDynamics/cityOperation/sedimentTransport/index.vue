<template>
  <div class="SedimentTransport">
    <el-row style="margin: 0 10px">
      <el-col class="content_box" :span="15" style="border-right: 14px #ebeef5 solid">
        <div style="border-bottom: 14px #ebeef5 solid;padding: 25px 0 100px 22px;position: relative">
          <h3>近期检查汇总</h3>
          <el-row>
            <el-col :span="12" style="margin-bottom: 32px">
              <span class="msg mgr14">时间范围:</span>
              <el-date-picker
              class="datePicker"
              v-model="dateTime"
              type="daterange"
              range-separator=" "
              value-format="yyyy-MM-dd"
              start-placeholder="请输入日期范围">
            </el-date-picker>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" style="margin-bottom: 32px">
              <span class="msg mgr14">检查车辆:</span>
              <el-input
                style="width: 350px"
                onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                v-model.number="recentData.checkCar"><template slot="append">次</template>
              </el-input>
            </el-col>
            <el-col :span="12">
              <span class="msg mgr14">违规车辆:</span>
              <el-input
                style="width: 350px"
                onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                v-model.number="recentData.checkIllegalCar"><template slot="append">辆</template>
              </el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" style="margin-bottom: 32px">
              <span class="msg mgr14">检查工地:</span>
              <el-input
                style="width: 350px"
                onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                v-model.number="recentData.checkConstruction"><template slot="append">个</template>
              </el-input>
            </el-col>
          </el-row>
          <div class="btn_box">
            <Btn :type="0" @save="saveMuck"></Btn>
          </div>
        </div>
        <div style="padding: 25px 0 0 22px">
          <h3>本月执法汇总</h3>
          <el-row>
            <el-col :span="12" style="margin-bottom: 32px">
              <span class="msg mgr14">执法次数:</span>
              <el-input
                style="width: 350px"
                onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                v-model.number="monthData.executeNum"><template slot="append">次</template>
              </el-input>
            </el-col>
            <el-col :span="12">
              <span class="msg mgr14">出动人员:</span>
              <el-input
                style="width: 350px"
                onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                v-model.number="monthData.executePeople"><template slot="append">人</template>
              </el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span class="msg mgr14">出动车辆:</span>
              <el-input
                style="width: 350px"
                onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                v-model.number="monthData.executeCar"><template slot="append">辆</template>
              </el-input>
            </el-col>
            <el-col :span="12">
              <span class="msg mgr14">查处车辆:</span>
              <el-input
                style="width: 350px"
                onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                v-model.number="monthData.executeIllegalCar"><template slot="append">辆</template>
              </el-input>
            </el-col>
          </el-row>
        </div>
        <div class="btn_box">
          <Btn :type="2" @save="saveMuck"></Btn>
        </div>
      </el-col>
      <el-col class="content_box" style="padding: 25px 0 28px 22px" :span="9">
        <h3>渣土运输情况</h3>
        <Tabs @handleTabsClick="heatTabsClick"></Tabs>
        <div style="height:588px;">
          <el-scrollbar style="height: 100%">
            <template v-for="(item,index) in muckList">
              <div class="details_box" :key="index">
                <div style="color: #0091FF;font-size:17px;line-height: 60px">{{item.date}}</div>
                <div style="display: flex">
                  <div class="mgb14" style="display: flex; align-items: center;flex: 1">
                    <span class="msg mgr14">申报车辆:</span>
                    <el-input
                      style="flex: 5;margin-right: 30px"
                      onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                      v-model.number="item.transportCar"><template slot="append">辆</template>
                    </el-input>
                  </div>
                  <div class="mgb14"  style="display: flex; align-items: center;flex: 1">
                    <span class="msg mgr14">运输车次:</span>
                    <el-input
                      style="flex: 5;margin-right: 30px"
                      onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                      v-model.number="item.transportTime"><template slot="append">次</template>
                    </el-input>
                  </div>
                </div>
                <div style="display: flex">
                  <div class="mgb14"  style="display: flex; align-items: center;flex: 1">
                    <span class="msg mgr14">运输数量:</span>
                    <el-input
                      style="flex: 5;margin-right: 30px"
                      onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                      v-model.number="item.transportNum"><template slot="append">方</template>
                    </el-input>
                  </div>
                  <div class="mgb14"  style="display: flex; align-items: center;flex: 1">
                    <span class="msg mgr14">运输状态:</span>
                    <el-select v-model="item.transportStatus" style="flex: 5;margin-right: 30px">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
            </template>
          </el-scrollbar>
        </div>
        <div class="btn_box">
          <Btn :type="1" @save="saveMuck"></Btn>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Tabs from '../components/Tabs'
  import Btn from '../components/Btn'
  export default {
    name: "SedimentTransport",
    components: {
      Tabs,
      Btn
    },
    data(){
      return{
        options: [{value: 0,label: '平稳'}, {value: 1,label: '异常'}],
        date: '',   //当日日期
        dateTime:'',  //日期范围
        recentData:{    //近期检查汇总
          checkCar: 0,  //检查车辆
          checkConstruction: 0,    //检查工地
          checkIllegalCar: 0    //违规车辆
        },
        monthData:{
          executeCar: 0,    //出动车辆
          executeIllegalCar: 0,    //查处车辆
          executeNum: 0,    //执法次数
          executePeople: 0,    //出动人员
        },
        muckList: [],
      }
    },
    created(){
      this.getListMuck({day:0, type: 0})  //近期检查回执
      this.getListMuck({day:0, type: 1})  //渣土运输
      this.getListMuck({day:0, type: 2})  //本月执法汇总
    },
    methods: {
      getListMuck(parmas){
        this.$api.listMuck(parmas).then(res =>{
          if (res.errorcode !== 0){
            return
          }
          if (parmas.type == 0){   //近期检查回执
            let arrDataTime = res.data[0].checkDate.split('-')
            let statTime = `${arrDataTime[0]}-${arrDataTime[1]}-${arrDataTime[2]}`
            let endTime = `${arrDataTime[3]}-${arrDataTime[4]}-${arrDataTime[5]}`
            this.dateTime = [statTime, endTime] //显示时间
            let {checkCar, checkConstruction, checkIllegalCar} = res.data[0]
            this.recentData = {checkCar, checkConstruction, checkIllegalCar}
          }
          if (parmas.type == 1){   //渣土运输情况
            this.muckList = res.data
            this.date = res.data[0].date
          }
          if (parmas.type == 2){   //本月执法汇总
            let {executeCar, executeIllegalCar, executeNum, executePeople} = res.data[0]
            this.monthData = {executeCar, executeIllegalCar, executeNum, executePeople}
          }
        })
      },
      // 保存
      saveMuck(val){
        let parmasData = {}
        if (val === 0){   //近期检查回执
          parmasData = {
            date: this.date,
            type: val,
            checkedCar: this.recentData.checkCar,
            checkedIllegalCar: this.recentData.checkIllegalCar,
            checkConstruction: this.recentData.checkConstruction,
            checkDate: this.dateTime.join('-')
          }
        } else if (val === 1){//渣土运输情况
          let transportCar = []
          let transportTime = []
          let transportNum = []
          let transportStatus = []
          this.muckList.forEach(e =>{
            transportCar.push(e.transportCar)
            transportTime.push(e.transportTime)
            transportNum.push(e.transportNum)
            transportStatus.push(e.transportStatus)
          })
          parmasData = {
            date: this.date,
            type: val,
            transportCar,
            transportTime,
            transportNum,
            transportStatus
          }
        } else {      //本月汇总
          parmasData = {
            date: this.date,
            type: val,
            executeNum: this.monthData.executeNum,
            executePeople: this.monthData.executePeople,
            executeCar: this.monthData.executeCar,
            executeIllegalCar: this.monthData.executeIllegalCar
          }
        }
        this.$api.saveMuck(parmasData).then(res =>{
          if (res.errorcode !== 0){
            this.$message({
              type: 'error',
              message: res.msg
            })
            return
          }
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
        })
      },
      // 渣土tabs切换
      heatTabsClick(val){
        this.getListMuck({day:val, type: 1})  //渣土运输
      }
    }
  }
</script>

<style scoped>
  .mgr14{
    margin-right: 14px;
  }
  .mgb14{
    margin-bottom: 14px;
  }
  .SedimentTransport .content_box{
    position: relative;
    text-align: left;
    height: 782px;;
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
  .details_box_w{
    width: 50%;
  }
  .details_box .msg{
    flex: 2;
  }
  .msg{
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
  .collect_box{
    display: flex;
    align-items: center;
    width: 40%;
  }
  .datePicker{
    position: relative;
  }
  .datePicker>>>.el-icon-date{
    position: absolute;
    right: 6px;
  }
  >>> .el-scrollbar__wrap {
    overflow: scroll;
    width: 100%;
    height: 100%;
  }
</style>
