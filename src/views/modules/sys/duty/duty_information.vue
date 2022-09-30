<template>
    <div>
      <div class="infrom_wrap">
        <div class="infrom_title">接班信息 {{oneDate}}</div>

        <el-table
          :data="tableData5"
          border
          @row-click="tabClick"
          style="width: 100%">
          <el-table-column
            prop="index"
            label=""
            width="">
          </el-table-column>
          <el-table-column
            prop="data"
            label="日期"
            width="">
          </el-table-column>
          <el-table-column
            prop="name"
            label="事项"
            width="">
          </el-table-column>
          <el-table-column
            prop="address"
            label="处置状态">
          </el-table-column>
        </el-table>


<!--        <div style="display: flex;flex-direction: column;align-items: flex-start;">-->
<!--          <el-button type="text" @click="dialogVisibles(item,index)" v-for="(item,index) in jbxxtoDoList" :key="index" style="margin: 0;">{{index+1+'.'+item.record+'  '+item.createTime+' '+item.handleOpnion}}</el-button>-->
<!--        </div>-->

        <el-input
          type="textarea"
          disabled
          :autosize="{minRows:2, maxRows: 4}"
          :placeholder="oneRemark"
          v-model="textarea2">
        </el-input>
      </div>
      <div class="infrom_wrap" style="margin-top: 20px;">
        <div class="infrom_title">当前值班 {{tableData[0].date}}</div>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="overNum"
            label="已办"
            width="270">
          </el-table-column>
          <el-table-column
            prop="stayNum"
            label="待办">
          </el-table-column>
        </el-table>
        <el-input
          type="textarea"
          :autosize="{minRows:5, maxRows: 4}"
          placeholder="备注："
          :value="dqzbdutyLog.remark"
          v-model="dqzbdutyLog.remark">
        </el-input>
        <el-button type="primary" :plain="true" style="margin-top:20px;float: right;" @click="save" size="small">保存</el-button>
      </div>

      <div style="z-index: 9999;" class="ss">
        <el-dialog
          title="处置历史"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose"
          style="z-index: 9999;"
          :modal=false
        >
          <el-timeline :reverse="reverse">
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.timestamp">
              {{activity.content}}
            </el-timeline-item>
          </el-timeline>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="chuzhi" size="small">处置</el-button>
          </span>
        </el-dialog>
      </div>

    </div>
</template>

<script>
  import Bus from '@/utils/bus'
  export default {
    name: 'duty_information',
    data () {
      return {
        oneDate: '',
        oneRemark: '',
        jbxxtoDoList: '',
        dqzbdutyLog: {
          remark: ''
        },
        tableData5: [],
        textarea1: '',
        textarea2: '',
        textarea3: '',
        tableData: [{
          date: '',
          overNum: '0',
          stayNum: '0'
        }],
        dialogVisible: false,
        reverse: true,
        activities: [],
        sanList: '',
        index: '',
      }
    },
    mounted () {
      var that = this
      this.dqzb()
      Bus.$off('dqzb')
      Bus.$on('dqzb', () => {
        setTimeout(function () {
          that.jbxx()
          that.dqzb()
        }, 10)
      })
      setTimeout(function () {
        that.jbxx()
        that.dqzb()
      }, 500)

      Bus.$off('jbxx')
      Bus.$on('jbxx', (data) => {
        setTimeout(function () {
          that.jbxx()
          that.dqzb()
        }, 10)
      })
      Bus.$off('delCommon')
      Bus.$on('delCommon', (data) => {
        that.jbxx()
        that.dqzb()
      })
      // dqzbdutyLog
      Bus.$off('dutyMan')
      Bus.$on('dutyMan', (data) => {
         that.dqzbdutyLog.dutyPerson = data
      })
      Bus.$off('nextDutyMan')
      Bus.$on('nextDutyMan', (data) => {
        that.dqzbdutyLog.nextDutyPerson = data
      })

    },
    methods: {
      handleClose (done) {
        done()
      },
      chuzhi () {
        this.dialogVisible = false
        var obj = this.jbxxtoDoList[this.index]
        var handleStatus = ''
        // eslint-disable-next-line eqeqeq
        if (obj.handleStatus == 0) {
          handleStatus = '已完成'
          // eslint-disable-next-line eqeqeq
        } else if (obj.handleStatus == 0) {
          handleStatus = '处理中'
        } else {
          handleStatus = '待处理'
        }
        var data = {
          time: obj.createTime,
          record: obj.record,
          instruction: obj.instruction,
          manage: obj.manage,
          brief: obj.brief,
          telegram: obj.telegram,
          writingsInfo: handleStatus,
          dutyLogId: obj.dutyLogId,
          id: obj.id,
          transact: obj.operatorName,
          startTime: obj.createTime,
          endTime: obj.endTime
        }
        Bus.$emit('delayed', data)
      },
      tabClick(row, event, column){
        // eslint-disable-next-line no-unused-vars
        var that = this
        //   单元格点击事件
        // console.log(row,event)
        let data = this
        // date name address
        this.dialogVisible = true
        this.index = row.index
        this.czls(row.id)
      },
      dialogVisibles (item, index) {

      },
      dqzb () {
        // 当前值班
        var dutyId = localStorage.dutyLogId
        if (dutyId) {
          this.$http({
            url: this.$http.adornUrl(`/duty/dutyLog/getDutyShiftInfo/${dutyId}`),
            method: 'POST',
            data: this.$http.adornParams({})
          }).then(({ data }) => {
            if (data && data.code === 0) {
              //  console.log(data)
                this.dqzbdutyLog = data.dutyLog
                this.tableData[0].date = data.dutyLog.date + ' ' + data.dutyLog.dutyStartTime + '——' + data.dutyLog.date + ' ' + data.dutyLog.dutyEndTime
                this.tableData[0].overNum = data.completedList.length
                this.tableData[0].stayNum = data.toDoList.length
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      },
      jbxx () {
        var currentDutyLogId = localStorage.dutyLogId
        var that = this
        // var currentDutyLogId = '32'
      //  接班信息
        this.$http({
          url: this.$http.adornUrl(`/duty/dutyLog/getLastShiftsInfo`),
          method: 'POST',
          data: this.$http.adornParams({currentDutyLogId: currentDutyLogId})
        }).then(({ data }) => {
          if (data && data.code === 0) {
              // console.log(data)
          // date name address
          this.oneRemark = data.dutyLog.remark
          this.oneDate = data.dutyLog.date + ' ' + data.dutyLog.dutyStartTime + '——' + data.dutyLog.date + ' ' + data.dutyLog.dutyEndTime
          var oneDate = this.oneDate
          var oneRemark = this.oneRemark
          this.jbxxtoDoList = data.toDoList
          if(data.toDoList){
            data.toDoList.forEach(function (ele,index) {
              var vv='';
              if(ele.handleStatus==0){
                vv = '已办理'
              }else if(ele.handleStatus==1){
                vv = '处理中'
              }else{
                vv = '待办'
              }
              var obj = {
                data: ele.createTime,
                name: ele.remark,
                address: vv,
                index: index,
                id: ele.id
              }
              that.tableData5.push(obj)
            })
          }
            } else {
              this.$message.error(data.msg)
            }
          

        })
      },
      save () {
        // dqzbdutyLog
        //  接班信息
        var dutyLog = this.dqzbdutyLog
        this.$http({
          url: this.$http.adornUrl(`/duty/dutyLog/generateDutyShift`),
          method: 'POST',
          data: this.$http.adornData(dutyLog)
        }).then(({ data }) => {
          if (data && data.code === 0) {
              // console.log(data)
              this.$message({
                message: '保存成功!',
                type: 'success'
              });
            } else {
              this.$message.error(data.msg)
            }
        })
      },
      czls (dutyLogId) {
      //  处置历史
        this.$http({
          url: this.$http.adornUrl(`/duty/dutyLogOperationsHistory/listDutyLogOperationsHistoryById/${dutyLogId}`),
          method: 'POST',
          data: this.$http.adornParams({})
        }).then(({ data }) => {
          if (data && data.code === 0) {
              //  console.log(data)
              var activities = []
              var activitiesObj = {}
              activitiesObj.content = data.dutyLogOperationsHistoryList[0].handleOpinion + ' 进行了 ' + data.dutyLogOperationsHistoryList[0].instruction
              activitiesObj.timestamp = data.dutyLogOperationsHistoryList[0].createTime
              activities.push(activitiesObj)
              this.activities = activities
              this.sanList = data.dutyLogOperationsHistoryList[0]
            } else {
              this.$message.error(data.msg)
            }
        })
      }
    }
  }
</script>

<style scoped lang="less">
.infrom_wrap{
  padding-top: 5px;
  border: 1px solid #f1f1f1;
}
  .infrom_title{
    font-size: 16px;
    font-weight: bold;
    background: rgba(230,230,230);
    text-align: left;
    padding: 12px 0;
    padding-left:20px;
  }
.ss /deep/ .el-dialog__wrapper{
  z-index: 9999 !important;
}
.ss /deep/ .el-dialog__wrapper>div{
  z-index: 9999 !important;
}
</style>
