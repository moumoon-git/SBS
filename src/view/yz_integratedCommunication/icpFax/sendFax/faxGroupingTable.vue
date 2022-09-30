<!--@author：llp-->
<template>
  <div>
    <el-row>
      <!--树-->
      <el-col :span="5">
        <tree ref="Tree" class="tree" :treeData="treeData" @refreshData="getFaxGroupingListTree"
              @handleNodeClick="handleNodeClick"></tree>
      </el-col>
      <!--表格-->
      <el-col :span="19">
        <div class="tableContainer">
          <el-row>
            <el-table ref="singleTable" :data="tableData" highlight-current-row
                      :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                      @row-click="handleRowClick"
                      @row-dblclick="handleRowDbClick"
                      max-height="586px">
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
    <!--联系人弹窗-->
    <contact-details-popup ref="ContactDetailsPopup" @getContactorList="getContactorList"></contact-details-popup>
  </div>
</template>

<script>
  import Tree from "@/yz_components/tree/tree";
  import ContactDetailsPopup from "@/view/yz_integratedCommunication/contactDetailsPopup";

  export default {
    name: "faxGroupingTable",
    components: {
      ContactDetailsPopup,
      Tree,
    },
    data() {
      return {
        treeData: [],//树节点数据
        tableColumn: [
          {
            prop: "name",
            label: "姓名"
          }, {
            prop: "workUnit",
            label: "单位"
          }, {
            prop: "position",
            label: "职位"
          }, {
            prop: "fax",
            label: "传真电话"
          }],//表头
        tableData: [],//表格数据
        total: 0,//数据总数
        pageSize: 10,//总页数
        currentPage: 1,//当前页数
        groupId: 0,//分组id
        searchText: '',//搜索内容
        isDialogVisible: '请输入姓名/单位/职位/号码',//新增联系人弹窗
        rowData: []
      }
    },
    mounted() {
      this.getFaxGroupingListTree();
      this.getContactorList();
      this.$nextTick(() => {
        this.$refs.Tree.buttonIsShow = true;
        this.$refs.Tree.groupType = "faxgroup";
      });
    },
    methods: {
      //获取联系人数据
      getContactorList() {
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
        this.$api.contactorList(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.tableData = res.data.list;
          this.total = res.data.totalCount;
        })
      },
      //获取传真分组
      getFaxGroupingListTree() {
        let data = {
          displayDefault: true
        };
        this.$api.faxGroupList(data).then(res => {
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
      //树点击方法
      handleNodeClick(data, node) {
        this.currentPage = 1;//跳转到第一页
        this.groupId = data.id;
        this.searchText = "";
        this.$emit('clearSearchText');
        this.getContactorList();
      },
      //新增联系人方法
      handleAdd() {
        //新增分组方法

        //新增联系人方法
        this.$nextTick(() => {
          this.$refs.ContactDetailsPopup.isDialogVisible = true;
          this.$refs.ContactDetailsPopup.title = "新增联系人";
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
        if (this.rowData == ""|| this.rowData == null) {
          this.$message({
            message: "请选中表格中任意行进行删除!",
            type: "warning"
          });
          return;
        } else {
          let data = {
            data: {id: this.rowData.id},
            operate: 2,
          };
          this.$confirm('删除当前信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.updateConcator(data).then(res => {
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
              this.getContactorList();
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除!'
            });
          });
        }
      },
      //表格行点击方法
      handleRowClick(row) {
        this.rowData = row;
      },
      //表格行双击方法
      handleRowDbClick(row) {
        this.$nextTick(() => {
          this.$refs.ContactDetailsPopup.isDialogVisible = true;
          this.$refs.ContactDetailsPopup.title = "修改联系人";
          this.$refs.ContactDetailsPopup.getTree();
          this.$refs.ContactDetailsPopup.showData(row);
        });
      },
      //把表格内的联系号码添加到列表
      addMsgPhone(row) {
        if (row.fax == '' || row.fax == null) {
          this.$message.warning("当前联系人号码为空");
          return;
        }
        this.$emit("handleSelectionChange", row)
      },
      //改变查询的页数
      handCurrentChange(val) {
        this.currentPage = val;
        this.getContactorList();
      },
      //改变每页查询条数
      handSizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        this.getContactorList();
      },
      //导出联系人为excel文件
      handleExportContactor(){
        if(this.groupId == -1){
          this.$message.warning("未分组联系人不能另存为excel文件");
          return;
        }
        if (this.groupId == null || this.groupId == "" ||
          this.groupId == undefined) {
          this.$message.warning("请先选择一个分组");
          return;
        }
        window.location.href = window.g.ApiUrl +"/eos/communication/contactor/export?groupId=" + this.groupId;
      }
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
