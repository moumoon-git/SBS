<template>
  <div>
    <el-header class="navsBar" style="height: 80px">
      <el-col :span="12" style="text-align: left">
        <el-date-picker
          v-model="historyTime"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-button type="primary" size="medium" @click="soush">搜索</el-button>
      </el-col>
      <el-col :span="12" style="text-align: right">
        <!--         <label class="export">导出选项:</label> -->
        <!-- <el-select v-model="exportLog" placeholder="请选择" clearable>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
        <el-button type="primary" @click="confirm" v-if="allowConfirm" size="medium">确认</el-button>
        <el-button type="primary" v-print="'#printTest'" size="medium">打印</el-button>
        <el-button type="primary" @click="word" size="medium">导出</el-button>
      </el-col>
    </el-header>
    <el-main style="margin: 0 30px;padding: 20px 0 0 0">
      <el-col :span="2">
        <div class="mainLog">
          <el-tabs v-for="(item,index) in option" :key="index" :tab-position="tabPosition" v-model="opt"
                   @tab-click="tabs">
            <el-tab-pane :label='item.label' :name="item.name"></el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col :span="22">
        <div class="mainLog" style="margin-left: 30px">
          <right-table :leftname=leftname :tableData="tableData"></right-table>
        </div>
      </el-col>
    </el-main>
    <!--    //隐藏的-->
    <div class="show" id="printTest">
      <div class="tableHeader">值班日志</div>
      <table border="1" width="100%" cellspacing="0" cellpadding="0">
        <thead>
             
        <tr height="40px">
          <td>日期</td>
                 
          <td colspan="4">{{leftname.dateStart}} 至 {{leftname.dateEnd}}</td>
               
        </tr>
             
        <tr height="40px">
                 
          <td width="25%">值班人员</td>
           
                 
          <td width="25%">{{leftname.primaryDutyOperator}}</td>
           
                 
          <td width="25%">接班人员</td>
           
                 
          <td width="25%">{{leftname.secondDutyOperator}}</td>
           
               
        </tr>
        <tr>
          <td colspan="4" height="40px">值班内容</td>
        </tr>
        </thead>
        <tbody v-for="item in tableData">
        <tr>
          <td rowspan="3">{{item.operateTime}}</td>
          <td class="matter">事项</td>
          <td colspan="2" width="25%">
            <div class="tdContent">{{item.event}}</div>
          </td>
        </tr>
        <tr>
          <td class="matter">处置记录</td>
          <td colspan="2" width="25%">
            <div class="tdContent">{{item.operation}}</div>
          </td>
        </tr>
        <tr>
          <td class="matter">领导批示</td>
          <td colspan="2" width="25%">
            <div class="tdContent">{{item.leadershipInstructions}}</div>
          </td>
        </tr>
        </tbody>

      </table>
      <div class="tableHeader">交接班事项</div>
      <el-row class="borderBox">
        <el-row style="height: 80px;line-height: 80px">
          <el-col :span="8" class="borderBox">
            硬件设备状态
          </el-col>
          <el-col :span="16" class="borderBox">
            <div>
              {{hardwareState}}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="borderBox heightBox">
            故障描述
          </el-col>
          <el-col :span="16" class="borderBox heightBox">
            <div class="contextBox">
              {{leftname.breakDown}}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="borderBox heightBox">
            事件处理
          </el-col>
          <el-col :span="16" class="borderBox heightBox">
            <div class="contextBox">
              {{leftname.eventDeal}}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="borderBox heightBox">
            领导交办
          </el-col>
          <el-col :span="16" class="borderBox heightBox">
            <div class="contextBox">
              {{leftname.handover}}
            </div>
          </el-col>
        </el-row>
      </el-row>
    </div>
  </div>
</template>

<script>
  // import leftTable from "@/view/dutyManagement/logBook/historyLog/tables/leftTable"
  import rightTable from "@/view/dutyManagement/logBook/historyLog/tables/rightTable"

  export default {
    name: "historyLog",
    components: {
      // leftTable,
      rightTable
    },
    data() {
      return {
        tabPosition: 'bottom',
        hardwareState: '',
        opt: '',
        option: [],
        leftname: [],
        id: '',
        alltableData: [],
        tableData: [],//表格数据
        historyTime: '',//历史时间选择
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        options1: [
          {
            value: '0',
            label: '当天日志'
          },
          {
            value: '1',
            label: '全天日志'
          }
        ],
        exportLog: '',
        allowConfirm: false,
      }
    },
    methods: {
      formatDateTime(time) {
        console.log(time);
        var date = time;
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
      },
      //tab切换
      tabs(tab, event) {
        console.log(tab.name);
        this.opt = tab.name;
        this.tableData = this.alltableData[tab.name].appDutyLogOperationsList;
        this.leftname = this.alltableData[tab.name].dutyLogVo;
        this.id = this.leftname.id;
        console.log(this.alltableData[tab.name].dutyLogVo, this.leftname);
        this.showConfirmButton();
      },
      soush() {
        let time = this.formatDateTime(this.historyTime);
        console.log(time);
        let data = {
          dateStart: time
        };
        //  请求
        this.$api.dutyLoghistory(data).then((res) => {
          console.log(res);
          if (res.data.length == 0) {
            const h = this.$createElement;

            this.$notify({
              title: '提示',
              position: 'bottom-right',
              message: h('i', {style: 'color: teal'}, '今天还没有上传数据哦')
            });
            return
          }
          let arr = [];
          console.log(1111111111111111111);
          for (let i = 0; i < res.data.length; i++) {
            // let label=res.data.id
            console.log(res.data[i].dutyLogVo.primaryDutyOperator);
            // console.log(res.data[i].id)
            arr.push({label: res.data[i].dutyLogVo.primaryDutyOperator, name: JSON.stringify(i)});
          }
          this.option = arr;
          console.log(arr);
          this.tableData = res.data[0].appDutyLogOperationsList;
          this.leftname = res.data[0].dutyLogVo;
          this.alltableData = res.data;
          console.log(this.leftname);
          this.id = this.leftname.id;
          this.showConfirmButton();
        })
      },
      word() {
        console.log(this.id);
        if (this.id == '') {
          this.$message({
            message: '当前值班记录为空，不可导出哦！',
            type: 'warning'
          });
        } else {
          let id = this.id;
          console.log(id);
          const UrlRoot = window.g.ApiUrl;
          window.location.href = UrlRoot + '/eos/duty/dutyLogOperations/exportWord?id=' + id
        }

      },
      showConfirmButton() {
        //切换“确认”按钮的显示状态
        let userName = localStorage.getItem('userName');
        if (this.leftname && this.leftname.confirmed && this.leftname.confirmed === 1){
          this.allowConfirm = false;
        }else{
          if (this.leftname.secondDutyOperatorName){
            this.allowConfirm = userName && userName === this.leftname.secondDutyOperatorName;
          }else{
            this.allowConfirm = true;
          }
        }
      },
      confirm() {
        if (this.id == '') {
          this.$message({
            message: '当前值班记录为空，不可确认！',
            type: 'warning'
          });
        }else{
          let data = { id: this.id };
          this.$api.confirmDutyLog(data).then((res) => {
            if (res.errorcode == 0) {
              this.$message({
                message: '确认成功',
                type: 'success'
              });

              this.soush();
            }else{
              this.$message({
                message: '确认失败',
                type: 'error'
              });
            }
          });
        }
      }
    },
    mounted() {
      // 获取当前日期
      this.historyTime = new Date;
      this.soush();
    },
    beforeUpdate() {
      if (this.leftname.handover === '') {
        this.hardwareState = '正常'
      } else {
        this.hardwareState = '异常'
      }
    }
  }
</script>
<!-- <style >#printTest{display:none}</style>
<style media="print">#printTest{display:block}</style> -->
<style scoped>
  .export {
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

  .navsBar {
    margin: 0 30px;
    background-color: white;
    display: flex;
    align-items: center;
    border: 1px solid rgba(219, 219, 219, 1);
    box-sizing: border-box;
    border-radius: 3px;

  }

  .mainLog {
    height: 600px;
    /* margin-bottom: 20px; */
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 3px;
    overflow-y: auto;
  }

  >>> .el-tabs--left .el-tabs__header.is-left {
    float: none;
  }

  /* @page {
    size: 595.3pt 841.9pt;
    margin: 1cm 1cm 1cm 1cm
  }
  @media print {
    body
    {
      display: inherit; 设置为none，则打印空白，即不能打印
    }
    header {
      display: none;
    }

    footer {
      display: none;
    }
    .specificTitle{
      color: red;
      width: 100%;
      text-align: center;
      padding: 10px 0;
      font-size: 32px;
      font-weight: bold;
      font-family:Microsoft YaHei;
    }
    .specificTime,.specificPeriods{
      font-size: 22px;
      width: 100%;
      text-align: center;
    }
    .specificEvent{
      font-size: 28px;
      font-weight: bold;
      width:95%;
      padding: 20px 0;
      text-align: left;
      margin: 0 auto;
    }
    #showAffction >>> .el-textarea__inner {
      border: none;
    }
  } */
  .show {
    display: none;
  }

  /* >>>.el-tabs__nav-wrap::after{
    background:#E4E7ED !important;
  } */
  >>> .el-tabs__active-bar {
    background: #E4E7ED !important;
  }

  >>> .el-tabs__nav {
    float: none;
  }

  /*  .borderBox{
    box-sizing: border-box;
    border:1px solid #565656;
  }
  .heightBox{
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .contextBox{
    width: 100%;
    height: 100%;
    text-align: left;
    text-indent: 10px;
    overflow-y: auto;
  }
  .tableHeader{
    height:60px;
    line-height: 60px;
    font-size:20px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(50,50,50,1);
  }
  table{
    height: 535px;
    box-sizing: border-box;
    color:rgba(96,98,102,1);
  }

  .matter{
    background:rgba(242,242,242,1);
  }
  .tdContent{
    display: flex;
    justify-content: flex-start;
    text-indent: 10px;
    min-height: 80px;
    width: 400px;
    overflow-y: auto;
  } */
</style>
