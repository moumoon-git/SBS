<template>
  <div class="dutylogoperations-table-wrap" style="padding:3px;height:700px;margin-top:20px;width:100%;margin: 0px;">
    <el-table
      @selection-change="handleSelectionChange"
      :data="dataList"
      stripe
      border
      style="width: 100%;"
      height="700px"
      :header-cell-style="{
        background: '#E6E6E6 ',
        color: '#555',
        border: '1px solid #fff'
      }"
      :cell-style="{ border: '1px solid #fff' }"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="time" header-align="center" align="center" label="值班时间"></el-table-column>
      <el-table-column prop="telegram" header-align="center" align="center" label="来电/文记录"></el-table-column>
      <el-table-column prop="brief" header-align="center" align="center" label="简要情况"></el-table-column>
      <el-table-column prop="manage" header-align="center" align="center" label="办理意见"></el-table-column>
      <el-table-column prop="writingsInfo" header-align="center" align="center" label="办理情况"></el-table-column>
      <el-table-column prop="transact" header-align="center" align="center" label="办理人"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作" v-if="typeShow!=1">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="newcontactsHandle(scope.row,'watch')">查看</el-button>
          <el-button type="text" size="small" v-if="xs" @click="newcontactsHandle(scope.row,'update')">修改</el-button>
          <el-button type="text" size="small" v-if="xs"  @click="deleteHandle(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <dutylogoperationsAddorUpdate ref="dutylogoperationsAddorUpdate" ></dutylogoperationsAddorUpdate>
     <!-- <el-button v-if="isAuth('duty:dutylog:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
  </div>
</template>

<script>
  import Bus from '@/utils/bus'
  import dutylogoperationsAddorUpdate from '@/views/modules/sys/duty/dutylogoperations-add-or-update'
export default {
  // 表格内容
  data () {
    return {
      dataList: [],
      typeShow: 0,
      xs: true
    }
  },
  mounted () {
    var that = this
    // console.log(this.dataList)
    this.beg()
    Bus.$off('beg')
    Bus.$on('beg', (data) => {
      that.beg()
    })
    // console.log(this.$refs.dutylogoperationsAddorUpdate)
    Bus.$off('history')
    Bus.$on('history',(data)=>{
      that.history(data)
    })
  },
  updated () {
    // console.log('dataListdataListdataListdataListdataList', this.dataList)
  },
  methods: {
    inxg(){
      this.xs = false
    },
    // tableRowClassName 为 Table 中的某一行添加 class
    tableRowClassName ({ row, rowIndex }) {
      if (!row.openId) {
        return 'warning-row'
      } else {
        return 'success-row'
      }
      // eslint-disable-next-line no-unreachable
      return ''
    },
    // 查看，修改
    // addOrUpdateHandle(id, staus) {
    //   this.$emit("addOrUpdateHandle", id, staus);
    // },
    newcontactsHandle (obj, message) {
      // console.log(obj,message)
      var handleStatus=''
      if(obj.handleStatus==0){
        handleStatus='已完成'
      }else if(obj.handleStatus==0){
        handleStatus='处理中'
      }else{
        handleStatus='待处理'
      }
        obj.time = obj.createTime,
        obj.telegram = obj.record,
        obj.instruction = obj.instruction,
        obj.manage = obj.manage,
        obj.brief = obj.brief,
        obj.telegram = obj.telegram,
        obj.writingsInfo = handleStatus,
        obj.dutyLogId = obj.dutyLogId,
        obj.id = obj.id,
        obj.transact = obj.operatorName
      this.$refs.dutylogoperationsAddorUpdate.init(obj,message)
    },
    del (id) {
      // 删除请求
      this.$http({
        url: this.$http.adornUrl(`/duty/dutyLogOperations/delete/${id}`),
        method: 'POST',
        data: this.$http.adornParams({})
      }).then(({ data }) => {
        // console.log(data)
        this.beg()
        Bus.$emit('delCommon','')
      })
    },
    deleteHandle (obj) {
      // 删除
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.del(obj.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // console.log(obj)
    },
    // 修改
    handleSelectionChange (val) {
      this.$emit('handleSelectionChange', val)
    },
    beg () {
    //  请求
      this.$http({
        url: this.$http.adornUrl(`/duty/dutyLog/getCurrentDutySchedule`),
        method: 'POST',
        data: this.$http.adornParams({})
      }).then(({ data }) => {
        // console.log(data.dutyLogOperationsList)
        if (data.dutyLogOperationsList) {
          this.dataList = data.dutyLogOperationsList
          this.dataList.forEach(function (ele, index) {
            var handleStatus = ''
            // eslint-disable-next-line eqeqeq
            if (ele.handleStatus == 0) {
              handleStatus = '已办理'
              // eslint-disable-next-line eqeqeq
            } else if (ele.handleStatus == 1) {
              handleStatus = '处理中'
            } else {
              handleStatus = '待办'
            }
            ele.brief = ele.remark
            ele.transact = ele.operatorName
            ele.instruction = ele.instruction
            ele.manage = ele.handleOpnion
            ele.telegram = ele.record
            ele.time = ele.createTime
            ele.writingsInfo = handleStatus
          })
        }
        if (data) {
          if (data.dutyLog) {
            if (data.dutyLog.id) {
              localStorage.dutyLogId = data.dutyLog.id
            }
          }
        }
      })
    },
    history(date){
    //查看历史日志
      this.$http({
        url: this.$http.adornUrl(`/duty/dutyLog/getDutyLogListByDay`),
        method: 'POST',
        data: this.$http.adornParams({date})
      }).then(({ data }) => {
        // console.log(data.data)
        if (data.data.length!=0) {
          if(data.data[0].dutyLogOperationsEntityList.length!=0){
            this.dataList = data.data[0].dutyLogOperationsEntityList
            this.dataList.forEach(function (ele, index) {
              var handleStatus = ''
              // eslint-disable-next-line eqeqeq
              if (ele.handleStatus == 0) {
                handleStatus = '已办理'
                // eslint-disable-next-line eqeqeq
              } else if (ele.handleStatus == 1) {
                handleStatus = '处理中'
              } else {
                handleStatus = '待办'
              }
              ele.brief = ele.remark
              ele.transact = ele.operatorName
              ele.instruction = ele.instruction
              ele.manage = ele.handleOpnion
              ele.telegram = ele.record
              ele.time = ele.createTime
              ele.writingsInfo = handleStatus
            })
          }else{
            this.dataList = []
          }
        }else if(data.data.length == 0){
          this.dataList = []
        }

      })
    },
    keyWordSeach(keyword){
      this.$http({
        url: this.$http.adornUrl(`/duty/dutyLog/getDutyLogOperationsListByConditions`),
        method: 'POST',
        data: this.$http.adornParams({keyword})
      }).then(({ data }) => {
        // console.log(data.dutyLogOperationsEntityList)
         if(data.dutyLogOperationsEntityList.length!=0){
            this.dataList = data.dutyLogOperationsEntityList
            this.dataList.forEach(function (ele, index) {
              var handleStatus = ''
              // eslint-disable-next-line eqeqeq
              if (ele.handleStatus == 0) {
                handleStatus = '已办理'
                // eslint-disable-next-line eqeqeq
              } else if (ele.handleStatus == 1) {
                handleStatus = '处理中'
              } else {
                handleStatus = '待办'
              }
              ele.brief = ele.remark
              ele.transact = ele.operatorName
              ele.instruction = ele.instruction
              ele.manage = ele.handleOpnion
              ele.telegram = ele.record
              ele.time = ele.createTime
              ele.writingsInfo = handleStatus
            })
        }else if(data.dutyLogOperationsEntityList.length == 0){
          this.dataList = []
        }

      })
    }
  },
  components:{
    dutylogoperationsAddorUpdate
  }
}
</script>

<style lang="less">
.dutylogoperations-table-wrap {
  .el-table .success-row {
    // background: #f0f9eb;
  }
  .el-table::before {
    height: 0px;
  }
  .el-table__header .has-gutter tr > th {
    background: rgba(230, 230, 230, 1) !important;
  }
  .el-table th {
    background: rgba(230, 230, 230, 1) !important;
  }
  .el-table__body tbody > :nth-child(2n) {
    background: rgba(230, 230, 230, 1);
  }
  .el-button--default {
    border-radius: 3px;
    width: 88px;
  }
  .cell {
    .el-button--info {
      background-color: transparent;
      border: none;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      font-weight: bold;
      color: rgba(71, 157, 255, 1);
    }
    .el-button--primary {
      background-color: transparent;
      border: none;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      font-weight: bold;
      color: rgba(118, 214, 114, 1);
    }
    .el-button--danger {
      background-color: transparent;
      border: none;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      font-weight: bold;
      color: rgba(230, 115, 128, 1);
    }
  }
  .el-pagination {
    display: flex;
    justify-content: center;
  }
}
</style>

