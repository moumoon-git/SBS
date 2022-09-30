<template>
  <!-- 车辆黑名单信息 -->
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <!-- <el-form-item>
        <el-select clearable placeholder="请选择区域" v-model="dataForm.townName" style="width:10vw;min-width:150px">
          <el-option v-for="item in areaData" :key="item.townName" :label="item.townName" :value="item.townName"></el-option>
        </el-select>
      </el-form-item>
       <el-form-item>
        <el-select clearable placeholder="请选择隐患状态" v-model="dataForm.status" style="width:10vw;min-width:180px">
          <el-option v-for="item in statusData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select clearable placeholder="请选择人员类型" v-model="dataForm.type" style="width:10vw;min-width:180px">
          <el-option v-for="item in humanType" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item> -->


      <!-- <el-form-item>
        <el-date-picker
          v-model="dataForm.time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          style="width:15vw;min-width:270px">
        </el-date-picker>
      </el-form-item> -->

      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="请输入地址、登记人员姓名" clearable style="width:11vw;min-width:180px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <!-- <el-button v-if="isAuth('risk:riskvehiclealarm:save')" @click="addOrUpdateHandle()">发布任务</el-button> -->
        <!-- <el-button>导出</el-button> -->
        <!-- <el-button v-if="isAuth('risk:riskvehiclealarm:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
        <el-dropdown style="margin: 5px;">
        <el-button
            style="width:150px"
            >导出答案数据</el-button>
          <el-dropdown-menu slot="dropdown" split-button="true" >
            <el-dropdown-item @click.native="exportExcel()">导出勾选表格数据</el-dropdown-item>
            <el-dropdown-item @click.native="exportExcelAll()">导出条件查询数据</el-dropdown-item>
          </el-dropdown-menu>
          </el-dropdown>
      </el-form-item>
    </el-form>
    <div style="width:100%;position:relative;">
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
      </div> -->
      <div style="width: 100%;min-width: 540px;display:inline-block;">
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;" >
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <!-- <el-table-column prop="id" header-align="center" align="center" label></el-table-column> -->
          <el-table-column prop="areaTownGridNameString" header-align="center" align="center" label="企业地点"></el-table-column>
          <el-table-column prop="imName" header-align="center" align="center" label="企业名称" ></el-table-column>
          <el-table-column prop="humanTypeString" header-align="center" align="center" label="企业类型" width="250"></el-table-column>
          <el-table-column prop="gmtCreate" header-align="center" align="center" label="上报时间" width="250"></el-table-column>
          <el-table-column prop="remark" header-align="center" align="center" label="备注"></el-table-column>
          <el-table-column prop="investigateResultString" header-align="center" align="center" label="状态" width="120"></el-table-column>
          <!-- <el-table-column prop="type" header-align="center" align="center" label></el-table-column> -->
          <el-table-column fixed="right" header-align="center" align="center" width="120" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination style="margin-left:50%;transform: translateX(-50%);width:100%;"
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>

      </div>
      
      
    </div>

    <!-- 树状, 查看，修改-->
    <el-dialog :title="dialogtitle" :visible.sync="dialogVisible" width="40%">
      <el-form  :modal="treeForm" ref="treeForm">
        <el-form-item label="分组名称" size="large" label-width="100px">
          <el-input
            :readonly="groupingdisabled"
            placeholder="请输入内容"
            v-model="treeForm.currentTreename"
            clearable
            style="margin-bottom: 10px"
          >
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="分组类型" size="large" label-width="100px">
           <el-select v-model="treeForm.type" placeholder="请选择">
              <el-option v-for="item in typeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-form-item> -->
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
    
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList()"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './EnterpriseDeclare-add-or-update'
import riskvehicleblacklistTree from './EnterpriseDeclare-tree'
import Cookies from "js-cookie";

export default {
  name:'EnterpriseDeclare',
  data () {
    return {
      dataForm: {
        key: '',
        time: '',
        status: '',
        type: '',
        townName: '',
      },
      areaData: [],
      statusData: [{name:'正常',id:1},{name:'异常',id:2}],
      humanType: [{name:'持续在穗人员',id:1},{name:'外地返穗人员（非湖北）',id:2},{name:'湖北返穗人员（非武汉）',id:3},{name:'武汉返穗人员',id:4}],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
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
      
      baseUrl: window.SITE_CONFIG['baseUrl'],
      platformId: this.$store.state.user.platformId
    }
  },
  components: {
    AddOrUpdate,
    riskvehicleblacklistTree
  },
  created () {
    this.handleEventType()
    this.getDataList()
    this.getAreaList()
  },
  methods: {
    

     // 获取任务类型
    handleEventType () {
      // this.$http({
      //   url: this.$http.adornUrl(`/event/eventType/selectTypeList`),
      //   method: 'get',
      //   params: this.$http.adornParams({ typeFlag: 4})
      // }).then(({ data }) => {
      //   if (data && data.code === 0) {
      //     this.typeData = data.list
      //   } else {
      //     this.$message.error(data.code)
      //   }
      // })
    },
    // 获取镇街列表
    getAreaList(){
      this.$http({
          url: this.$http.adornUrl('/wechatMobile/townList'),
          method: 'get',
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.areaData = data.list
          } else {
            this.$message.error(data.msg)
          }
        })
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/epi/epiRegister/listCompanyAndPeson'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          reportType: 3,
          search: this.dataForm.key,
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
        // console.log( data)
          this.dataList = data.data.records
          
          this.totalPage = data.data.total
        } else {
          this.dataList = []
          this.totalPage = 0
          this.$message.error(data.msg)
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
    // 新增 / 修改
    addOrUpdateHandle (HiddenDangerId) {
      // this.addOrUpdateVisible = true
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.init(id)
      // })

      this.$router.push({
        path: '/EnterpriseDeclare-add-or-update',
        name: 'EnterpriseDeclare-add-or-update',
        query: {
          HiddenDangerId: HiddenDangerId
        }
      })
    },
    // 删除
    deleteHandle (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      // console.log(ids)

      this.$confirm(
        `确定对该车辆黑名单进行${id ? '删除' : '批量删除'}操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'

        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl('/risk/riskvehicleblacklist/delete'),
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
            this.$message.error(data.msg)
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
            this.$message.error(data.msg)
          }
          
        })
      }
    },
    // 导出勾选列表答案数据
    exportExcel() {
      // console.log(multipleSelection)
      if(this.dataListSelections.length>0){
        let ids = this.dataListSelections.map(v => {
          return v.id;
        });
        window.location.href = `${
          this.baseUrl
        }/epi/epiRegister/output-excelAnswer?ids=${ids}&token=${Cookies.get("token")}`;
      }else{
        this.$message.warning("请勾选表格")
      }
    },
    // 导出条件查询答案数据
    exportExcelAll(){
      window.location.href = `${this.baseUrl}/epi/epiRegister/output-excelAnswer?page=${this.pageIndex}&limit=${this.pageSize}&search=${this.dataForm.key}&investigateResult=&humanType=&townName=&platformId=${this.platformId}&token=${Cookies.get("token")}&reportType=3`
    }

  }
  
}
</script>
<style lang="scss" scoped>
/deep/ .el-date-editor .el-range-separator{
  padding: 0;
}
</style>
