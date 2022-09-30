<!--@author：llp-->
<template>
  <div>
    <el-row>
      <!--树-->
      <el-col :span="5">
        <tree ref="Tree" class="tree" :treeData="treeData" @refreshData="getVideoGroupTree"
              @handleNodeClick="handleNodeClick"></tree>
      </el-col>
      <!--表格-->
      <el-col :span="19">
        <div class="tableContainer">
          <el-row>
            <el-table ref="singleTable" :data="tableData" highlight-current-row
                      :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                      max-height="586px"
                      @row-click="handleRowClick"
                      @row-dblclick="handleRowDbClick"
                      v-loading="myLoading"
            >
              <el-table-column type="index" min-width="50" :resizable="false"></el-table-column>
              <el-table-column min-width="160" v-for="(item,key) in tableColumn" :key="key" :label="item.label"
                               :prop="item.prop"
                               :width="item.width" :resizable="false"
              ></el-table-column>
              <el-table-column label="操作" :resizable="false" width="150">
                <template slot-scope="scope">
                  <el-button type="info" size="mini" @click="addMsgPhone(scope.row)">添加</el-button>
                  <el-button type="info" size="mini" @click="Preview(scope.row)">预览</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <!--分页-->
          <el-row>
            <el-pagination class="pagination" :page-size="pageSize" :page-sizes="[10,20,30,40]" :total="total"
                           :current-page="currentPage"
                           @current-change="handleCurrentChange"
                           @size-change="handleSizeChange"
                           layout="total, prev, pager, next, sizes, jumper"></el-pagination>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <video-dialog ref="VideoDialog" @getVideoList="getVideoList"></video-dialog>
  </div>
</template>

<script>
  import Tree from "@/yz_components/tree/tree";
  import VideoDialog from "@/view/yz_integratedCommunication/icpVideo/videoDialog";

  export default {
    name: "icpVideoGroupingTable",
    components: {
      VideoDialog,
      Tree,
    },
    data() {
      return {
        HWICP_Version: window.g.HWICP_Version,//icp版本
        treeData: [],//树节点数据
        tableColumn: [
          {
            prop: "name",
            label: "设备名称"
          }, {
            prop: "indexCode",
            label: "号码",
          }],//表头
        agent_id:'',//坐席ID
        tableData: [],//表格数据
        total: 0,//数据总数
        pageSize: 10,//总页数
        currentPage: 1,//当前页数
        groupId: -1,//分组id
        searchText: '请输入姓名/单位/职位/号码',//搜索内容
        rowData: [],//每行数据
        myLoading:false,//表格loadding加载
      }
    },
    mounted() {
      this.agent_id = sessionStorage.getItem("agent_id");
      this.getVideoGroupTree();
      this.getVideoList();
      this.$nextTick(() => {
        this.$refs.Tree.buttonIsShow = true;
        this.$refs.Tree.groupType = "VideoGroup";
      });
    },
    methods: {
      //获取视频分组树
      getVideoGroupTree() {
        let data = {
          displayDefault: true
        };
        this.$api.videoGroupList(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.treeData = res.data;
        })
      },
      //获取设备信息
      getVideoList() {
        this.rowData = null;
        let data = {};
        this.myLoading = true;
        if (this.searchText == "") {
          data = {
            groupId: this.groupId,
            page: this.currentPage,
            size: this.pageSize,
            searchText: this.searchText,
          };
        } else {
          data = {
            page: this.currentPage,
            size: this.pageSize,
            searchText: this.searchText,
          };
        }
        this.$api.getVideoList(data).then(res => {
          this.myLoading =false;
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }

          this.tableData = res.data.data;
          this.total = res.data.totalElements;
        }).catch(err =>{
          this.myLoading =false;
        });
      },
      //改变查询页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getVideoList();
      },
      //改变每页查询条数
      handleSizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        this.getVideoList();
      },
      //树点击方法
      handleNodeClick(data) {
        this.currentPage = 1;
        this.groupId = data.id;
        this.searchText = "";
        this.$emit('clearSearchText');
        this.getVideoList();
      },
      addMsgPhone(row) {
        if (row.indexCode == '' || row.indexCode == null) {
          this.$message.warning("当前号码为空");
          return;
        }
        this.$emit("handleSelectionChange", row)
      },
      //表格行内双击方法
      handleRowDbClick(row) {
        this.$nextTick(() => {
          this.$refs.VideoDialog.isDialogVisible = true;
          this.$refs.VideoDialog.title = "视频设备信息";
          this.$refs.VideoDialog.getVideoGroupTree();
          this.$refs.VideoDialog.showData(row);
        });
      },
      //修改方法
      handleEdit() {
        if (this.rowData == "" || this.rowData == undefined || this.rowData == null) {
          this.$message({
            message: "请选中表格中任意行或双击任意行进行修改!",
            type: "warning"
          });
          return;
        } else {
          this.handleRowDbClick(this.rowData);
        }
      },
      //表格行内单机方法
      handleRowClick(row) {
        this.rowData = row;
      },
      //删除方法
      handleDelete() {
        if (this.rowData == "" || this.rowData == null) {
          this.$message({
            message: "请选中表格中任意行进行删除!",
            type: "warning"
          });
          return;
        } else {
          let data = {
            id: this.rowData.id,
            groupId: this.rowData.groupId,
          };
          //console.log(data)

          this.$confirm('将删除视频设备数据，请谨慎操作', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.videoremoveGroup(data).then(res => {

              if (res.errorcode != 0) {
                this.$message({
                  message: res.msg,
                  type: "error"
                });
                return;
              }

              this.$message({
                message: "删除成功!",
                type: "success"
              });
              this.getVideoList();
              this.rowData = null;
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除!'
            });
          });
        }
      },
      //视频预览方法
      Preview(row){
        // console.log(row)
        if (this.HWICP_Version == 'HWICP-19.0') {
            this.$icp19.ICPStartRealPlay(Number(this.agent_id),0,row.indexCode,0)
        }
      },
      //刷新分组
      refreshGroupData(){
        this.getVideoGroupTree();
        this.$nextTick(()=>{
          this.$refs.Tree.treeData = this.treeData;
        })
      },
    }
  }
</script>

<style scoped>
  .tree {
    margin-right: 16px;
    margin-bottom: 24px
  }

  >>> .el-table::before {
    height: 0;
  }

  .pagination {
    margin-top: 16px;
    padding: 0;
  }

  >>> .el-pagination__jump {
    margin-left: 0;
  }

  .tableContainer {
    height: 664px;
    margin-right: 16px;
    padding: 6px;
    border: 1px solid rgba(211, 215, 219, 1);
  }


</style>
