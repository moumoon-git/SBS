<!--@author：llp-->
<template>
  <div>
    <el-row>
      <!--树-->
      <el-col :span="5">
        <tree ref="Tree" class="tree" :treeData="treeData" @refreshData="getTalkGroupListTree"
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
            >
              <el-table-column type="index" min-width="50" :resizable="false"></el-table-column>
              <el-table-column min-width="100" v-for="(item,key) in tableColumn" :key="key" :label="item.label"
                               :prop="item.prop"
                               :width="item.width" :resizable="false"></el-table-column>
              <el-table-column label="操作" :resizable="false">
                <template slot-scope="scope">
                  <el-button type="info" size="mini" @click="addMsgPhone(scope.row)">添加</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <!--分页-->
          <el-row>
            <el-pagination class="pagination" :page-size="pageSize" :page-sizes="[10,20,30,40]" :total="total"
                           :current-page="currentPage"
                           @current-change="handCurrentChange"
                           @size-change="handSizeChange"
                           layout="total, prev, pager, next, sizes, jumper"></el-pagination>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <cluster-dialog ref="ClusterDialog" @getTableData="getTableData"></cluster-dialog>
  </div>
</template>

<script>
  import TelephoneTable from "@/yz_components/table/telePhoneTable";
  import Tree from "@/yz_components/tree/tree";
  import ClusterDialog from "./clusterDialog";

  export default {
    name: "clusterGroupingTable",
    components: {
      ClusterDialog,
      Tree,
      TelephoneTable
    },
    data() {
      return {
        treeData: [],//树节点数据
        tableColumn: [
          {
            prop: "name",
            label: "设备名称"
          },
          {
            prop: "number",
            label: "号码"
          },
          {
            prop: "remark",
            label: "备注"
          },],//表头
        tableData: [],//表格数据
        total: 0,//数据总数
        pageSize: 10,//总页数
        currentPage: 1,//当前页数
        groupId: 0,//分组id
        searchText: '',//搜索内容
        rowData: []
      }
    },
    mounted() {
      this.getTalkGroupListTree();
      this.getTableData();
      this.$nextTick(() => {
        this.$refs.Tree.buttonIsShow = true;
        this.$refs.Tree.groupType = 'GroupTalk'
      });
    },
    methods: {
      //获取集群分组
      getTalkGroupListTree() {
        let data = {
          displayDefault: true
        };
        this.$api.talkGroupListTree(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }
          this.treeData = res.data;
        })
      },
      //获取表格数据
      getTableData() {
        this.rowData = null;
        let data;
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
        this.$api.talkGroupList(data).then(res => {
          if (res.errorcode !== 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.total = res.data.totalElements;
          this.tableData = res.data.data;
        })
      },
      //树点击方法
      handleNodeClick(data, node) {
        this.currentPage = 1;//跳转到第一页
        this.groupId = data.id;
        this.searchText = ''
        this.$emit('clearSearchText');
        this.getTableData();
      },
      //改变页数查询
      handCurrentChange(val) {
        this.currentPage = val;
        this.getTableData();
      },
      //改变每页条数查询
      handSizeChange(val) {
        this.currentPage = 1;//跳转到第一页
        this.pageSize = val;
        this.getTableData();
      },
      //把表格中的数据添加到列表中
      addMsgPhone(row) {
        if (row.number == '' || row.number == null) {
          this.$message.warning("当前联系人号码为空");
          return;
        }
        this.$emit("handleSelectionChange", row)
      },
      //表格行内点击方法
      handleRowClick(row) {
        this.rowData = row;
      },
      //表格行内双击方法
      handleRowDbClick(row) {
        this.$nextTick(() => {
          this.$refs.ClusterDialog.isDialogVisible = true;
          this.$refs.ClusterDialog.title = "修改集群信息";
          this.$refs.ClusterDialog.getTalkGroupListTree();
          this.$refs.ClusterDialog.showData(row);
        });
      },
      //新增方法
      handleAdd() {
        this.$nextTick(() => {
          this.$refs.ClusterDialog.isDialogVisible = true;
          this.$refs.ClusterDialog.title = "新增集群信息";
          this.$refs.ClusterDialog.getTalkGroupListTree();
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
      //删除方法
      handleDelete() {
        if (this.rowData == "") {
          this.$message({
            message: "请选中表格中任意行进行删除!",
            type: "warning"
          });
          return;
        } else {
          let data = {
            id: this.rowData.id,
          };
          this.$confirm('将删除集群数据及所有关联分组，请谨慎操作', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.removeTalkGroup(data).then(res => {
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
              this.getTableData();
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
