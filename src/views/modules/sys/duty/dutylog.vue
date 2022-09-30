<template>
  <div class="mod-config" >
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <!-- <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>-->
      <el-form-item>
        <el-button v-if="isAuth('duty:dutylogoperations:save')" type="primary" @click="newcontactsHandle()" size="small">新增</el-button>
      </el-form-item>
      <div style="display:inline-block;width: 56%;">
        <el-time-select
          placeholder="起始时间"
          v-model="startTime"
          :readonly=true
          :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '18:30'
            }">
        </el-time-select>
        <el-time-select
          :readonly=true
          placeholder="结束时间"
          v-model="endTime"
          :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '18:30',
              minTime: startTime
            }">
        </el-time-select>
      </div>
      <el-form-item style="width: 35%;">
        <!-- <el-button @click="getDataList()">查询</el-button> -->
        <!-- <el-button v-if="isAuth('duty:dutylogoperations:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
        <label style="margin-left:10px;">值班人:</label>
        <el-input v-model="dutyMan" placeholder="请填写" style="width:150px;display:inline-block;margin-left:5px;"></el-input>
        <label style="margin-left:10px;">接班人:</label>
        <el-input v-model="nextDutyMan" placeholder="请填写" style="width:150px;display:inline-block;margin-left:5px;"></el-input>
      </el-form-item>
    </el-form>

    <div style="width:100%;display: flex;">
      <div style="width:95%;">
        <div style="height: 536px;;max-height:583px;">
          <dutylogoperationsTable ref="dutylogoperationsTables" @newcontactsHandle="newcontactsHandle" @handleSelectionChange="handleSelectionChange" @=""></dutylogoperationsTable>
        </div>
      </div>

    </div>

    <div :class="iStyle?'':'iStyleNo'" style="position: absolute;right: 0;top:27px;width: 35%;z-index: 5;padding: 3%;transition: .5s;">
      <div style="width:100%;position: relative;background: #fff;">
        <div style="height:583px;max-height:583px;">
          <dutyinformation></dutyinformation>
        </div>
        <i @click="iStyle = !iStyle" class="el-icon-arrow-left" :class="iStyle?'iStyle':''" style="font-size: 50px;position: absolute;left: -45px;top: 0;bottom: 0;margin: auto;height: 50px;"></i>
      </div>
    </div>

    <!-- 弹窗, 新增 / 修改 -->
    <!-- <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update> -->
    <!-- 弹窗, 新增-->
    <dutylogoperationsAddOrUpdate v-if="newcontactsVisible" ref="newcontacts" @refresh="getPlatShareMenuList" @close="newcontactsVisible=false"></dutylogoperationsAddOrUpdate>
  </div>
</template>

<script>
  // import AddOrUpdate from './dutylogoperations-add-or-update';
  import dutylogoperationsTable from './dutylogoperations-table'
  import dutylogoperationsAddOrUpdate from './dutylogoperations-add-or-update'
  import dutyinformation from './duty_information'
  import Bus from '@/utils/bus'
  export default {
    data () {
      return {
        startTime: '',
        endTime: '',
        selectTime: '',
        newcontactsVisible: false,
        iStyle:false,
        dutyMan: '',
        nextDutyMan: '',
        // 表格
        platShareMenuList: [],
        standby: [
          {
            inspectionName: '其他',
            inspectionRemark: '',
            inspectionStatus: ''
          },
          {
            inspectionName: '交班事项',
            inspectionRemark: '',
            inspectionStatus: ''
          }
        ],
        dutylogMenuList: [
          {
            inspectionName: '其他',
            inspectionRemark: '',
            inspectionStatus: '',
            remark: ''
          },
          {
            inspectionName: '交班事项',
            inspectionRemark: '',
            inspectionStatus: '',
            remark: ''
          }
        ],
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        drawer: false,
        direction: 'rtl'
      }
    },
    components: {
      // AddOrUpdate,
      dutyinformation,
      dutylogoperationsTable,
      dutylogoperationsAddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    watch: {
      selectTime (val) {
        // console.log('selectTime', this.selectTime)
      }
    },
    methods: {
      AddTable () {
        this.dutylogMenuList.push({
          'inspectionName': '',
          'inspectionRemark': '',
          'inspectionStatus': 0
        })
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      // 获取数据列表
      getDataList () {
        // this.dataListLoading = true
        // this.$http({
        //   url: this.$http.adornUrl('/duty/dutylogoperations/list'),
        //   method: 'get',
        //   params: this.$http.adornParams({
        //     'page': this.pageIndex,
        //     'limit': this.pageSize,
        //     'key': this.dataForm.key
        //   })
        // }).then(({data}) => {
        //   console.log('/duty/dutylogoperations/list',data)
        //   if (data && data.code === 0) {
        //     this.dataList = data.page.list
        //     this.totalPage = data.page.totalCount
        //   } else {
        //     this.dataList = []
        //     this.totalPage = 0
        //   }
        //   this.dataListLoading = false
        // })
      },
      // 保存接口
      saveDutyLog (dutyobj) {
        // console.log('saveDutyLog', dutyobj)
        this.$http({
          url: this.$http.adornUrl('/duty/dutylog/save'),
          method: 'post',
          data: this.$http.adornData({
            dutyPersonnelName: this.dutyMan,
            nextDutyPersonnelName: this.nextDutyMan,
            precautions: dutyobj[1].inspectionRemark,
            remark: dutyobj[0].inspectionRemark,
            inspectionItems: [...dutyobj.slice(2)],
            beginTime: this.selectTime[0],
            endTime: this.selectTime[1],
            operations: [...this.platShareMenuList]
          })
        }).then(res => {
          if (res && res.code === 0) {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.dutylogMenuList = this.standby
                  this.dutyMan = ''
                  this.nextDutyMan = ''
                  this.selectTime = ''
                  this.platShareMenuList = []
                }
              })
            } else {
              this.$message.error(res.msg)
            }
          
        })
      },
      getPlatShareMenuList (obj, message) {
        var that = this
        // console.log('getPlatShareMenuList', obj, message)
        if (message != 'watch' && message != 'update') {
          obj.index = this.platShareMenuList.length
          this.platShareMenuList.push(obj)
        } else {
          this.platShareMenuList.forEach(item => {
            if (item.index === obj.index) {
              this.$set(this.platShareMenuList, item.index, obj)
            }
          })
        }
        // console.log(
        //   'this.platShareMenuList',
        //   this.platShareMenuList,
        //   obj,
        //   obj.time
        // )
        setTimeout(function () {
          that.$refs.dutylogoperationsTables.beg()
        },500)
      },
      // 新增日志列表
      newcontactsHandle (obj, message) {
        // console.log('newcontactsHandle')
        var obj = {}
        obj.startTime = this.startTime
        obj.endTime = this.endTime
        this.newcontactsVisible = true
        this.$nextTick(() => {
          this.$refs.newcontacts.init(obj, message)
        })
      },
      // 被勾选的表格
      handleSelectionChange (val) {
        var tal = []
        this.$emit('handleSelectionChange', val)
        for (var i = 0; i < val.length; i++) {
          tal.push(val[i].id)
          this.currenttableArray = tal
        }
        // console.log('this.currenttableArray', this.currenttableArray)
      },
      // 删除||批量删除物资
      batchDelete (obj) {
        // if (!this.currentTreeObject) {
        //   var ids = {
        //     contactorIds: this.currenttableArray || [id],
        //     resoureArticleStorehouseId: null
        //   };
        // } else {
        //   var ids = {
        //     contactorIds: this.currenttableArray || [id],
        //     resoureArticleStorehouseId: this.currentTreeObject
        //   };
        //   console.log(ids);
        // }
        // this.$confirm(
        //   `确定对id为${this.currenttableArray || [id]}进行删除操作?`,
        //   "提示",
        //   {
        //     confirmButtonText: "确定",
        //     cancelButtonText: "取消",
        //     type: "warning"
        //   }
        // )
        //   .then(() => {
        //     this.$http({
        //       url: this.$http.adornUrl("/resoure/resourearticle/delete"),
        //       method: "post",
        //       data: this.$http.adornData({ids:this.currenttableArray}, false)
        //     }).then(({ data }) => {
        //       if (data && data.code === 0) {
        //         this.$message({
        //           message: "操作成功",
        //           type: "success",
        //           duration: 1500,
        //           onClose: () => {
        //             this.getDataList();
        //           }
        //         });
        //       } else {
        //         this.$message.error("请选择一个联系人删除");
        //       }
        //     });
        //   })
        //   .catch(() => {});
        this.$confirm(`确定进行删除操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.platShareMenuList.forEach(item => {
            if (item.index === obj.index) {
              this.platShareMenuList.splice(item.index, 1)
            }
          })
        })
      },

      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      // addOrUpdateHandle (obj,message) {
      //   this.addOrUpdateVisible = true
      //   this.$nextTick(() => {
      //     this.$refs.addOrUpdate.init(obj,message)
      //   })
      // },
      // 删除
      deleteHandle (id) {
        var ids = id
          ? [id]
          : this.dataListSelections.map(item => {
            return item.id
          })
        this.$confirm(
          `确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          this.$http({
            url: this.$http.adornUrl('/duty/dutylogoperations/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    },
    mounted () {
      var that = this
      this.$http({
        url: this.$http.adornUrl(`/duty/dutyLog/getCurrentDutySchedule`),
        method: 'POST',
        data: this.$http.adornParams({})
      }).then(({ data }) => {
        // console.log(data.dutyLog)
        this.dutyMan = data.dutyLog.dutyPerson
        this.nextDutyMan = data.dutyLog.nextDutyPerson
        this.startTime = data.dutyLogSchedule.startTime
        this.endTime = data.dutyLogSchedule.endTime
        if(data){
          if(data.dutyLog){
            if(data.dutyLog.id){
              localStorage.dutyLogId = data.dutyLog.id
            }
          }else{
            localStorage.dutyLogId = ''
          }
        }
      })
      setInterval(function () {
        var times = new Date().getTime()
        var endTime = new Date(that.endTime).getTime()
        // console.log(endTime<times,times,endTime)
        if (endTime<times){
          localStorage.dutyLogId = ''
        }
      },1000)
    },
    watch:{
      dutyMan:function (newValue) {
        // console.log(newValue)
        Bus.$emit('dutyMan',newValue)
      },
      nextDutyMan:function (newValue) {
        // console.log(newValue)
        Bus.$emit('nextDutyMan',newValue)
      }
    }
  }
</script>
<style scoped  lang="less">
  .iStyle{
    transform: rotate(180deg);
  }
  .iStyleNo{
    right: -475px !important;
  }

</style>
