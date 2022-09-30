<template>
  <!-- 车辆黑名单信息 -->
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-select clearable placeholder="请选择状态类型" v-model="dataForm.status" class="searchMargin">
          <el-option
            v-for="item in statusData"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="dataForm.time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="left"
          value-format="yyyy-MM-dd"
          style="width:300px;"
          class="searchMargin"
        ></el-date-picker>
        <div style="display:inline-block;position: relative;" class="searchMargin">
          <img
            class="searchIcon"
            src="data:image/svg+xml;base64,PHN2ZyB0PSIxNTczMDE4OTAxNTE3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM1MDgiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNODQ1LjMxNjgxIDgwNC4yNzkwMzMgNjY5LjgwNjExNiA2MjguNzY4MzM5YzM5LjI5ODAyMS00Ny43OTIxMjUgNjAuNjg2Nzg4LTEwNy4yNTA4NDkgNjAuNjg2Nzg4LTE2OS45ODQ0MDkgMC03MS42MzcwMTgtMjcuOTM4NDM3LTEzOC45NzU4MTUtNzguNDkzNzA0LTE4OS42MzM0Mi01MC42NTc2MDUtNTAuNjU3NjA1LTExNy45OTY0MDItNzguNDkzNzA0LTE4OS42MzM0Mi03OC40OTM3MDRzLTEzOC45NzU4MTUgMjcuOTM4NDM3LTE4OS42MzM0MiA3OC40OTM3MDRjLTUwLjY1NzYwNSA1MC42NTc2MDUtNzguNDkzNzA0IDExNy45OTY0MDItNzguNDkzNzA0IDE4OS42MzM0MnMyNy45Mzg0MzcgMTM4Ljk3NTgxNSA3OC40OTM3MDQgMTg5LjYzMzQyYzUwLjY1NzYwNSA1MC42NTc2MDUgMTE3Ljk5NjQwMiA3OC40OTM3MDQgMTg5LjYzMzQyIDc4LjQ5MzcwNCA2NS4zOTQzNjMgMCAxMjcuMjA2ODc2LTIzLjIzMDg2MSAxNzYuMDIyMzg3LTY1LjkwNjA1NmwxNzQuOTk5MDAxIDE3NC45OTkwMDFjNC40MDA1NiA0LjQwMDU2IDEwLjEzMTUyMSA2LjU0OTY3IDE1Ljk2NDgyMSA2LjU0OTY3czExLjU2NDI2MS0yLjE0OTExMSAxNS45NjQ4MjEtNi41NDk2N0M4NTQuMTE3OTI5IDgyNy4zMDUyMTcgODU0LjExNzkyOSA4MTMuMDgwMTUyIDg0NS4zMTY4MSA4MDQuMjc5MDMzek0yMzkuMjY3NjM5IDQ1OC43ODM5M2MwLTEyMy4wMTA5OTMgMTAwLjA4NzE0OC0yMjMuMDk4MTQxIDIyMy4wOTgxNDEtMjIzLjA5ODE0MXMyMjMuMDk4MTQxIDEwMC4wODcxNDggMjIzLjA5ODE0MSAyMjMuMDk4MTQxLTEwMC4wODcxNDggMjIzLjA5ODE0MS0yMjMuMDk4MTQxIDIyMy4wOTgxNDFTMjM5LjI2NzYzOSA1ODEuNzk0OTIzIDIzOS4yNjc2MzkgNDU4Ljc4MzkzeiIgcC1pZD0iMzUwOSIgZmlsbD0iIzhhOGE4YSI+PC9wYXRoPjwvc3ZnPg=="
            alt
          />
          <el-input
            v-model="dataForm.search"
            placeholder="请输入任务名称、任务接收、任务接收人"
            clearable
            style="width:350px;"
          ></el-input>
        </div>
        <el-button @click="getDataList()" class="searchMargin">查询</el-button>
        <el-button @click="addHandle()" class="searchMargin" style="margin-left:0">新增任务</el-button>
        <!-- <el-button>导出</el-button> -->
        <!-- <el-button class="buttonStyle searchMargin" @click="openView('')">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <div style="width:100%;position:relative;">
      <div class></div>
      <!-- <div style="width:15%;min-width:320px;display:inline-block;">
        <riskvehicleblacklistTree
          :list="modifiedUserList"
          :listProps="modifiedUserProps"
          @handleNodeClick="handleNodeClick"
          @showTree="showEventType"
          @addTree="addEventType"
          @updateTree="updateEventType"
          
          @deleteTree="deleteEventType"
          @setCheckedIds="setCheckedIds"
          :Treeexpansion="Treeexpansion"
        >
        </riskvehicleblacklistTree>
      </div>-->
      <div style="width: 100%;min-width: 540px;display:inline-block;">
        <el-table
          :data="dataList"
          v-loading="dataListLoading"
          @selection-change="selectionChangeHandle"
          style="width: 100%;"
          height="700"
        >
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column type="index" align="center" width="70" label="序号"></el-table-column>
          <el-table-column prop="taskName" header-align="center" align="center" label="任务名称"></el-table-column>
          <el-table-column header-align="center" align="center" label="任务负责人">
            <template slot-scope="scope">
              <span
                v-for="(item,index) in scope.row.responsibleList"
                :key="index"
              >{{item.name}}&nbsp;&nbsp;</span>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" label="任务参与人">
            <template slot-scope="scope">
              <span
                v-for="(item,index) in scope.row.mailContactorList"
                :key="index"
              >{{item.name}}&nbsp;&nbsp;</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="gmtCreate"
            header-align="center"
            align="center"
            label="发布时间"
            width="270"
          ></el-table-column>
          <el-table-column
            prop="statusString"
            header-align="center"
            align="center"
            label="任务状态"
            width="150"
          >
            <template slot-scope="scope">
              <span
                :style="{color:scope.row.statusString==='已执行'?'#0BD295':(scope.row.statusString==='执行中'?'#F2B626':'#606266')}"
              >{{scope.row.statusString}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="type" header-align="center" align="center" label></el-table-column> -->
          <el-table-column header-align="center" align="center" width="100" label="操作">
            <template slot-scope="scope">
              <div style="display:flex;justify-content:space-between;">
                <el-tooltip class="item" effect="dark" content="修改" placement="top">
                  <span class="edit" @click="updateHandle(scope.row.id)"></span>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <span class="delete" @click="openView(scope.row.id,'删除')"></span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          style="margin-left:50%;transform: translateX(-50%);width:100%;"
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[20, 30, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>

    <!-- 树状, 查看，修改-->
    <el-dialog :title="dialogtitle" :visible.sync="dialogVisible" width="40%">
      <el-form :modal="treeForm" ref="treeForm">
        <el-form-item label="分组名称" size="large" label-width="100px">
          <el-input
            :readonly="groupingdisabled"
            placeholder="请输入内容"
            v-model="treeForm.currentTreename"
            clearable
            style="margin-bottom: 10px"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="分组类型" size="large" label-width="100px">
           <el-select v-model="treeForm.type" placeholder="请选择">
              <el-option v-for="item in typeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-form-item>-->
        <el-form-item label="分组描述" size="large" label-width="100px">
          <el-input
            placeholder="分组描述"
            v-model="treeForm.groupingdescription"
            clearable
            :readonly="groupingdisabled"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="dialogtitle==='修改分组'">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submittingbygroups">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除 -->
    <change-status ref="changeStatusView" @deleteHandle="deleteHandle"></change-status>
  </div>
</template>

<script>
import riskvehicleblacklistTree from './taskManagement-tree'
import changeStatus from '../../Troubleshooting/Resumption/changeStatus'
export default {
  name:'taskManagement',
  data () {
    return {
      dataForm: {
        key: '',
        status: '',
        taskType: '',
        search: '',
        time: '',
      },
      typeData: [],
      statusData: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      // 树形
      modifiedUserList: [],
      modifiedUserProps: {
        children: 'children',
        label: 'name'
      },
      Treeexpansion: false,
      // 修改||查看分组弹出框
      dialogVisible: false,
      // 修改分组或者查看分组
      dialogtitle: '',
      treeForm: {
        // 分组名字
        currentTreename: '',
        // 分组描述
        groupingdescription: '',
        type: 0
      },
      // 修改||查看分组Form表单是否可用
      groupingdisabled: false,
    }
  },
  components: {
    riskvehicleblacklistTree
  },
  created () {
    this.handleTaskType()
    this.handleStatusType()
    if (this.$route.query.page) {
      this.pageIndex = this.$route.query.page
    }
    this.getDataList()
  },
  methods: {
     // 获取任务类型
    handleTaskType () {
      this.$http({
        url: this.$http.adornUrl(`/event/eventType/selectTypeByTypeFlagParentNoZero`),
        method: 'get',
        params: this.$http.adornParams({ typeFlag: 8})
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.typeData = data.list
        } else {
          this.$message.error(data.code)
        }
      })
    },
     // 获取状态类型
    handleStatusType () {
      this.$http({
        url: this.$http.adornUrl(`/sys/sysdictionary/getSysDictionaryListByCode`),
        method: 'get',
        params: this.$http.adornParams({ code: 'task_status'})
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data)
          this.statusData = data.data
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/task/taskInfor/list'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          status: this.dataForm.status,
          taskType: this.dataForm.taskType,
          search: this.dataForm.search,
          startTime: this.dataForm.time?this.dataForm.time[0]:"",
          endTime: this.dataForm.time?this.dataForm.time[1]:"",
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data)
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
          this.$message.error(data.msg);
        }
        this.dataListLoading = false
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
    // 新增
    addHandle (id) {
      // this.addOrUpdateVisible = true
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.init(id)
      // })

      this.$router.push({
        path: '/taskManagement-add',
        name: 'taskManagement-add',
        // query: {
        //   // status: status,
        //   // grade: grade,
        //   // rpPlanId: rpPlanId,
        //   // rpTypeFlag: rpTypeFlag,
        //   // eventTypeId: eventTypeId
        // }
      })
    },
    // 修改
    updateHandle (id) {
      // this.addOrUpdateVisible = true
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.init(id)
      // })
      this.$router.push({
        path: '/taskManagement-update',
        name: 'taskManagement-update',
        query: {
          id,
          page: this.pageIndex,
        }
      })
    },
    // 删除
    deleteHandle (id) {
       var ids = this.currentId
        ? [this.currentId]
        : this.dataListSelections.map(item => {
            return item.id;
          });
      this.$http({
        url: this.$http.adornUrl("/buss/bussRegister/delete"),
        method: "post",
        data: this.$http.adornData({ ids })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1500,
            onClose: () => {
              this.getDataList();
            }
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 点击树形节点事件
    handleNodeClick (obj) {
      // console.log("handleNodeClick",obj)
      function findChilden (obj, list) {
        list.push(obj.id)
        let children = obj.children
        // console.log(list)
        if (children != null) {
          children.forEach((item, index) => {
            // console.log(item)
            findChilden(item, list)
          })
        }
      }
    
      // console.log('树形结点点击事件', obj)
      this.selectedNode = []
      this.currentTreeObject = obj.id
      this.treeForm.currentTreename = obj.name
      this.search = ''
      // 分组描述
      this.treeForm.groupingdescription = obj.remark
      this.treeForm.type = obj.type
      this.currentTreeplatformId = obj.platformId
      this.currentTreeparentId = obj.parentId
      this.currentTreeancestors = obj.ancestors
      this.currentTreeorderNum=obj.orderNum

      findChilden(obj, this.selectedNode = [])

      // console.log('selectedNode:' + this.selectedNode)
      // console.log(this.currentTreeObject)
      // console.log(this.treeForm.currentTreename)
      // 查询树形关联的联系人
      this.$http({
        url: this.$http.adornUrl(`/risk/riskcamera/list`),
        method: 'POST',
        data: this.$http.adornData({
          key:this.dataForm.key,
          cameraType:this.cameraType,
          limit: this.pageSize,
          page: 1,
          groupId: this.selectedNode
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data)
          this.totalCount = data.data.totalCount
          this.currPage = data.data.currPage
          this.pageSize = data.data.pageSize
          this.platShareMenuList = data.data.list
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    // 查看分组
    showEventType () {
      this.dialogVisible = true
      this.dialogtitle = '查看分组'
      this.groupingdisabled = true
    },
    // 添加分组
    addEventType () {
      this.eventtypeAddOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.eventtypeAddOrUpdate.init(null, null, 2) // 代表新增
      })
    },
    // 修改分组名称
    updateEventType (rows) {
      // console.log(this.treeForm.currentTreename)
      this.dialogVisible = true
      this.dialogtitle = '修改分组'
      this.groupingdisabled = false
    },
    
    // 删除状态
    openView(id, title) {
      this.currentId = id;
      this.$refs.changeStatusView.init(id, '', title);
    },
    // 删除分组
    deleteEventType (ids) {
      var that = this
      this.$confirm(`确定对进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var checkedNames = ''
        if (that.checkedNodes.length > 0) {
          that.checkedNodes.forEach(item => {
            if (item.system === 1) {
              checkedNames += item.name
            }
          })
        }

        setTimeout(() => {
          if (checkedNames) {
            that.$message({
              message: `${checkedNames}删除失败`,
              type: 'error',
              duration: 1500
            })
            return 0
          }
          that.$http({
            url: that.$http.adornUrl(
            `/risk/riskcameragroup/delete`
          ),
            method: 'POST',
            data: this.$http.adornData({
              ids:that.checkedIds
            })
          // data: that.$http.adornData(id)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              that.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
              that.getDataList()
            } else {
              that.$message.error(data.msg)
            }
          })
        })
      })
    },
    // 树形复选框勾选ID
    setCheckedIds (checkedIds, checkedNodes) {

      this.checkedIds = checkedIds
      // console.log('this.checkedIds', this.checkedIds)
      this.checkedNodes = checkedNodes
    },
    // 分组修改提交
    submittingbygroups () {
      if (!this.treeForm.currentTreename) {
        this.$message.error('分组名称不能为空')
      } else {
        this.dialogVisible = false
        this.$http({
          url: this.$http.adornUrl(`/risk/riskcameragroup/update`),
          method: 'post',
          data: this.$http.adornData({
            id: this.currentTreeObject,
            name: this.treeForm.currentTreename,
            parentId:this.currentTreeparentId,
            ancestors:this.currentTreeancestors,
            orderNum:this.currentTreeorderNum,
            remark: this.treeForm.groupingdescription
          })
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
          this.$message.error(data.msg);
        }
        })
      }
    }

  },
  components:{
    changeStatus,
  }
  
}
</script>
<style scoped lang="scss">
.searchIcon {
  width: 22px;
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 1;
}
.edit {
  width: 13.99px;
  height: 15.96px;
  cursor: pointer;
  background: url(../../../../assets/img/ElectronicPass/edit.svg) no-repeat;
  background-size: 13.99px 15.96px;
}
.edit:hover {
  width: 13.99px;
  height: 15.96px;
  background: url(../../../../assets/img/ElectronicPass/editHover.png) no-repeat;
  background-size: 13.99px 15.96px;
}
// /deep/ .el-date-editor .el-range-separator {
//   padding: 0;
//   padding-right: 17px;
// }
</style>