<template>
  <div class="noticeListWrap">
    <el-header
      style="height: 80px;padding: 24px 16px; clear: both;border:1px solid rgba(219, 219, 219, 1);border-radius:3px;"
      class="left"
    >
      <equipment-header ref="header"
                     @searchHandle="searchHandle"
                     @addOrUpdateHandle="addOrUpdateHandle">
      </equipment-header>

    </el-header>

    <div style="height:8px;width:100%;background: rgb(240, 243, 244);"></div>

    <div style="width: 100%; display: flex; padding: 32px 16px 0px;">
      <!-- 树形控件 -->
      <div style="width:15%;min-width:320px;">
        <equipment-tree
          :list="equipmentUnitList"
          :listProps="equipmentUnitProps"
          :Treeexpansion="Treeexpansion"
          @handleNodeClick="handleNodeClick"
          @showTree="showEventType"
          @addTree="addEventType"
          @updateTree="updateEventType"
          @deleteTree="deleteEventType"
          @setCheckedIds="setCheckedIds"
        >
        </equipment-tree>
      </div>

      <!--表格列表-->
      <div class="equipment-mod-config">

        <!--表格-->
        <equipment-table
          ref="table"
          :tableData="dataList"
          @formFindHandleClick="formFindHandleClick"
          @formCloseHandleClick="formCloseHandleClick"
        >
        </equipment-table>

        <!--分页-->
        <div>
          <el-pagination style="margin-top:50px;"
                         @size-change="sizeChangeHandle"
                         @current-change="currentChangeHandle"
                         :current-page="pageIndex"
                         :page-sizes="[10, 20, 30, 50]"
                         :page-size="pageSize"
                         :total="totalPage"
                         layout="total, sizes, prev, pager, next, jumper"
          ></el-pagination>
        </div>

      </div>

    </div>

    <!-- 树状, 查看，修改-->
    <el-dialog :title="dialogtitle"  :visible.sync="dialogVisible" width="40%">
      <el-form :modal="treeForm" ref="treeForm">
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

    <!--树状，新增 -->
    <equipment-tree-crud
      v-if="equipmentTreeCrudVisible"
      ref="equipmentTreeCrud"
      @refreshEventTypeDataList="getDataList" @close="eventtypeAddOrUpdateVisible=false"
    ></equipment-tree-crud>

  </div>


</template>

<script>
  //头部组件
  import equipmentheader from './equipment-header'
  import equipmentTable from './equipment-table'
  import equipmenttree from './equipment-tree'
  import equipmentTreeCrud from './equipment-tree-crud'

  export default {
    data () {
      return {
        // 修改||查看分组Form表单是否可用
        groupingdisabled: false,
        // 修改分组或者查看分组
        dialogtitle: '',
        // 修改||查看分组弹出框
        dialogVisible: false,

        //增加查看分组
        equipmentTreeCrudVisible: false,

        //弹出窗
        treeForm: {
          // 分组名字
          currentTreename: '',
          // 分组描述
          groupingdescription: ''
        },

        //批量删除
        checkedNodes: [],
        checkedIds: [],

        //主页面分组树形
        equipmentUnitList: [],

        equipmentUnitProps: {
          children: 'children',
          label: 'unitName'
        },
        //是否展开节点的树
        Treeexpansion: false,

        //搜索条件
        keyword: '',
        startAt: '',
        endAt: '',
        equipmentUnitId: '',

        //设备表格列表
        dataList: [],
        selectedNode: [],

        //分页
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListSelections: [],
        addOrUpdateVisible: false,
      }
    },

    components: {
      "equipment-header": equipmentheader,
      "equipmentTable": equipmentTable,
      "equipment-tree": equipmenttree,
      'equipment-tree-crud': equipmentTreeCrud,
    },

    activated () {
      this.getTreeDataList();
      this.getDataList()
    },


    methods: {

      // 获取分组数据列表
      getTreeDataList () {
        this.$http({
          url: this.$http.adornUrl('/eq/aiEquipmentUnit/list'),
          method: 'get'
        }).then(({ data }) => {
          if (data && data.code === 0) {
              // console.log("/eq/aiEquipmentUnit/list",data)
              //分组列表
              this.equipmentUnitList = data.list;
            } else {
              this.$message.error(data.msg)
            }
          
        })

      },

      // 获取设备列表
      getDataList(){
        this.$http({
          url: this.$http.adornUrl('/eq/aiEquipment/page'),
          method: 'POST',
          data: this.$http.adornData({
            startAt: this.startAt,
            endAt: this.endAt,
            keyword: this.keyword,
            selectedNode: this.selectedNode,
            limit: this.pageSize,
            page: this.pageIndex
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            // console.log("eq/aiEquipment/page",data)
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount

          } else {
            this.dataList = []
            this.totalPage = 0
            this.$message.error(data.msg)
          }
        })
      },

      // 点击树形节点事件
      handleNodeClick (obj) {

        // console.log("点击树形节点事件",obj)
        //递归本级与所有下级节点的id
        function findChilden(obj,list){
          list.push(obj.id)
          let children = obj.children
          if(children!=null){
            children.forEach((item, index) => {
              // console.log(item)
              findChilden(item,list)
            })
          }
        }

        //调用递归
        findChilden(obj, this.selectedNode=[]);

        //调用
        // console.log("selectedNode="+this.selectedNode);

        this.getDataList();

      },



      // 分组修改提交
      submittingbygroups () {
        if (!this.treeForm.currentTreename) {
          this.$message.error('分组名称不能为空')
        } else {
          this.dialogVisible = false
          this.$http({
            url: this.$http.adornUrl(`/notice/equipmentUnit/update`),
            method: 'post',
            data: this.$http.adornData({
              id: this.equipmentUnitId,
              name: this.treeForm.currentTreename,
              typeDescribe: this.treeForm.groupingdescription
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


      // 树形复选框勾选ID
      setCheckedIds (checkedIds, checkedNodes) {
        this.checkedIds = checkedIds
        this.checkedNodes = checkedNodes
        // console.log('this.checkedIds', this.checkedIds)
      },

      // 删除分组
      deleteEventType (ids) {
        var that = this
        this.$confirm(`确定进行[删除]操作?`, '提示', {
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
                `/notice/equipmentUnit/delete/${that.checkedIds}`
              ),
              method: 'post'
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

      // 查看分组
      showEventType () {
        this.dialogVisible = true
        this.dialogtitle = '查看分组'
        this.groupingdisabled = true
      },

      // 修改分组名称
      updateEventType (rows) {
        // console.log("this.treeForm.currentTreename",this.treeForm.currentTreename)
        this.dialogVisible = true
        this.dialogtitle = '修改分组'
        this.groupingdisabled = false
      },

      // 添加分组
      addEventType () {
        this.equipmentTreeCrudVisible = true
        this.$nextTick(() => {
          //代表新增
          this.$refs.equipmentTreeCrud.init(null, null, 2)
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

      handleChange(val) {
        // console.log("点击点击点击点击点击点击",val);
      },

      //搜索查询
      searchHandle (objContent, objTime) {

        // console.log(objContent,objTime)

        this.keyword = objContent;

        var startTime;
        var endTime;
        if(objTime != null && objTime != ''){
          // 时间不为空
          startTime = objTime[0]
          endTime = objTime[1]
        }else{
          startTime = ''
          endTime = ''
        }

        this.startAt = startTime;
        this.endAt = endTime;

        this.getDataList();

      },

      //新增跳转路由
      addOrUpdateHandle(){
        this.$router.push(
          {
            path: '/noticeWarning',
            query: {}
          })
      },


      //表格操作 子组件点击查看，触发父组件方法"
      formFindHandleClick (row) {
        // 查看
        // console.log("点击查看",row)
        this.$http({
          url: this.$http.adornUrl('/eq/aiEquipment/page'),
          method: 'POST',
          data: this.$http.adornData({
            startAt: this.startAt,
            endAt: this.endAt,
            keyword: this.keyword,
            selectedNode: this.selectedNode,
            limit: this.pageSize,
            page: this.pageIndex
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            // console.log("eq/aiEquipment/page",data)
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount

          } else {
            this.dataList = []
            this.totalPage = 0
            this.$message.error(data.msg)
          }
        })

      },

      formCloseHandleClick (row) {
        //删除
        var ids = [];
        ids.push(row.id);
        // console.log("点击关闭",row)
        this.$http({
          url: this.$http.adornUrl('/eq/aiEquipment/delete'),
          method: 'POST',
          data: this.$http.adornData({
            ids: ids
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList();
          } else {
            this.$message.error(data.msg)
          }
        })

      },


    }
  }
</script>
<style scoped lang="less">

  .equipment-mod-config{
    padding: 20px;
    border: 1px solid rgba(230, 230, 230, 1);
    width: 82%;
    margin-left: 20px;
    min-width: 540px;
  }

</style>
