<!--@author：llp-->
<template>
  <div>
    <el-row>
      <!--树-->
      <el-col :span="5">
        <tree ref="Tree" class="tree" :treeData="treeData" @refreshData="getTerminalGroupListData"
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
              <el-table-column min-width="160" v-for="(item,key) in tableColumn" :key="key" :label="item.label"
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
    <terminal-dialog ref="TerminalDialog" @getTerminalListData="getTerminalListData"></terminal-dialog>
  </div>
</template>

<script>
  import Tree from "@/yz_components/tree/tree";
  import TerminalDialog from "./terminalDialog";

  export default {
    name: "icpVideoTerminalGroupingTable",
    components: {
      TerminalDialog,
      Tree,
    },
    data() {
      return {
        treeData: [],//树节点数据
        tableColumn: [
          {
            prop: "name",
            label: "设备名称"
          }, {
            prop: "uri",
            label: "号码"
          }
        ],//表头
        tableData: [],//表格数据
        total: 0,//数据总数
        pageSize: 10,//总页数
        currentPage: 1,//当前页数
        groupId: 0,//分组id
        searchText: '请输入姓名/单位/职位/号码',//搜索内容
        rowData: []
      }
    },
    mounted() {
      this.getTerminalGroupListData();
      this.getTerminalListData();
      this.$nextTick(() => {
        this.$refs.Tree.buttonIsShow = true;
        this.$refs.Tree.groupType = 'VideoTerminalGroup'
      });
    },
    methods: {
      //获取终端分组
      getTerminalGroupListData() {
        let data = {
          displayDefault: true
        };
        this.$api.terminalGroupList(data).then(res => {
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
      //获取终端分组详细信息
      getTerminalListData() {
        this.rowData = null
        let data = {};
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
        this.$api.terminalList(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.tableData = res.data.data;
          this.total = res.data.totalElements;
        })
      },
      //点击树方法
      handleNodeClick(data, node) {
        this.groupId = data.id;
        this.currentPage = 1;
        this.searchText = "";
        this.$emit('clearSearchText');
        this.getTerminalListData();
      },
      //改变页数查询
      handCurrentChange(val) {
        this.currentPage = val;
        this.getTerminalListData();
        this.rowData = null;
      },
      //改变每页条数查询
      handSizeChange(val) {
        this.currentPage = 1;//跳转到第一页
        this.pageSize = val;
        this.getTerminalListData();
      },
      addMsgPhone(row) {
        if (row.uri == '' || row.uri == null) {
          this.$message.warning("当前联系人号码为空");
          return;
        }
        this.$emit("handleSelectionChange", row)
      },
      //表格行内双击方法
      handleRowDbClick(row) {
        this.$nextTick(() => {
          this.$refs.TerminalDialog.isDialogVisible = true;
          this.$refs.TerminalDialog.title = "修改终端信息";
          this.$refs.TerminalDialog.getTerminalGroupListData();
          this.$refs.TerminalDialog.showData(row);
        });
      },
      //修改方法
      handleAdd() {
        this.$nextTick(() => {
          this.$refs.TerminalDialog.isDialogVisible = true;
          this.$refs.TerminalDialog.title = "新增终端信息";
          this.$refs.TerminalDialog.getTerminalGroupListData();
        });
      },
      //表格行内点击方法
      handleRowClick(row) {
        this.rowData = row;
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
          this.$confirm('将删除视频终端数据，请谨慎操作', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.removeTerminal(data).then(res => {
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
              this.getTerminalListData();
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
