<template>
  <!-- 车辆黑名单信息 -->
  <div class="mod-config">
     <el-row :gutter="20">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" style="display: flex;justify-content: flex-end;">
      <!-- <el-form-item>
        <el-input v-model="dataForm.carNum" placeholder="请输入车牌号搜索" clearable></el-input>
      </el-form-item> -->
      <!-- <el-form-item>
        <el-select clearable placeholder="请选择所属类型搜索" v-model="dataForm.controlTypeId">
          <el-option v-for="item in typeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <!-- <el-button @click="getDataList()">查询</el-button> -->
        <el-button v-if="isAuth('risk:riskvehiclealarm:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('risk:riskvehiclealarm:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
        <el-col :span="6">
            <tree
              :list="modifiedUserList"
              :listProps="modifiedUserProps"
              :bayonetTab="bayonetTabView"
              :handleTree="clickType"

              @bayonetType="getDatatree"
              @checkGroupNode="checkGroupNode"
              @showTree="showEventType"
              @addTree="addEventType"
              @updateTree="updateEventType"
              @deleteTree="deleteEventType"
              @handleNodeClickbayonet="handleNodeClickbayonet"
            ></tree>
        </el-col>

        <el-col :span="18" >
            <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;min-width:959px;height:682px;">
                <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                <!-- <el-table-column prop="id" header-align="center" align="center" label></el-table-column> -->
                <el-table-column prop="name" header-align="center" align="center" label="相机名称"></el-table-column>
                <el-table-column prop="longitude" header-align="center" align="center" label="经度" ></el-table-column>
                <el-table-column prop="latitude" header-align="center" align="center" label="纬度"></el-table-column>
                <el-table-column prop="indexCode" header-align="center" align="center" label="相机编码"></el-table-column>
                <el-table-column prop="cameraType" header-align="center" align="center" label="相机类型"></el-table-column>
                <el-table-column prop="status" header-align="center" align="center" label="状态"></el-table-column>
                <!-- <el-table-column prop="type" header-align="center" align="center" label></el-table-column> -->
                <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="synchronizationHandle(scope.row.id)">同步</el-button>
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
              :total="totalCount"
              layout="total, sizes, prev, pager, next, jumper"
            ></el-pagination>
        </el-col>
     </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDatatree()"></add-or-update>

    <!-- 监管类型 新增 -->
    <tree-add-or-updata @refreshEventTypeDataList="getDatatree" v-if="TreeAddOrUpdataVisible" ref="treeAddOrUpdata"></tree-add-or-updata>

    <!-- 监管类型 查看 / 修改 -->
    <tree-show-or-updata @refreshEventTypeDataList="getDatatree" v-if="TreeShowOrUpdataVisible" ref="treeShowOrUpdata"></tree-show-or-updata>
  </div>
</template>

<script>
import AddOrUpdate from './camera-add-or-update'
import TreeAddOrUpdata from './tree-add-or-update'
import TreeShowOrUpdata from './tree-show-or-update'
import Tree from './tree'
import { treeDataTranslate } from '@/utils'

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
      totalCount: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,

      modifiedUserList: [], // 管控类型树形结构
      modifiedUserProps: {
        children: 'children',
        label: 'name'
      },
      
      TreeAddOrUpdataVisible: false,//树形添加
      TreeShowOrUpdataVisible: false,//树形查看/修改
      clickType: 2,//判断点击哪棵树

      bayonetTabView: false, //卡口类型开关
      type: 1, //卡口类型

      bayonetData: null,//获取卡口数据
    }
  },
  components: {
    AddOrUpdate,
    Tree,
    TreeAddOrUpdata,
    TreeShowOrUpdata,
  },
  created () {
    this.handleEventType()
    this.getDatatree()
  },
  methods: {
     // 获取树形分类
    getDatatree (type) {
      this.bayonetTabView = true
      if (type || type === 0) {
        this.type = type+1
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl(`/vcm/vcmBayonetInfo/list`),
        method: 'get',
        params: this.$http.adornParams({ type: this.type })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // data.list.forEach(item => {
          //   if (item.children) {
          //     item.children = item.levels.concat(item.children)
          //   } else {
          //     item.children = item.levels
          //   }
          // })
          // this.modifiedUserList = data.list
          // console.log("/risk/riskcameragroup/tree",data)

          /**
           * @author tanjinfeng
           * @date 2020-11-13
           * @description debug: 车辆卡口树形数据无法加载
           */
          // ***原来的代码***
          // this.modifiedUserList = treeDataTranslate(data.data, 'id')
          // this.bayonetData = this.modifiedUserList[0]
          // ***修改后的代码***
          this.modifiedUserList = data.data
          this.bayonetData = ''
          // ***结束***
          
          
          //  初始化第一个卡口
          this.getDataList()
          // console.log('this.modifiedUserList++++++++++++++++++++++++++++++++++++++',this.modifiedUserList)
        }
        this.dataListLoading = false
      })
    },
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
          this.$message.error(data.code)
        }
      })
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl(`/vcm/vcmBayonetInfo/selectCameraByBayonet`),
        method: 'get',
        params: this.$http.adornParams({ 
          page: this.pageIndex,
          limit: this.pageSize,
          id: this.bayonetData.id ? this.bayonetData.id : ''
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
         
          this.dataList = data.data.list
        // console.log( this.dataList)
          this.totalCount = data.data.totalCount
        } else {
          this.dataList = []
          this.totalCount = 0
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
      // console.log(val)
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
        `确定${id ? '删除' : '批量删除'}所选相机?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl('/vcm/vcmBayonetInfo/deleteCameraByBidAndCid'),
          method: 'post',
          data: this.$http.adornData({
            id: this.bayonetData.id,
            cameras: ids
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
      })
    },
    synchronizationHandle(id){
      this.$http({
          url: this.$http.adornUrl('/risk/riskhumanblacklist/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '同步成功',
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
    },
    // 删除管控类型
    deleteEventType (data) {
      // console.log('删除事件类型', data)
      // this.deleteEventTypeHandle(data)
      if (this.checkedIds) {

        var that = this
        this.$confirm(`确定对卡口${that.bayonetData.name}以及所属子分组进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            that.$http({
              url: that.$http.adornUrl(
              `/vcm/vcmBayonetInfo/delete`
            ),
              method: 'POST',
              data: this.$http.adornData({
                ids:that.checkedIds
              })
            // data: that.$http.adornData(id)
            }).then(({ data }) => {
              if (data && data.code === 0) {
                that.$message({
                  message: '成功删除',
                  type: 'success',
                  duration: 1500
                })
                that.getDatatree()
              } else {
                that.$message.error(data.msg)
              }
            })
        })
      }else{
          this.$message.error('请勾选树节点')
      }

    },
    // 添加事件类型
    addEventType (id) {
      this.TreeAddOrUpdataVisible = true
      this.$nextTick(() => {
        this.$refs.treeAddOrUpdata.init() // 代表新增
      })
    },
    // 修改管控类型
    updateEventType (data) {
      // console.log(data.id)
      // this.TreeAddOrUpdataVisible = true
      // this.$nextTick(() => {
      //   this.$refs.treeAddOrUpdata.init(data.id)
      //   // this.$refs.treeAddOrUpdata.init(id, this.currentTreeObject, 3) // 代表修改
      // })
      this.TreeShowOrUpdataVisible = true
      this.$nextTick(() => {
        this.$refs.treeShowOrUpdata.init(this.bayonetData,2) // 代表新增
      })
    },
    // // 查看事件类型
    showEventType () {
      this.TreeShowOrUpdataVisible = true
      this.$nextTick(() => {
        this.$refs.treeShowOrUpdata.init(this.bayonetData,1) // 代表新增
      })
    },
    //树形点击触发事件
    handleNodeClickbayonet(val){
      this.bayonetData = val
      this.getDataList()
    },
    // 勾选的树形控件 全部预案id
    checkGroupNode (checkedIds) {
      this.checkedIds = checkedIds
      // this.checkedIds.splice(0, this.checkedIds.length, ...checkedIds)
      // 传值给子元素
    },
    
   
  }
}
</script>

