<template>
  <!-- 车辆黑名单信息 -->
  <div class="mod-config">
          <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <!-- <el-form-item>
        <el-input v-model="dataForm.carNum" placeholder="请输入车牌号搜索" clearable></el-input>
      </el-form-item> -->
      <el-form-item>
        <el-select clearable placeholder="请选择所属类型搜索" v-model="dataForm.controlTypeId">
          <el-option v-for="item in typeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('risk:riskvehiclealarm:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('risk:riskvehiclealarm:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
          </el-form>
            <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
                <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                <!-- <el-table-column prop="id" header-align="center" align="center" label></el-table-column> -->
                <el-table-column prop="carNum" header-align="center" align="center" label="车牌号"></el-table-column>
                <el-table-column prop="carType" header-align="center" align="center" label="车辆类型" ></el-table-column>
                <el-table-column prop="owner" header-align="center" align="center" label="车主名称"></el-table-column>
                <el-table-column prop="phone" header-align="center" align="center" label="联系电话"></el-table-column>
                <el-table-column prop="controlTypeName" header-align="center" align="center" label="管控类型"></el-table-column>
                <el-table-column prop="remark" header-align="center" align="center" label="备注"></el-table-column>
                <!-- <el-table-column prop="type" header-align="center" align="center" label></el-table-column> -->
                <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                    <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
            </el-table>
            <el-pagination
              @size-change="sizeChangeHandle"
              @current-change="currentChangeHandle"
              :current-page="pageIndex"
              :page-sizes="[12, 20, 50, 100]"
              :page-size="pageSize"
              :total="totalPage"
              layout="total, sizes, prev, pager, next, jumper"
            ></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList()"></add-or-update>

  </div>
</template>

<script>
import AddOrUpdate from './camera-add-or-update'

export default {
  data () {
    return {
      dataForm: {
        key: '',
        controlTypeId: '',
        carNum: ''
      },
      typeData: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 12,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,

      TreeAddOrUpdataVisible: false,//树形添加或修改切换
    }
  },
  components: {
    AddOrUpdate,
  },
  created () {
    this.handleEventType()
  },
  activated () {
    this.getDataList()
    this.getDatatree()
  },
  methods: {
     // 获取隐患类型
    handleEventType () {
      this.$http({
        url: this.$http.adornUrl(`/event/eventType/selectTypeList`),
        method: 'get',
        params: this.$http.adornParams({ typeFlag: 4, isTree: '1' })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.typeData = data.list
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/risk/riskvehicleblacklist/list'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
          controlTypeId: this.dataForm.controlTypeId,
          carNum: this.dataForm.carNum
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.page.list.map(v=>{
              switch (v.carType){
                case "0":v.carType = '其它车型';
                break;
                case "1":v.carType = '客车';
                break;
                case "2":v.carType = '货车';
                break;
                case "3":v.carType = '轿车';
                break;
                case "4":v.carType = '面包车';
                break;
                case "5":v.carType = '小货车';
                break;
                case "6":v.carType = '行人';
                break;
                case "7":v.carType = '二轮车';
                break;
                case "8":v.carType = '三轮车';
                break;
                case "9":v.carType = 'SUV/MPV';
                break;
                case "10":v.carType = '中型客车';
                break;
              }
          })
          this.dataList = data.page.list
        // console.log( this.dataList)
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
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
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

      findChilden(obj, this.selectedNode = [])

      // console.log('selectedNode:' + this.selectedNode)
      // console.log(this.currentTreeObject)
      // console.log(this.treeForm.currentTreename)
      // console.log({
      //     limit: this.pageSize,
      //     page: 1,
      //     groupId: this.selectedNode
      //   })
      // 查询树形关联的联系人
      this.$http({
        url: this.$http.adornUrl(`/risk/riskhumanblacklist/list-by-type`),
        method: 'get',
        params: this.$http.adornParams({
          limit: this.pageSize,
          page: 1,
          eventTypeId: this.selectedNode.join()
        })
      }).then(({ data }) => {
          if(data && data.code === 0) {
            // console.log("/risk/riskhumanblacklist/list",data)
            this.totalPage = data.data.totalCount
            this.pageIndex = data.data.currPage
            this.pageSize = data.data.pageSize
            this.dataList = data.data.list
          }else{
            this.$message.error(data.msg);
          }
      })
    },
    // 删除管控类型
    deleteEventType (data) {
      // console.log('删除事件类型', data)
      // this.deleteEventTypeHandle(data)

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
            `/risk/riskHumanBlacklistGroup/delete`
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
              that.getDatatree()
            } else {
              that.$message.error(data.msg)
            }
          })
        })
      })
    },// 修改管控类型
    updateEventType (data) {
      // console.log(data.id)
      // this.TreeAddOrUpdataVisible = true
      // this.$nextTick(() => {
      //   this.$refs.treeAddOrUpdata.init(data.id)
      //   // this.$refs.treeAddOrUpdata.init(id, this.currentTreeObject, 3) // 代表修改
      // })
      // console.log(this.treeForm.currentTreename)
      this.dialogVisible = true
      this.dialogtitle = '修改分组'
      this.groupingdisabled = false
    },
    // 查看事件类型
    showEventType (id) {
      // this.eventtypeAddOrUpdateVisible = true
      // this.$nextTick(() => {
      //   this.$refs.eventtypeAddOrUpdate.init(id, this.currentTreeObject, 1) // 1代表查看
      // })
      this.dialogVisible = true
      this.dialogtitle = '查看分组'
      this.groupingdisabled = true
    },
    // 勾选的树形控件 全部预案id
    checkGroupNode (checkedIds) {
      this.checkedIds = checkedIds
      // this.checkedIds.splice(0, this.checkedIds.length, ...checkedIds)
      // 传值给子元素
    },
    // 添加事件类型
    addEventType (id) {
      this.TreeAddOrUpdataVisible = true
      this.$nextTick(() => {
        this.$refs.treeAddOrUpdata.init(null,null,2) // 代表新增
      })
    },
  }
}
</script>
